import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

function UploadDate({ navigation, route }) {
    const { user } = route.params;
    const [selectedImage, setSelectedImage] = useState(null);
    const [jsonData, setJsonData] = useState(null);

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

            const response = await axios.post('https://6add-34-168-181-254.ngrok-free.app/uploadfile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setJsonData(response.data.result); 
            console.log('Phản hồi từ API:', response.data.result);
        } catch (error) {
            console.error('Lỗi API:', error);
            Alert.alert('Đã xảy ra lỗi khi kết nối với API.');
        }
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const submitReport = async () => {
        await fetchJsonDataFromApi(); 
    
        if (typeof jsonData === 'string') {
            jsonData = jsonData.trim(); 
            if (jsonData.startsWith("{") && jsonData.endsWith("}")) {
                jsonData = jsonData.slice(1, -1);
            }
            jsonData = JSON.parse(`{${jsonData}}`); 
        }
    
        if (jsonData) {
            const reportData = {};
            const currentDate = getCurrentDate();
    
            Object.keys(jsonData).forEach((key, index) => {
                let personData = jsonData[key];
                
                personData = personData.map(item => (item === "T" || item === "TT") ? "" : item);
    
                const namePerson = personData[0] || 'Tên không xác định';
                const attendancePoint = personData[1] || 1;
                const waterLevelArea = personData[2] || 'Khu vực không xác định';
                
                reportData[`report${index + 1}`] = {
                    userId: user.user_id, 
                    stt: index + 1, 
                    name_person: namePerson,  
                    waterLevelArea: waterLevelArea, 
                    date: currentDate, 
                    attendancePoint: attendancePoint,
                    personalEquipmentCheck: 'checked', 
                    confirmSign: namePerson, 
                    imageName: 'NoImage',  
                    mainRubber: {
                        lo_name: personData[3] || '',
                        nh3_liters: personData[4] || 0,  
                        first_batch_cream: personData[5] || 0,  
                        first_batch_block: personData[6] || 0,  
                        first_batch_stove: personData[7] || 0,  
                        second_batch_block: personData[8] || 0,  
                        second_batch_stove: personData[9] || 0,  
                        coagulated_latex: personData[10] || 0  
                    },
                    secondaryRubber: {
                        lo_name: personData[11] || '', 
                        frozen_kg: personData[12] || 0, 
                        stew_kg: personData[13] || 0, 
                        wire_kg: personData[14] || 0,  
                        total_harvest_kg: personData[15] || 0  
                    }
                };
            });
    
            navigation.navigate('NamePersonList', { user, reportData });
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
