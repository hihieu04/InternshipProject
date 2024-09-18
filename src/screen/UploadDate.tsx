import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

function UploadDate({ navigation, route }) {
    const {user} = route.params;
    const [selectedImage, setSelectedImage] = useState(null);

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setSelectedImage(response.assets[0].uri);
            }
        });
    };

    const submitReport = () => {
        if (selectedImage) {
            const fileName = selectedImage.split('/').pop(); // Lấy tên file từ đường dẫn
            const reportData = {
                report1: {
                    userId: 1,
                    stt: 11,
                    name_person: 'Nguyễn Văn A',
                    waterLevelArea: 'Area 1',
                    date: '2024-08-01',
                    attendancePoint: 1,
                    personalEquipmentCheck: 'Checked',
                    confirmSign: 'John Doe',
                    imageName: fileName,
                    mainRubber: {
                        lo_name: 'Lo A',
                        nh3_liters: 100.5,
                        first_batch_cream: 200.0,
                        first_batch_block: 200.0,
                        first_batch_stove: 200.0,
                        second_batch_block: 150.0,
                        second_batch_stove: 250.0,
                        coagulated_latex: 150.0
                    },
                    secondaryRubber: {
                        lo_name: 'Lo B',
                        frozen_kg: 50.0,
                        stew_kg: 30.0,
                        wire_kg: 20.0,
                        total_harvest_kg: 100.0
                    }
                },
                report2: {
                    userId: 1,
                    name_person: 'Nguyễn Văn B',
                    stt: 12,
                    waterLevelArea: 'Area 2',
                    date: '2024-08-01',
                    attendancePoint: 1,
                    personalEquipmentCheck: 'Checked',
                    confirmSign: 'John Doe',
                    imageName: fileName,
                    mainRubber: {
                        lo_name: 'Lo C',
                        nh3_liters: 105.5,
                        first_batch_cream: 210.0,
                        first_batch_block: 220.0,
                        first_batch_stove: 240.0,
                        second_batch_block: 170.0,
                        second_batch_stove: 270.0,
                        coagulated_latex: 160.0
                    },
                    secondaryRubber: {
                        lo_name: 'Lo D',
                        frozen_kg: 60.0,
                        stew_kg: 40.0,
                        wire_kg: 25.0,
                        total_harvest_kg: 120.0
                    }
                }
            };
            navigation.navigate('NamePersonList', { user, reportData });
        } else {
            Alert.alert('Vui lòng chọn ảnh trước khi nộp báo cáo.');
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
        width: 200,
        height: 200,
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
