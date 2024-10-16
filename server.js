const express = require('express');
const sql = require("mssql/msnodesqlv8");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

var config = {
    server: ".",
    database: "MobileApp",
    driver: "msnodesqlv8",
    user: "sa",
    password: "04012003",
    options: {
        trustedConnection: false
    }
};


sql.connect(config, function (err) {
    if (err) console.log(err);
    console.log('Connected to database!');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const request = new sql.Request();
        const query = `
            SELECT a.account_id AS account_id, a.password, a.is_activity, a.email, a.username, a.role_id, ui.firstname, ui.lastname, ui.date_created, ui.id as user_id
            FROM account a
            INNER JOIN user_information ui ON a.account_id = ui.account_id
            WHERE a.username = @username
        `;

        request.input('username', sql.VarChar, username);

        const result = await request.query(query);

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const hashedPassword = user.password;

            if (user.is_activity == 0) {
                return res.status(403).json({ message: 'Tài khoản đã bị khóa. Vui lòng liên hệ với chúng tôi!' });
            }

            const match = await bcrypt.compare(password, hashedPassword);

            if (match) {
                res.json({
                    user_id: user.user_id,
                    account_id: user.account_id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    username: user.username,
                    email: user.email,
                    role_id: user.role_id,
                    date_created: user.date_created,
                });
            } else {
                res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
            }
        } else {
            res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
});

app.post('/datereports/create', async (req, res) => {
    const { reports } = req.body; 

    try {
        for (const report of reports) {
            const dateReportRequest = new sql.Request();
            const dateReportQuery = `INSERT INTO DateReport (user_id, stt, name_person, water_level_area, date, attendance_point, personal_equipment_check, confirm_sign, image_name)
                                 OUTPUT INSERTED.report_id
                                 VALUES (@userId, @stt, @name_person, @waterLevelArea, @date, @attendancePoint, @personalEquipmentCheck, @confirmSign, @imageName)`;

            dateReportRequest.input('userId', sql.BigInt, report.userId);
            dateReportRequest.input('stt', sql.BigInt, report.stt);
            dateReportRequest.input('name_person', sql.NVarChar, report.name_person);
            dateReportRequest.input('waterLevelArea', sql.NVarChar, report.waterLevelArea);
            dateReportRequest.input('date', sql.Date, report.date);
            dateReportRequest.input('attendancePoint', sql.Bit, report.attendancePoint);
            dateReportRequest.input('personalEquipmentCheck', sql.NVarChar, report.personalEquipmentCheck);
            dateReportRequest.input('confirmSign', sql.NVarChar, report.confirmSign);
            dateReportRequest.input('imageName', sql.VarChar, report.imageName);

            const dateReportResult = await dateReportRequest.query(dateReportQuery);
            const reportId = dateReportResult.recordset[0].report_id;
            console.log('Generated reportId:', reportId);


            const mainRubberRequest = new sql.Request();
            const mainRubberQuery = `INSERT INTO MainRubber 
                         (report_id, lo_name, nh3_liters, first_batch_cream, first_batch_block, first_batch_stove, second_batch_block, second_batch_stove, coagulated_latex)
                         VALUES (@reportId, @loName, @nh3Liters, @firstBatchCream, @firstBatchBlock, @firstBatchStove, @secondBatchBlock, @secondBatchStove, @coagulatedLatex)`;

            mainRubberRequest.input('reportId', sql.Int, reportId);
            mainRubberRequest.input('loName', sql.NVarChar, report.mainRubber.lo_name);
            mainRubberRequest.input('nh3Liters', sql.Float, report.mainRubber.nh3_liters);
            mainRubberRequest.input('firstBatchCream', sql.Float, report.mainRubber.first_batch_cream);
            mainRubberRequest.input('firstBatchBlock', sql.Float, report.mainRubber.first_batch_block);
            mainRubberRequest.input('firstBatchStove', sql.Float, report.mainRubber.first_batch_stove);
            mainRubberRequest.input('secondBatchBlock', sql.Float, report.mainRubber.second_batch_block);
            mainRubberRequest.input('secondBatchStove', sql.Float, report.mainRubber.second_batch_stove);
            mainRubberRequest.input('coagulatedLatex', sql.Float, report.mainRubber.coagulated_latex);

            await mainRubberRequest.query(mainRubberQuery);
            const secondaryRubberRequest = new sql.Request();
            const secondaryRubberQuery = `INSERT INTO SecondaryRubber 
                              (report_id, lo_name, frozen_kg, stew_kg, wire_kg, total_harvest_kg)
                              VALUES (@reportId, @loName, @frozenKg, @stewKg, @wireKg, @totalHarvestKg)`;

            secondaryRubberRequest.input('reportId', sql.Int, reportId);
            secondaryRubberRequest.input('loName', sql.NVarChar, report.secondaryRubber.lo_name);
            secondaryRubberRequest.input('frozenKg', sql.Float, report.secondaryRubber.frozen_kg);
            secondaryRubberRequest.input('stewKg', sql.Float, report.secondaryRubber.stew_kg);
            secondaryRubberRequest.input('wireKg', sql.Float, report.secondaryRubber.wire_kg);
            secondaryRubberRequest.input('totalHarvestKg', sql.Float, report.secondaryRubber.total_harvest_kg);

            await secondaryRubberRequest.query(secondaryRubberQuery);
        }
        res.status(200).send('Reception report data inserted successfully');
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data');
    }
});


app.post('/datereports/createOneReport', async (req, res) => {
    const report = req.body;

    try {
        const dateReportRequest = new sql.Request();
        const dateReportQuery = `INSERT INTO DateReport (user_id, stt, name_person, water_level_area, date, attendance_point, personal_equipment_check, confirm_sign, image_name)
                                 OUTPUT INSERTED.report_id
                                 VALUES (@userId, @stt, @name_person, @waterLevelArea, @date, @attendancePoint, @personalEquipmentCheck, @confirmSign, @imageName)`;

        dateReportRequest.input('userId', sql.BigInt, report.userId);
        dateReportRequest.input('stt', sql.BigInt, report.stt);
        dateReportRequest.input('name_person', sql.NVarChar, report.name_person);
        dateReportRequest.input('waterLevelArea', sql.NVarChar, report.waterLevelArea);
        dateReportRequest.input('date', sql.Date, report.date);
        dateReportRequest.input('attendancePoint', sql.Bit, report.attendancePoint);
        dateReportRequest.input('personalEquipmentCheck', sql.NVarChar, report.personalEquipmentCheck);
        dateReportRequest.input('confirmSign', sql.NVarChar, report.confirmSign);
        dateReportRequest.input('imageName', sql.VarChar, report.imageName);

        const dateReportResult = await dateReportRequest.query(dateReportQuery);
        const reportId = dateReportResult.recordset[0].report_id;
        console.log('Generated reportId:', reportId);

        const mainRubberRequest = new sql.Request();
        const mainRubberQuery = `INSERT INTO MainRubber 
                         (report_id, lo_name, nh3_liters, first_batch_cream, first_batch_block, first_batch_stove, second_batch_block, second_batch_stove, coagulated_latex)
                         VALUES (@reportId, @loName, @nh3Liters, @firstBatchCream, @firstBatchBlock, @firstBatchStove, @secondBatchBlock, @secondBatchStove, @coagulatedLatex)`;

        mainRubberRequest.input('reportId', sql.Int, reportId);
        mainRubberRequest.input('loName', sql.NVarChar, report.mainRubber.lo_name);
        mainRubberRequest.input('nh3Liters', sql.Float, report.mainRubber.nh3_liters);
        mainRubberRequest.input('firstBatchCream', sql.Float, report.mainRubber.first_batch_cream);
        mainRubberRequest.input('firstBatchBlock', sql.Float, report.mainRubber.first_batch_block);
        mainRubberRequest.input('firstBatchStove', sql.Float, report.mainRubber.first_batch_stove);
        mainRubberRequest.input('secondBatchBlock', sql.Float, report.mainRubber.second_batch_block);
        mainRubberRequest.input('secondBatchStove', sql.Float, report.mainRubber.second_batch_stove);
        mainRubberRequest.input('coagulatedLatex', sql.Float, report.mainRubber.coagulated_latex);

        await mainRubberRequest.query(mainRubberQuery);

        const secondaryRubberRequest = new sql.Request();
        const secondaryRubberQuery = `INSERT INTO SecondaryRubber 
                              (report_id, lo_name, frozen_kg, stew_kg, wire_kg, total_harvest_kg)
                              VALUES (@reportId, @loName, @frozenKg, @stewKg, @wireKg, @totalHarvestKg)`;

        secondaryRubberRequest.input('reportId', sql.Int, reportId);
        secondaryRubberRequest.input('loName', sql.NVarChar, report.secondaryRubber.lo_name);
        secondaryRubberRequest.input('frozenKg', sql.Float, report.secondaryRubber.frozen_kg);
        secondaryRubberRequest.input('stewKg', sql.Float, report.secondaryRubber.stew_kg);
        secondaryRubberRequest.input('wireKg', sql.Float, report.secondaryRubber.wire_kg);
        secondaryRubberRequest.input('totalHarvestKg', sql.Float, report.secondaryRubber.total_harvest_kg);

        await secondaryRubberRequest.query(secondaryRubberQuery);

        res.status(200).send('Report and related data inserted successfully');
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data');
    }
});

app.post('/receptionreports/create', async (req, res) => {
    const { reports } = req.body;

    try {
        for (const report of reports) {
            const receptionReportRequest = new sql.Request();

            const receptionReportQuery = `INSERT INTO ReceptionReport 
                                      (user_id, water_level_area, date, license_plate, cream_latex_kg, block_latex_kg, sheet_latex_kg, frozen_latex_kg, cup_latex_kg, wire_latex_kg, total_harvest_latex_kg, image_name)
                                      VALUES (@userId, @waterLevelArea, @date, @licensePlate, @creamLatexKg, @blockLatexKg, @sheetLatexKg, @frozenLatexKg, @cupLatexKg, @wireLatexKg, @totalHarvestLatexKg, @imageName)`;

            receptionReportRequest.input('userId', sql.BigInt, report.userId);
            receptionReportRequest.input('waterLevelArea', sql.NVarChar, report.waterLevelArea);
            receptionReportRequest.input('date', sql.Date, report.date);
            receptionReportRequest.input('licensePlate', sql.VarChar, report.licensePlate);
            receptionReportRequest.input('creamLatexKg', sql.Float, report.cream_latex_kg);
            receptionReportRequest.input('blockLatexKg', sql.Float, report.block_latex_kg);
            receptionReportRequest.input('sheetLatexKg', sql.Float, report.sheet_latex_kg);
            receptionReportRequest.input('frozenLatexKg', sql.Float, report.frozen_latex_kg);
            receptionReportRequest.input('cupLatexKg', sql.Float, report.cup_latex_kg);
            receptionReportRequest.input('wireLatexKg', sql.Float, report.wire_latex_kg);
            receptionReportRequest.input('totalHarvestLatexKg', sql.Float, report.total_harvest_latex_kg);
            receptionReportRequest.input('imageName', sql.VarChar, report.imageName);

            await receptionReportRequest.query(receptionReportQuery);
        }
        res.status(200).send('Reception report data inserted successfully');
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data');
    }
});

app.post('/receptionreports/createOneReport', async (req, res) => {
    const report = req.body;

    try {
        const receptionReportRequest = new sql.Request();

        const receptionReportQuery = `INSERT INTO ReceptionReport 
                                      (user_id,  water_level_area, date, license_plate, cream_latex_kg, block_latex_kg, sheet_latex_kg, frozen_latex_kg, cup_latex_kg, wire_latex_kg, total_harvest_latex_kg, image_name)
                                      VALUES (@userId, @waterLevelArea, @date, @licensePlate, @creamLatexKg, @blockLatexKg, @sheetLatexKg, @frozenLatexKg, @cupLatexKg, @wireLatexKg, @totalHarvestLatexKg, @imageName)`;

        receptionReportRequest.input('userId', sql.BigInt, report.userId);
        receptionReportRequest.input('waterLevelArea', sql.NVarChar, report.waterLevelArea);
        receptionReportRequest.input('date', sql.Date, report.date);
        receptionReportRequest.input('licensePlate', sql.VarChar, report.licensePlate);
        receptionReportRequest.input('creamLatexKg', sql.Float, report.cream_latex_kg);
        receptionReportRequest.input('blockLatexKg', sql.Float, report.block_latex_kg);
        receptionReportRequest.input('sheetLatexKg', sql.Float, report.sheet_latex_kg);
        receptionReportRequest.input('frozenLatexKg', sql.Float, report.frozen_latex_kg);
        receptionReportRequest.input('cupLatexKg', sql.Float, report.cup_latex_kg);
        receptionReportRequest.input('wireLatexKg', sql.Float, report.wire_latex_kg);
        receptionReportRequest.input('totalHarvestLatexKg', sql.Float, report.total_harvest_latex_kg);
        receptionReportRequest.input('imageName', sql.VarChar, report.imageName);

        await receptionReportRequest.query(receptionReportQuery);

        res.status(200).send('Reception report data inserted successfully');
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data');
    }
});

app.get('/datereports', (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    const request = new sql.Request();
    const query = `SELECT * FROM DateReport WHERE user_id = @userId`;

    request.input('userId', sql.BigInt, userId);

    request.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching reports:', err);
            return res.status(500).send('Server error');
        }

        res.json(result.recordset);
    });
});



app.delete('/datereports/:reportId', async (req, res) => {
    const reportId = req.params.reportId;

    const transaction = new sql.Transaction();

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);

        const deleteMainRubberQuery = `DELETE FROM MainRubber WHERE report_id = @reportId`;
        await request.input('reportId', sql.Int, reportId)
            .query(deleteMainRubberQuery);

        const deleteSecondaryRubberQuery = `DELETE FROM SecondaryRubber WHERE report_id = @reportId`;
        await request.query(deleteSecondaryRubberQuery);

        const deleteDateReportQuery = `DELETE FROM DateReport WHERE report_id = @reportId`;
        const deleteResult = await request.query(deleteDateReportQuery);

        if (deleteResult.rowsAffected[0] === 0) {
            await transaction.rollback();
            return res.status(404).send({ message: 'Report not found' });
        }

        await transaction.commit();
        res.status(200).send({ message: 'Report and related data deleted successfully' });
    } catch (err) {
        await transaction.rollback();
        console.error('Error deleting report and related data:', err);
        res.status(500).send('Server error');
    }
});

app.get('/history/datereports/:reportId', async (req, res) => {
    const reportId = req.params.reportId;

    try {
        const request = new sql.Request();

        const dateReportQuery = `SELECT * FROM DateReport WHERE report_id = @reportId`;
        request.input('reportId', sql.Int, reportId);
        const dateReportResult = await request.query(dateReportQuery);
        const dateReport = dateReportResult.recordset[0];

        if (!dateReport) {
            return res.status(404).send({ message: 'Report not found' });
        }

        const mainRubberQuery = `SELECT * FROM MainRubber WHERE report_id = @reportId`;
        const mainRubberResult = await request.query(mainRubberQuery);
        const mainRubber = mainRubberResult.recordset[0];

        const secondaryRubberQuery = `SELECT * FROM SecondaryRubber WHERE report_id = @reportId`;
        const secondaryRubberResult = await request.query(secondaryRubberQuery);
        const secondaryRubber = secondaryRubberResult.recordset[0];

        res.status(200).json({
            dateReport,
            mainRubber,
            secondaryRubber
        });
    } catch (err) {
        console.error('Error fetching report details:', err);
        res.status(500).send('Server error');
    }
});


app.post('/history/datereports/update', async (req, res) => {
    const { dateReport, mainRubber, secondaryRubber } = req.body;
    const reportId = dateReport.report_id;

    try {
        const request = new sql.Request();

        request.input('reportId', sql.Int, reportId);
        request.input('stt', sql.BigInt, dateReport.stt);
        request.input('name_person', sql.NVarChar, dateReport.name_person);
        request.input('water_level_area', sql.NVarChar, dateReport.water_level_area);
        request.input('date', sql.Date, new Date(dateReport.date));
        request.input('attendance_point', sql.Bit, dateReport.attendance_point);
        request.input('personal_equipment_check', sql.NVarChar, dateReport.personal_equipment_check);

        await request.query(`
            UPDATE DateReport
            SET 
                stt = @stt,
                name_person = @name_person,
                water_level_area = @water_level_area,
                date = @date,
                attendance_point = @attendance_point,
                personal_equipment_check = @personal_equipment_check
            WHERE report_id = @reportId
        `);

        const mainRubberRequest = new sql.Request();
        mainRubberRequest.input('reportId', sql.Int, reportId);
        mainRubberRequest.input('lo_name', sql.NVarChar, mainRubber.lo_name);
        mainRubberRequest.input('nh3_liters', sql.Float, mainRubber.nh3_liters);
        mainRubberRequest.input('first_batch_cream', sql.Float, mainRubber.first_batch_cream);
        mainRubberRequest.input('first_batch_block', sql.Float, mainRubber.first_batch_block);
        mainRubberRequest.input('first_batch_stove', sql.Float, mainRubber.first_batch_stove);
        mainRubberRequest.input('second_batch_block', sql.Float, mainRubber.second_batch_block);
        mainRubberRequest.input('second_batch_stove', sql.Float, mainRubber.second_batch_stove);
        mainRubberRequest.input('coagulated_latex', sql.Float, mainRubber.coagulated_latex);

        await mainRubberRequest.query(`
            UPDATE MainRubber
            SET 
                lo_name = @lo_name,
                nh3_liters = @nh3_liters,
                first_batch_cream = @first_batch_cream,
                first_batch_block = @first_batch_block,
                first_batch_stove = @first_batch_stove,
                second_batch_block = @second_batch_block,
                second_batch_stove = @second_batch_stove,
                coagulated_latex = @coagulated_latex
            WHERE report_id = @reportId
        `);

        const secondaryRubberRequest = new sql.Request();
        secondaryRubberRequest.input('reportId', sql.Int, reportId);
        secondaryRubberRequest.input('lo_name', sql.NVarChar, secondaryRubber.lo_name);
        secondaryRubberRequest.input('frozen_kg', sql.Float, secondaryRubber.frozen_kg);
        secondaryRubberRequest.input('stew_kg', sql.Float, secondaryRubber.stew_kg);
        secondaryRubberRequest.input('wire_kg', sql.Float, secondaryRubber.wire_kg);
        secondaryRubberRequest.input('total_harvest_kg', sql.Float, secondaryRubber.total_harvest_kg);

        await secondaryRubberRequest.query(`
            UPDATE SecondaryRubber
            SET 
                lo_name = @lo_name,
                frozen_kg = @frozen_kg,
                stew_kg = @stew_kg,
                wire_kg = @wire_kg,
                total_harvest_kg = @total_harvest_kg
            WHERE report_id = @reportId
        `);

        res.status(200).send('Report updated successfully.');
    } catch (err) {
        console.error('Error updating report:', err);
        res.status(500).send('Server error');
    }
});


app.get('/receptionreports', async (req, res) => {
    const { userId } = req.query;

    try {
        const request = new sql.Request();
        request.input('userId', sql.BigInt, userId);
        const result = await request.query(`SELECT * FROM ReceptionReport WHERE user_id = @userId`);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching reports:', err);
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

app.delete('/receptionreports/:reportId', async (req, res) => {
    const { reportId } = req.params;

    try {
        const request = new sql.Request();
        request.input('reportId', sql.Int, reportId);
        await request.query(`DELETE FROM ReceptionReport WHERE reception_report_id = @reportId`);
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (err) {
        console.error('Error deleting report:', err);
        res.status(500).json({ message: 'Error deleting report' });
    }
});

app.post('/history/receptionreports/update', async (req, res) => {
    const { reception_report_id,water_level_area, license_plate, cream_latex_kg, block_latex_kg, sheet_latex_kg, frozen_latex_kg, cup_latex_kg, wire_latex_kg, total_harvest_latex_kg, date } = req.body;

    try {
        const request = new sql.Request();
        request.input('reception_report_id', sql.Int, reception_report_id);
        request.input('water_level_area', sql.NVarChar, water_level_area);
        request.input('license_plate', sql.VarChar, license_plate);
        request.input('cream_latex_kg', sql.Float, cream_latex_kg);
        request.input('block_latex_kg', sql.Float, block_latex_kg);
        request.input('sheet_latex_kg', sql.Float, sheet_latex_kg);
        request.input('frozen_latex_kg', sql.Float, frozen_latex_kg);
        request.input('cup_latex_kg', sql.Float, cup_latex_kg);
        request.input('wire_latex_kg', sql.Float, wire_latex_kg);
        request.input('total_harvest_latex_kg', sql.Float, total_harvest_latex_kg);
        request.input('date', sql.Date, date);

        const query = `
            UPDATE ReceptionReport
            SET water_level_area = @water_level_area,license_plate = @license_plate, cream_latex_kg = @cream_latex_kg, block_latex_kg = @block_latex_kg, 
                sheet_latex_kg = @sheet_latex_kg, frozen_latex_kg = @frozen_latex_kg, 
                cup_latex_kg = @cup_latex_kg, wire_latex_kg = @wire_latex_kg, 
                total_harvest_latex_kg = @total_harvest_latex_kg, date = @date
            WHERE reception_report_id = @reception_report_id
        `;

        await request.query(query);
        res.status(200).json({ message: 'Report updated successfully' });
    } catch (err) {
        console.error('Error updating report:', err);
        res.status(500).json({ message: 'Error updating report' });
    }
});

app.get('/receptionreports/:reportId', async (req, res) => {
    const { reportId } = req.params;

    try {
        const request = new sql.Request();
        request.input('reportId', sql.Int, reportId);
        const result = await request.query(`SELECT * FROM ReceptionReport WHERE reception_report_id = @reportId`);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (err) {
        console.error('Error fetching report details:', err);
        res.status(500).json({ message: 'Error fetching report details' });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});