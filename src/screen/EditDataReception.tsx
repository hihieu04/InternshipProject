import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditDataReception = ({ navigation, route }) => {
    const { user, reportData, onSave } = route.params;

    const [date, setDate] = useState(new Date(reportData.date));
    const [waterLevelArea, setWaterLevelArea] = useState(reportData.waterLevelArea);
    const [licensePlate, setLicensePlate] = useState(reportData.licensePlate);
    const [creamLatexKg, setCreamLatexKg] = useState(reportData.cream_latex_kg?.toString() || '');
    const [blockLatexKg, setBlockLatexKg] = useState(reportData.block_latex_kg?.toString() || '');
    const [sheetLatexKg, setSheetLatexKg] = useState(reportData.sheet_latex_kg?.toString() || '');
    const [frozenLatexKg, setFrozenLatexKg] = useState(reportData.frozen_latex_kg?.toString() || '');
    const [cupLatexKg, setCupLatexKg] = useState(reportData.cup_latex_kg?.toString() || '');
    const [wireLatexKg, setWireLatexKg] = useState(reportData.wire_latex_kg?.toString() || '');
    const [totalHarvestLatexKg, setTotalHarvestLatexKg] = useState(reportData.total_harvest_latex_kg?.toString() || '');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };
    const goBack = () => {
        navigation.goBack();
    };
    const submitChanges = () => {
        const updatedReportData = {
            ...reportData,
            waterLevelArea,
            date: date.toISOString().split('T')[0],
            licensePlate,
            cream_latex_kg: parseFloat(creamLatexKg),
            block_latex_kg: parseFloat(blockLatexKg),
            sheet_latex_kg: parseFloat(sheetLatexKg),
            frozen_latex_kg: parseFloat(frozenLatexKg),
            cup_latex_kg: parseFloat(cupLatexKg),
            wire_latex_kg: parseFloat(wireLatexKg),
            total_harvest_latex_kg: parseFloat(totalHarvestLatexKg),
        };

        onSave(updatedReportData);
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
                    <Text style={styles.buttonText}>Chỉnh sửa báo cáo tiếp nhận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={submitChanges}>
                    <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Số xe:</Text>
                    <TextInput
                        style={styles.input}
                        value={licensePlate}
                        onChangeText={setLicensePlate}
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
                    <Text style={styles.label}>Mủ kem (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={creamLatexKg}
                        onChangeText={setCreamLatexKg}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ khối (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={blockLatexKg}
                        onChangeText={setBlockLatexKg}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ tờ (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={sheetLatexKg}
                        onChangeText={setSheetLatexKg}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ đông (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={frozenLatexKg}
                        onChangeText={setFrozenLatexKg}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ chén (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={cupLatexKg}
                        onChangeText={setCupLatexKg}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ dây (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={wireLatexKg}
                        onChangeText={setWireLatexKg}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tổng tận thu (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={totalHarvestLatexKg}
                        onChangeText={setTotalHarvestLatexKg}
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
    }
});

export default EditDataReception;
