import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Switch, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const EditData = ({ navigation, route }) => {
    const { user, reportData } = route.params;
    const [date, setDate] = useState(new Date(reportData.date));
    const [waterLevelArea, setWaterLevelArea] = useState(reportData.waterLevelArea);
    const [attendancePoint, setAttendancePoint] = useState(!!reportData.attendancePoint);
    const [personalEquipmentCheck, setPersonalEquipmentCheck] = useState(reportData.personalEquipmentCheck);
    const [confirmSign, setConfirmSign] = useState(reportData.confirmSign);
    const [mainRubber, setMainRubber] = useState({
        lo_name: reportData.mainRubber.lo_name || '',
        nh3_liters: reportData.mainRubber.nh3_liters?.toString() || '',
        first_batch_cream: reportData.mainRubber.first_batch_cream?.toString() || '',
        first_batch_block: reportData.mainRubber.first_batch_block.toString() || '',
        first_batch_stove: reportData.mainRubber.first_batch_stove.toString() || '',
        second_batch_block: reportData.mainRubber.second_batch_block.toString() || '',
        second_batch_stove: reportData.mainRubber.second_batch_stove.toString() || '',
        coagulated_latex: reportData.mainRubber.coagulated_latex.toString() || ''
    });

    const [secondaryRubber, setSecondaryRubber] = useState({
        lo_name: reportData.secondaryRubber.lo_name || '',
        frozen_kg: reportData.secondaryRubber.frozen_kg?.toString() || '',
        stew_kg: reportData.secondaryRubber.stew_kg?.toString() || '',
        wire_kg: reportData.secondaryRubber.wire_kg?.toString() || '',
        total_harvest_kg: reportData.secondaryRubber.total_harvest_kg?.toString() || ''
    });
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };
    
    const goBack = () => {
        navigation.goBack();
    };

    const submitReport = async () => {
        try {
            // Chuyển string -> float
            const mainRubberData = {
                ...mainRubber,
                nh3_liters: parseFloat(mainRubber.nh3_liters),
                first_batch_cream: parseFloat(mainRubber.first_batch_cream),
                first_batch_block: parseFloat(mainRubber.first_batch_block),
                first_batch_stove: parseFloat(mainRubber.first_batch_stove),
                second_batch_block: parseFloat(mainRubber.second_batch_block),
                second_batch_stove: parseFloat(mainRubber.second_batch_stove),
                coagulated_latex: parseFloat(mainRubber.coagulated_latex)
            };
    
            const secondaryRubberData = {
                ...secondaryRubber,
                frozen_kg: parseFloat(secondaryRubber.frozen_kg),
                stew_kg: parseFloat(secondaryRubber.stew_kg),
                wire_kg: parseFloat(secondaryRubber.wire_kg),
                total_harvest_kg: parseFloat(secondaryRubber.total_harvest_kg)
            };
            console.log('Report Data:', {
                userId: reportData.userId,
                waterLevelArea: waterLevelArea,
                date: date.toISOString().split('T')[0],
                attendancePoint: attendancePoint ? 1 : 0,
                personalEquipmentCheck: personalEquipmentCheck,
                confirmSign: confirmSign,
                imageName: reportData.imageName,
                mainRubber: mainRubberData,
                secondaryRubber: secondaryRubberData
            });
    
            const response = await axios.post('http://192.168.1.33:3000/datereports/create', {
                userId: reportData.userId,
                waterLevelArea: waterLevelArea,
                date: date.toISOString().split('T')[0],
                attendancePoint: attendancePoint ? 1 : 0,
                personalEquipmentCheck: personalEquipmentCheck,
                confirmSign: confirmSign,
                imageName: reportData.imageName,
                mainRubber: mainRubberData,
                secondaryRubber: secondaryRubberData
            });
    
            if (response.status === 200) {
                Alert.alert('Thành công', 'Báo cáo đã được gửi thành công!', [
                    { text: 'OK', onPress: () => navigation.navigate('DateReport', {user}) }
                ]);
            } else {
                Alert.alert('Lỗi', 'Không thể gửi báo cáo. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            Alert.alert('Lỗi', 'Không thể kết nối với máy chủ. Vui lòng thử lại.');
        }
    };
    

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="green" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Text style={[styles.buttonText, { fontSize: 25 }]}>⇦</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Chỉnh sửa báo cáo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={submitReport}>
                    <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.name}>NGUYỄN VĂN A</Text>
            
            <ScrollView contentContainerStyle={styles.formContainer}>
                {/* Khu cạo */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Khu cạo (mủ nước):</Text>
                    <TextInput
                        style={styles.input}
                        value={waterLevelArea}
                        onChangeText={setWaterLevelArea}
                    />
                </View>
                
                {/* Ngày cạo */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ngày cạo:</Text>
                    <TouchableOpacity onPress={() => setShow(true)}>
                        <Text style={styles.input}>{date.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChange}
                        />
                    )}
                </View>

                {/* Điểm danh */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Điểm danh:</Text>
                    <Switch
                        trackColor={{ false: "#gray", true: "lightgreen" }}
                        thumbColor={attendancePoint ? "green" : "white"}
                        ios_backgroundColor="#3e3e3e"
                        value={attendancePoint}
                        onValueChange={setAttendancePoint}
                    />
                </View>

                {/* Kiểm tra dụng cụ cá nhân */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Kiểm tra dụng cụ cá nhân:</Text>
                    <TextInput
                        style={styles.input}
                        value={personalEquipmentCheck}
                        onChangeText={setPersonalEquipmentCheck}
                    />
                </View>

                {/* Mủ nước */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>MỦ NƯỚC</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên lô:</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber.lo_name}
                            onChangeText={(text) => setMainRubber({ ...mainRubber, lo_name: text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>NH3 (lit):</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber.nh3_liters}
                            onChangeText={(text) => setMainRubber({ ...mainRubber, nh3_liters: text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.blueLabel}>Lần 1:</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kem:</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber.first_batch_cream}
                            onChangeText={(text) => setMainRubber({ ...mainRubber, first_batch_cream: text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Khối:</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber.first_batch_block}
                            onChangeText={(text) => setMainRubber({ ...mainRubber, first_batch_block: text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tờ:</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber.first_batch_stove}
                            onChangeText={(text) => setMainRubber({ ...mainRubber, first_batch_stove: text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.blueLabel}>Lần 2:</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Khối:</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber.second_batch_block}
                            onChangeText={(text) => setMainRubber({ ...mainRubber, second_batch_block: text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tờ:</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber.second_batch_block}
                            onChangeText={(text) => setMainRubber({ ...mainRubber, second_batch_stove: text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mủ đánh đông:</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber.coagulated_latex}
                            onChangeText={(text) => setMainRubber({ ...mainRubber, coagulated_latex: text })}
                        />
                    </View>
                </View>

                {/* Mủ phụ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>MỦ PHỤ</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên lô:</Text>
                        <TextInput
                            style={styles.input}
                            value={secondaryRubber.lo_name}
                            onChangeText={(text) => setSecondaryRubber({ ...secondaryRubber, lo_name: text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Đông (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={secondaryRubber.frozen_kg}
                            onChangeText={(text) => setSecondaryRubber({ ...secondaryRubber, frozen_kg: text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Chén (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={secondaryRubber.stew_kg}
                            onChangeText={(text) => setSecondaryRubber({ ...secondaryRubber, stew_kg: text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dây (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={secondaryRubber.wire_kg}
                            onChangeText={(text) => setSecondaryRubber({ ...secondaryRubber, wire_kg: text })}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tận thu (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={secondaryRubber.total_harvest_kg}
                            onChangeText={(text) => setSecondaryRubber({ ...secondaryRubber, total_harvest_kg: text })}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: 'green',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    formContainer: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 10,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        width: 200,
        fontSize: 16,
        fontWeight: 'bold',
    },
    blueLabel: {
        width: 200,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'blue',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    name: {
        fontSize: 20,
        marginLeft: 10,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 10,
    },
});

export default EditData;
