import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const ReceptionHistoryDetail = ({ navigation, route }) => {
    const { user, reportId } = route.params;
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        axios.get(`http://192.168.1.33:3000/receptionreports/${reportId}`)
            .then(response => {
                setReport(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching report:', error);
                setLoading(false);
            });
    }, [reportId]);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date(report.date);
        setShowDatePicker(false);
        setReport({
            ...report,
            date: currentDate
        });
    };

    const handleInputChange = (field, value) => {
        setReport({
            ...report,
            [field]: value
        });
    };

    const handleSave = async () => {
        try {
            const updatedReport = {
                ...report,
                cream_latex_kg: parseFloat(report.cream_latex_kg),
                block_latex_kg: parseFloat(report.block_latex_kg),
                sheet_latex_kg: parseFloat(report.sheet_latex_kg),
                frozen_latex_kg: parseFloat(report.frozen_latex_kg),
                cup_latex_kg: parseFloat(report.cup_latex_kg),
                wire_latex_kg: parseFloat(report.wire_latex_kg),
                total_harvest_latex_kg: parseFloat(report.total_harvest_latex_kg)
            };

            const response = await axios.post('http://192.168.1.33:3000/history/receptionreports/update', updatedReport);
            if (response.status === 200) {
                Alert.alert('Success', 'Report updated successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to update the report. Please try again.');
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
                    <Text style={styles.buttonText}>Chi tiết báo cáo tiếp nhận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.name}>{user.firstname} {user.lastname}</Text>

            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Khu tiếp nhận mủ:</Text>
                    <TextInput
                        style={styles.input}
                        value={report.water_level_area}
                        onChangeText={text => handleInputChange('water_level_area', text)}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Số xe:</Text>
                    <TextInput
                        style={styles.input}
                        value={report.license_plate}
                        onChangeText={text => handleInputChange('license_plate', text)}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tên báo cáo:</Text>
                    <TextInput
                        style={styles.input}
                        value={report.name}
                        onChangeText={text => handleInputChange('name', text)}
                    />
                </View>

                {/* Ngày */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ngày:</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.input}>{new Date(report.date).toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(report.date)}
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
                        value={report.cream_latex_kg.toString()}
                        onChangeText={text => handleInputChange('cream_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Mủ khối (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ khối (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={report.block_latex_kg.toString()}
                        onChangeText={text => handleInputChange('block_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Mủ tờ (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ tờ (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={report.sheet_latex_kg.toString()}
                        onChangeText={text => handleInputChange('sheet_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Mủ đông (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ đông (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={report.frozen_latex_kg.toString()}
                        onChangeText={text => handleInputChange('frozen_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Mủ chén (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ chén (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={report.cup_latex_kg.toString()}
                        onChangeText={text => handleInputChange('cup_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Mủ dây (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mủ dây (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={report.wire_latex_kg.toString()}
                        onChangeText={text => handleInputChange('wire_latex_kg', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Tổng tận thu (kg) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tổng tận thu (kg):</Text>
                    <TextInput
                        style={styles.input}
                        value={report.total_harvest_latex_kg.toString()}
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
    name: {
        fontSize: 20,
        marginLeft: 10,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 10,
    },
});

export default ReceptionHistoryDetail;
