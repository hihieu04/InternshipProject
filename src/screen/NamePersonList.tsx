import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from 'react-native';
import axios from "../api/axios";


const NamePersonList = ({ navigation, route }) => {
    const { user, reportData } = route.params;
    const [data, setData] = useState(Object.values(reportData));

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('EditDataDate', {
                user,
                reportData: item,
                onSave: handleSaveChanges // Hàm xử lý khi lưu báo cáo
            })}
        >
            <Text style={styles.name}>{item.name_person}</Text>
        </TouchableOpacity>
    );

    const handleSaveChanges = (updatedReportData) => {
        const newData = data.map(report =>
            report.stt === updatedReportData.stt ? updatedReportData : report
        );
        setData(newData); 
    };
    const goBackToUploadDate = () => {
        navigation.navigate('UploadDate', { user });
    };
    const submitAllReports = async () => {
        try {
            const response = await axios.post('/datereports/create', { reports: data });

            if (response.status === 200) {
                Alert.alert('Thành công', 'Tất cả báo cáo đã được gửi thành công!', [
                    { text: 'OK', onPress: () => navigation.navigate('DateReport', { user }) }
                ]);
            } else {
                Alert.alert('Lỗi', 'Không thể gửi báo cáo. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting reports:', error);
            Alert.alert('Lỗi', 'Không thể kết nối với máy chủ. Vui lòng thử lại.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBackToUploadDate}>
                    <Image source={require('../images/back.png')} style={styles.icon}></Image>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Báo cáo sản lượng giao nhận mỗi ngày</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitAllReports}>
                <Text style={styles.submitButtonText}>Gửi Báo Cáo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 20
    },
    item: {
        padding: 15,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    backButton: {
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'stretch',
    },
    headerTitle: {
        color: 'gray',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10
    },
});

export default NamePersonList;
