import React from 'react';
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../theme/theme';

function Home({ navigation, route }): React.JSX.Element {
  const {user, goBack} = route.params;
  console.log(route.params);
  const handleToDateReport = () => {
    navigation.navigate('DateReport',{user: user} )
  }
  const handleToReceptionReport = () => {
    navigation.navigate('ReceptionReport',{user: user})
  }
  return (
    <ImageBackground style={styles.container} source={require('../images/home1.jpg')}>
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <View style={styles.innerHeaderContainer}>
            <TouchableOpacity>
              <Image source={require('../images/user.png')} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.textInHeader}>Xin chào, {user.lastname} </Text>
          </View>
          <TouchableOpacity onPress={goBack}>
            <Image source={require('../images/switch.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleToDateReport}>
          <View style={styles.button}>
            <Text style={styles.textInButton}>BÁO CÁO MỦ NGÀY</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleToReceptionReport}>
          <View style={styles.button}>
            <Text style={styles.textInButton}>BÁO CÁO TIẾP NHẬN MỦ</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 3,
  },
  footer: {
    flex: 7
  },
  button: {
    width: '80%',
    height: 100,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: COLORS.primaryWhiteHex,
  },
  textInButton: {
    fontSize: 22,
    color: COLORS.primaryWhiteHex,
    fontWeight: 'bold'
  },
  buttonContainer: {
    margin: 10,
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'stretch',
    margin: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textInHeader: {
    color: COLORS.primaryWhiteHex,
    fontSize: 24
  },
  innerHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default Home;