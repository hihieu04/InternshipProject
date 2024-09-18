import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../api/axios';

const ReceptionInput = ({ navigation , route}) => {
    const {user} = route.params;
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [waterLevelArea, setWaterLevelArea] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [creamLatexKg, setCreamLatexKg] = useState('');
    const [blockLatexKg, setBlockLatexKg] = useState('');
    const [sheetLatexKg, setSheetLatexKg] = useState('');
    const [frozenLatexKg, setFrozenLatexKg] = useState('');
    const [cupLatexKg, setCupLatexKg] = useState('');
    const [wireLatexKg, setWireLatexKg] = useState('');
    const [totalHarvestLatexKg, setTotalHarvestLatexKg] = useState('');
    const imageName = useState('');

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const handleInputChange = (field, value) => {
        switch (field) {
            case 'cream_latex_kg':
                setCreamLatexKg(value);
                break;
            case 'block_latex_kg':
                setBlockLatexKg(value);
                break;
            case 'sheet_latex_kg':
                setSheetLatexKg(value);
                break;
            case 'frozen_latex_kg':
                setFrozenLatexKg(value);
                break;
            case 'cup_latex_kg':
                setCupLatexKg(value);
                break;
            case 'wire_latex_kg':
                setWireLatexKg(value);
                break;
            case 'total_harvest_latex_kg':
                setTotalHarvestLatexKg(value);
                break;
            default:
                break;
        }
    };

    const ensureNumericValue = (value) => {
        return value === '' ? 0 : parseFloat(value);
    };

    const handleSave = async () => {
        try {
            const reportDataToSend = {
                userId: user.user_id,
                waterLevelArea: waterLevelArea,
                date: date.toISOString().split('T')[0],
                licensePlate: licensePlate,
                cream_latex_kg: ensureNumericValue(creamLatexKg),
                block_latex_kg: ensureNumericValue(blockLatexKg),
                sheet_latex_kg: ensureNumericValue(sheetLatexKg),
                frozen_latex_kg: ensureNumericValue(frozenLatexKg),
                cup_latex_kg: ensureNumericValue(cupLatexKg),
                wire_latex_kg: ensureNumericValue(wireLatexKg),
                total_harvest_latex_kg: ensureNumericValue(totalHarvestLatexKg),
                imageName
            };

            const response = await axios.post('/receptionreports/createOneReport', reportDataToSend);
            if (response.status === 200) {
                Alert.alert('Thành công', 'Báo cáo được tạo thành công!');
                navigation.goBack();
            } else {
                Alert.alert('Lỗi', 'Thất bại.');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            Alert.alert('Error', 'Failed to submit the report. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="green" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={[styles.buttonText, { fontSize: 25 }]}>⇦</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Tạo báo cáo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Gửi báo cáo</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Khu tiếp nhận mủ:</Text>
                    <TextInput
                        style={styles.input}
                        value={waterLevelArea}
                        onChangeText={setWaterLevelArea}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Số xe:</Text>
                    <TextInput
                        style={styles.input}
                        value={licensePlate}
                        onChangeText={setLicensePlate}
                    />
                </View>


                {/* Ngày */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ngày:</Text>
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

                {/* Mủ kem (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ kem (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={creamLatexKg}
                        onChangeText={text => handleInputChange('cream_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Mủ khối (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ khối (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={blockLatexKg}
                        onChangeText={text => handleInputChange('block_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Mủ tờ (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ tờ (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={sheetLatexKg}
                        onChangeText={text => handleInputChange('sheet_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Mủ đông (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ đông (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={frozenLatexKg}
                        onChangeText={text => handleInputChange('frozen_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Mủ chén (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ chén (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={cupLatexKg}
                        onChangeText={text => handleInputChange('cup_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Mủ dây (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ dây (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={wireLatexKg}
                        onChangeText={text => handleInputChange('wire_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Tổng tận thu (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tổng tận thu (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={totalHarvestLatexKg}
                        onChangeText={text => handleInputChange('total_harvest_latex_kg', text)}
                        keyboardType="numeric"
                    />
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
    input: {
        flex: 1,
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});

export default ReceptionInput;
