import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Dimensions, Image } from 'react-native';
import { TabHeader, AppBody, BuySell, Modify } from './components/zzindex.jsx';
import { Provider } from 'react-redux';
import store from './redux/store';


const { height,width } = Dimensions.get('window');

export default function App() {
  console.log('device height: ', height)
  return (
    <Provider store={store}>

      <SafeAreaView style={styles.container}>

        <ScrollView scrollEnabled={false}>

          <View style={styles.wrapper}>
            <TabHeader style={styles.header} />
            <View style={styles.body}>
              <Image style={styles.event} source={require('./assets/event11.jpg')} resizeMode='stretch'/>

              <AppBody />
            </View>
          </View>
          
        </ScrollView>
        <View style={styles.footer}>
          <BuySell />
        </View>
        <StatusBar style='auto' />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    width: width,
    height: height,
  },
  model: {
    width: width,
    aspectRatio: 16 / 1,
    position: 'absolute',
    top: -500,
    zIndex: 20,
    opacity: 0.2,
  },
  event: {
    backgroundColor: 'red',
    width: width,
    height: 32,
  },
  header: {
  },
  body: {
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: width,
    backgroundColor: '#fff',
    height: height*0.129,

  },
});


