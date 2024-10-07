import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

function UploadDate({ navigation, route }) {
    const { user } = route.params;
    const [selectedImage, setSelectedImage] = useState(null);
    const [jsonData, setJsonData] = useState(null); // Dữ liệu JSON sẽ được lưu ở đây

    // Hàm chọn ảnh
    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('Người dùng đã hủy chọn ảnh');
            } else if (response.error) {
                console.log('Lỗi chọn ảnh: ', response.error);
            } else {
                setSelectedImage(response.assets[0].uri);
            }
        });
    };

    // Gọi API để nhận dữ liệu JSON từ mô hình
    const fetchJsonDataFromApi = async () => {
        if (!selectedImage) {
            Alert.alert('Vui lòng chọn ảnh trước khi nộp báo cáo.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', {
                uri: selectedImage,
                type: 'image/jpeg',
                name: 'photo.jpg',
            });

            // Gửi yêu cầu POST tới API
            const response = await axios.post('https://27aa-34-168-181-254.ngrok-free.app/uploadfile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setJsonData(response.data.result); // Lưu dữ liệu JSON vào state (chỉ lấy phần result)
            console.log('Phản hồi từ API:', response.data.result);
        } catch (error) {
            console.error('Lỗi API:', error);
            Alert.alert('Đã xảy ra lỗi khi kết nối với API.');
        }
    };

    // Lấy ngày hiện tại và định dạng thành chuỗi 'YYYY-MM-DD'
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Hàm nộp báo cáo
    const submitReport = async () => {
        await fetchJsonDataFromApi(); // Gọi API để lấy dữ liệu JSON
    
        if (typeof jsonData === 'string') {
            jsonData = jsonData.trim(); // Xóa khoảng trắng thừa
            if (jsonData.startsWith("{") && jsonData.endsWith("}")) {
                jsonData = jsonData.slice(1, -1); // Cắt bỏ dấu ngoặc nhọn đầu và cuối
            }
            jsonData = JSON.parse(`{${jsonData}}`); // Chuyển thành đối tượng JSON
        }
    
        if (jsonData) {
            const reportData = {};
            const currentDate = getCurrentDate(); // Ngày hiện tại
    
            // Duyệt qua jsonData để tạo ra các báo cáo
            Object.keys(jsonData).forEach((key, index) => {
                const personData = jsonData[key];

                // Biến "T" và "TT" thành chuỗi trống
                const cleanedData = personData.map(item => (item === "T" || item === "TT" ? '' : item));

                reportData[`report${index + 1}`] = {
                    userId: user.user_id,  // Lấy ID người dùng từ route params
                    waterLevelArea: cleanedData[0] || 'Khu vực không xác định',  // Khu vực từ JSON
                    date: currentDate,  // Ngày hiện tại
                    licensePlate: 'ABC-XYZ',
                    cream_latex_kg: cleanedData[1],
                    block_latex_kg: cleanedData[2],
                    sheet_latex_kg: cleanedData[3],
                    frozen_latex_kg: cleanedData[4],
                    cup_latex_kg: cleanedData[5],
                    wire_latex_kg: cleanedData[6],
                    total_harvest_latex_kg: cleanedData[7],
                    imageName: 'NoImage'
                };
            });

            // Điều hướng tới AreaListReception với dữ liệu reportData
            navigation.navigate('AreaListReception', { user, reportData });
        }
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../images/back.png')} style={styles.icon}></Image>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chọn tập tin</Text>
                <TouchableOpacity onPress={() => setSelectedImage(null)}>
                    <Text style={styles.exitText}>Thoát</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {selectedImage ? (
                    <Image source={{ uri: selectedImage }} style={styles.image} />
                ) : (
                    <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
                        <Text style={styles.uploadButtonText}>Chọn tập tin</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
                    <Text style={styles.submitButtonText}>Nộp báo cáo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'green',
        padding: 15,
    },
    backText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    exitText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButton: {
        width: '80%',
        padding: 15,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#007BFF',
        fontSize: 18,
    },
    image: {
        width: 400,
        height: 400,
        borderRadius: 10,
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'stretch',
    },
    submitButton: {
        width: '50%',
        padding: 15,
        backgroundColor: '#007BFF',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
});

export default UploadDate;
