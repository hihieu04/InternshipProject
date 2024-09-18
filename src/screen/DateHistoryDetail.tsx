import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../api/axios';

const DateHistoryDetail = ({ navigation, route }) => {
    const { user, reportId } = route.params;
    const [date, setDate] = useState(new Date());
    const [isEnabled, setIsEnabled] = useState(false);
    const [report, setReport] = useState(null);
    const [mainRubber, setMainRubber] = useState(null);
    const [secondaryRubber, setSecondaryRubber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        axios.get(`/history/datereports/${reportId}`)
            .then(response => {
                setReport(response.data.dateReport);
                setMainRubber(response.data.mainRubber);
                setSecondaryRubber(response.data.secondaryRubber);
                setDate(new Date(response.data.dateReport.date));
                setIsEnabled(response.data.dateReport.attendance_point);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching report:', error);
                setLoading(false);
            });
    }, [reportId]);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const handleInputChange = (field, value, type) => {
        if (type === 'main') {
            setMainRubber({
                ...mainRubber,
                [field]: value
            });
        } else if (type === 'secondary') {
            setSecondaryRubber({
                ...secondaryRubber,
                [field]: value
            });
        } else {
            setReport({
                ...report,
                [field]: value
            });
        }
    };

    const handleSave = async () => {
        try {
            const updatedReport = {
                ...report,
                date: date.toISOString(),
                attendance_point: isEnabled,
            };
            const updatedMainRubber = { ...mainRubber };
            const updatedSecondaryRubber = { ...secondaryRubber };

            const response = await axios.post('/history/datereports/update', {
                dateReport: updatedReport,
                mainRubber: updatedMainRubber,
                secondaryRubber: updatedSecondaryRubber
            });

            if (response.status === 200) {
                Alert.alert('Thành công', 'Báo cáo được cập nhật thành công!');
                navigation.navigate('DateReport', { user });
            } else {
                Alert.alert('Lỗi', 'Thất bại.');
            }
        } catch (error) {
            console.error('Error updating report:', error);
            Alert.alert('Error', 'Failed to update the report. Please try again.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="green" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={[styles.buttonText, { fontSize: 25 }]}>⇦</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Báo cáo chi tiết</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>STT:</Text>
                    <TextInput
                        style={styles.input}
                        value={report?.stt?.toString() || ''}
                        onChangeText={text => handleInputChange('stt', text, 'report')}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tên người ghi nhận:</Text>
                    <TextInput
                        style={styles.input}
                        value={report?.name_person || ''}
                        onChangeText={text => handleInputChange('name_person', text, 'report')}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Khu cạo (mủ nước):</Text>
                    <TextInput
                        style={styles.input}
                        value={report?.water_level_area || ''}
                        onChangeText={text => handleInputChange('water_level_area', text, 'report')}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ngày cạo:</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.input}>{date.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>

                {/* Điểm danh */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Điểm danh:</Text>
                    <Switch
                        trackColor={{ false: "#gray", true: "lightgreen" }}
                        thumbColor={report?.attendance_point === 1 ? "green" : "white"} // Xanh lá nếu attendance_point = 1, đỏ nếu = 0
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setIsEnabled(!isEnabled)}
                        value={isEnabled}
                    />
                </View>

                {/* Kiểm tra dụng cụ cá nhân */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Kiểm tra dụng cụ cá nhân:</Text>
                    <TextInput
                        style={styles.input}
                        value={report?.personal_equipment_check || ''}
                        onChangeText={text => handleInputChange('personal_equipment_check', text, 'report')}
                    />
                </View>

                {/* MỦ NƯỚC */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>MỦ NƯỚC</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên lô:</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber?.lo_name || ''}
                            onChangeText={text => handleInputChange('lo_name', text, 'main')}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>NH3 (lit):</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber?.nh3_liters?.toString() || ''}
                            onChangeText={text => handleInputChange('nh3_liters', text, 'main')}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.blueLabel}>Lần 1:</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kem:</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber?.first_batch_cream?.toString() || ''}
                            onChangeText={text => handleInputChange('first_batch_cream', text, 'main')}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Khối:</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber?.first_batch_block?.toString() || ''}
                            onChangeText={text => handleInputChange('first_batch_block', text, 'main')}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tờ:</Text>
                        <TextInput
                            style={styles.input}
                            value={mainRubber?.first_batch_stove?.toString() || ''}
                            onChangeText={text => handleInputChange('first_batch_stove', text, 'main')}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* MỦ PHỤ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>MỦ PHỤ</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên lô:</Text>
                        <TextInput
                            style={styles.input}
                            value={secondaryRubber?.lo_name || ''}
                            onChangeText={text => handleInputChange('lo_name', text, 'secondary')}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Đông (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={secondaryRubber?.frozen_kg?.toString() || ''}
                            onChangeText={text => handleInputChange('frozen_kg', text, 'secondary')}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Chén (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={secondaryRubber?.stew_kg?.toString() || ''}
                            onChangeText={text => handleInputChange('stew_kg', text, 'secondary')}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dây (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={secondaryRubber?.wire_kg?.toString() || ''}
                            onChangeText={text => handleInputChange('wire_kg', text, 'secondary')}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tận thu (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={secondaryRubber?.total_harvest_kg?.toString() || ''}
                            onChangeText={text => handleInputChange('total_harvest_kg', text, 'secondary')}
                            keyboardType="numeric"
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
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        marginLeft: 10,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 10,
    },
});

export default DateHistoryDetail;
