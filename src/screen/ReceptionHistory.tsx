import React, { useState, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { COLORS } from '../theme/theme';

function ReceptionHistory({ navigation, route }) {
    const { user } = route.params;
    const userId = user.user_id;
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://192.168.1.7:3000/receptionreports`, {
            params: {
                userId: userId
            }
        })
            .then(response => {
                console.log('Reports fetched:', response.data);
                setReports(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching reports:', error);
                setLoading(false);
                if (error.response) {
                    Alert.alert('Error', `Unable to fetch reports. Server responded with status code ${error.response.status}`);
                } else if (error.request) {
                    Alert.alert('Error', 'Unable to fetch reports. No response from server.');
                } else {
                    Alert.alert('Error', `Unable to fetch reports. Error: ${error.message}`);
                }
            });
    }, [userId]);

    const handlePressToDetail = (report) => {
        navigation.navigate('ReceptionHistoryDetail', { user: user, reportId: report.reception_report_id });
    };

    const handleDeleteReport = (reportId) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn chắc chắn muốn xóa báo cáo này?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', onPress: () => deleteReport(reportId) },
            ]
        );
    };

    const deleteReport = (reportId) => {
        axios.delete(`http://192.168.1.7:3000/receptionreports/${reportId}`)
            .then(() => {
                setReports(reports.filter(report => report.reception_report_id !== reportId));
                Alert.alert('Thành công', 'Báo cáo đã được xóa.');
            })
            .catch(error => {
                console.error('Error deleting report:', error);
                Alert.alert('Error', 'Unable to delete report.');
            });
    };

    const renderItem = ({ item }) => {
        const formattedDate = new Date(item.date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        return (
            <View style={styles.itemContainer}>
                 <TouchableOpacity onPress={() => handlePressToDetail(item)}>
                    <View style={styles.itemContent}>
                        {/* Wrapping all text inside <Text> components */}
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.title}>ID: {item.reception_report_id}</Text>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditReceptionReport', { report: item })}>
                        <Text style={styles.editText}>Sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteReport(item.reception_report_id)}>
                        <Text style={styles.deleteText}>Xóa</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color={COLORS.primaryDarkGreyHex} />;
    }

    if (reports.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.innerHeader}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require('../images/back.png')} style={styles.icon} />
                        </TouchableOpacity>
                        <Text style={styles.textInHeader}>Lịch sử báo cáo tiếp nhận</Text>
                    </View>
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Trống</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.innerHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../images/back.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.textInHeader}>Lịch sử báo cáo tiếp nhận</Text>
                </View>
            </View>
            <FlatList
                data={reports}
                renderItem={renderItem}
                keyExtractor={item => item.reception_report_id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryWhiteHex,
    },
    header: {
        marginBottom: 10,
    },
    innerHeader: {
        backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'stretch',
        margin: 10,
    },
    textInHeader: {
        color: COLORS.primaryWhiteHex,
        fontSize: 24,
    },
    itemContainer: {
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        margin: 10,
        borderWidth: 1,
    },
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primaryBlackHex,
    },
    date: {
        fontSize: 14,
        color: COLORS.primaryDarkGreyHex,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    editText: {
        marginRight: 20,
        color: 'blue',
    },
    deleteText: {
        color: 'red',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 24,
        color: COLORS.primaryDarkGreyHex,
    },
});

export default ReceptionHistory;
