import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from 'react-native';
import axios from "../api/axios";

const AreaListReception = ({ navigation, route }) => {
    const { user, reportData} = route.params; 
    const [data, setData] = useState(Object.values(reportData)); // Lưu trữ danh sách báo cáo

    // Kiểm tra dữ liệu
    console.log('Danh sách dữ liệu:', data);

    // Hàm render từng khu vực và tên người nhận
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('EditDataReception', {
                user,
                reportData: item,
                onSave: handleSaveChanges
            })}
        >
            <Text style={styles.name}>{item.waterLevelArea || item.water_level_area}</Text> 
        </TouchableOpacity>
    );

    // Hàm xử lý khi lưu chỉnh sửa từ trang EditDataReception
    const handleSaveChanges = (updatedReportData) => {
        const newData = data.map(report =>
            report.waterLevelArea === updatedReportData.waterLevelArea ? updatedReportData : report
        );
        setData(newData); // Cập nhật danh sách báo cáo với dữ liệu đã chỉnh sửa
    };

    // Hàm gửi toàn bộ báo cáo sau khi hoàn thành chỉnh sửa
    const submitAllReports = async () => {
        try {
            const response = await axios.post('/receptionreports/create', { reports: data });

            if (response.status === 200) {
                Alert.alert('Thành công', 'Tất cả báo cáo đã được gửi thành công!', [
                    { text: 'OK', onPress: () => navigation.navigate('ReceptionReport', { user }) }
                ]);
            } else {
                Alert.alert('Lỗi', 'Không thể gửi báo cáo. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting reports:', error);
            Alert.alert('Lỗi', 'Không thể kết nối với máy chủ. Vui lòng thử lại.');
        }
    };

    const goBackToUploadReception= () => {
        navigation.navigate('UploadReception', { user });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBackToUploadReception}>
                    <Image source={require('../images/back.png')} style={styles.icon}></Image>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Danh sách báo cáo tiếp nhận mủ</Text>
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

export default AreaListReception;
