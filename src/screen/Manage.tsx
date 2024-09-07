import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import HomeManage from './HomeManage';
import Reminder from './Reminder';
import Notification from './Notification';
import More from './More';

const Tab = createBottomTabNavigator();

function Manage({navigation, route}) {
    const {user} = route.params;
    const goBack = () => {
        navigation.goBack();
      }
    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: 'green',  // Màu của tab đang được chọn
                    tabBarInactiveTintColor: 'gray', // Màu của tab không được chọn
                    tabBarStyle: {
                        backgroundColor: '#f8f8f8', // Màu nền của thanh tab
                        borderTopWidth: 0, // Xóa đường viền phía trên
                    },
                    headerShown: false,
                }}
            >
                <Tab.Screen 
                    name="Trang chủ" 
                    component={HomeManage}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Image 
                                source={require('../images/home.png')} 
                                style={{ width: 30, height: 30, tintColor: color }} 
                                resizeMode="stretch"
                            />
                        ),
                    }}
                    initialParams={{ user, goBack }}
                />
                <Tab.Screen 
                    name="Nhắc nhở" 
                    component={Reminder}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Image 
                                source={require('../images/clock.png')} 
                                style={{ width: 30, height: 30, tintColor: color }} 
                                resizeMode="stretch"
                            />
                        ),
                    }}
                />
                <Tab.Screen 
                    name="Thông báo" 
                    component={Notification}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Image 
                                source={require('../images/notification.png')} 
                                style={{ width: 30, height: 30, tintColor: color }} 
                                resizeMode="stretch"
                            />
                        ),
                    }}
                />
                <Tab.Screen 
                    name="Khác" 
                    component={More}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Image 
                                source={require('../images/menu-bar.png')} 
                                style={{ width: 30, height: 30, tintColor: color }} 
                                resizeMode="stretch"
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default Manage;
