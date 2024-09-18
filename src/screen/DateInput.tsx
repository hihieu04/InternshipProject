import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Switch, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../api/axios';

const DateInput = ({ navigation, route }) => {
    const { user } = route.params;
    const [stt, setStt] = useState('');
    const [namePerson, setNamePerson] = useState('');  
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [waterLevelArea, setWaterLevelArea] = useState('');
    const [personalEquipmentCheck, setPersonalEquipmentCheck] = useState('');
    const [confirmSign, setConfirmSign] = useState('');
    const [imageName, setImageName] = useState('');

    const [loNameMain, setLoNameMain] = useState('');
    const [nh3Liters, setNh3Liters] = useState('');
    const [firstBatchCream, setFirstBatchCream] = useState('');
    const [firstBatchBlock, setFirstBatchBlock] = useState('');
    const [firstBatchStove, setFirstBatchStove] = useState('');
    const [secondBatchBlock, setSecondBatchBlock] = useState('');
    const [secondBatchStove, setSecondBatchStove] = useState('');
    const [coagulatedLatex, setCoagulatedLatex] = useState('');

    const [loNameSecondary, setLoNameSecondary] = useState('');
    const [frozenKg, setFrozenKg] = useState('');
    const [stewKg, setStewKg] = useState('');
    const [wireKg, setWireKg] = useState('');
    const [totalHarvestKg, setTotalHarvestKg] = useState('');

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    const handleNumericInput = (value, setter) => {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
            setter(parsedValue);
        } else {
            setter('');
        }
    };

    const handleSave = async () => {
        try {
            const reportData = {
                userId: user.user_id,
                stt: stt,  
                name_person: namePerson,
                waterLevelArea,
                date: date.toISOString().split('T')[0],
                attendancePoint: isEnabled,
                personalEquipmentCheck,
                confirmSign,
                imageName,
                mainRubber: {
                    lo_name: loNameMain,
                    nh3_liters: nh3Liters === '' ? 0 : nh3Liters,
                    first_batch_cream: firstBatchCream === '' ? 0 : firstBatchCream,
                    first_batch_block: firstBatchBlock === '' ? 0 : firstBatchBlock,
                    first_batch_stove: firstBatchStove === '' ? 0 : firstBatchStove,
                    second_batch_block: secondBatchBlock === '' ? 0 : secondBatchBlock,
                    second_batch_stove: secondBatchStove === '' ? 0 : secondBatchStove,
                    coagulated_latex: coagulatedLatex === '' ? 0 : coagulatedLatex,
                },
                secondaryRubber: {
                    lo_name: loNameSecondary,
                    frozen_kg: frozenKg === '' ? 0 : frozenKg,
                    stew_kg: stewKg === '' ? 0 : stewKg,
                    wire_kg: wireKg === '' ? 0 : wireKg,
                    total_harvest_kg: totalHarvestKg === '' ? 0 : totalHarvestKg,
                }
            };
            const response = await axios.post('/datereports/createOneReport', reportData);

            if (response.status === 200) {
                Alert.alert('Thành công', 'Báo cáo được tạo thành công!');
                navigation.goBack();
            } else {
                Alert.alert('Lỗi', 'Thất bại.');
            }
        } catch (error) {
            console.error('Error creating report:', error);
            Alert.alert('Error', 'Failed to create the report. Please try again.');
        }
    };

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="green" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Text style={[styles.buttonText, { fontSize: 25 }]}>⇦</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Tạo báo cáo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Gửi BC</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.name}>{user.firstname} {user.lastname}</Text>

            <ScrollView contentContainerStyle={styles.formContainer}>
            <View style={styles.inputGroup}>
                    <Text style={styles.label}>STT:</Text>
                    <TextInput
                        style={styles.input}
                        value={stt.toString()}
                        onChangeText={setStt}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tên người ghi nhận:</Text>
                    <TextInput
                        style={styles.input}
                        value={namePerson}
                        onChangeText={setNamePerson}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Khu cạo (mủ nước):</Text>
                    <TextInput
                        style={styles.input}
                        value={waterLevelArea}
                        onChangeText={setWaterLevelArea}
                    />
                </View>
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
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Điểm danh:</Text>
                    <Switch
                        trackColor={{ false: "#gray", true: "lightgreen" }}
                        thumbColor={isEnabled ? "green" : "white"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setIsEnabled(previousState => !previousState)}
                        value={isEnabled}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Kiểm tra dụng cụ cá nhân:</Text>
                    <TextInput
                        style={styles.input}
                        value={personalEquipmentCheck}
                        onChangeText={setPersonalEquipmentCheck}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Xác nhận:</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmSign}
                        onChangeText={setConfirmSign}
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>MỦ NƯỚC</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên lô:</Text>
                        <TextInput
                            style={styles.input}
                            value={loNameMain}
                            onChangeText={setLoNameMain}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>NH3 (lit):</Text>
                        <TextInput
                            style={styles.input}
                            value={nh3Liters.toString()}
                            onChangeText={value => handleNumericInput(value, setNh3Liters)}
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
                            value={firstBatchCream.toString()}
                            onChangeText={value => handleNumericInput(value, setFirstBatchCream)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Khối:</Text>
                        <TextInput
                            style={styles.input}
                            value={firstBatchBlock.toString()}
                            onChangeText={value => handleNumericInput(value, setFirstBatchBlock)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tờ:</Text>
                        <TextInput
                            style={styles.input}
                            value={firstBatchStove.toString()}
                            onChangeText={value => handleNumericInput(value, setFirstBatchStove)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.blueLabel}>Lần 2:</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Khối:</Text>
                        <TextInput
                            style={styles.input}
                            value={secondBatchBlock.toString()}
                            onChangeText={value => handleNumericInput(value, setSecondBatchBlock)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tờ:</Text>
                        <TextInput
                            style={styles.input}
                            value={secondBatchStove.toString()}
                            onChangeText={value => handleNumericInput(value, setSecondBatchStove)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mủ đánh đông:</Text>
                        <TextInput
                            style={styles.input}
                            value={coagulatedLatex.toString()}
                            onChangeText={value => handleNumericInput(value, setCoagulatedLatex)}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>MỦ PHỤ</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên lô:</Text>
                        <TextInput
                            style={styles.input}
                            value={loNameSecondary}
                            onChangeText={setLoNameSecondary}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Đông (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={frozenKg.toString()}
                            onChangeText={value => handleNumericInput(value, setFrozenKg)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Chén (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={stewKg.toString()}
                            onChangeText={value => handleNumericInput(value, setStewKg)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dây (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={wireKg.toString()}
                            onChangeText={value => handleNumericInput(value, setWireKg)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tận thu (kg):</Text>
                        <TextInput
                            style={styles.input}
                            value={totalHarvestKg.toString()}
                            onChangeText={value => handleNumericInput(value, setTotalHarvestKg)}
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

export default DateInput;
