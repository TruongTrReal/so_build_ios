import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { height,width } = Dimensions.get('window');

const BuySell = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonBuy} onPress={() => console.log('Buy button pressed')}>
        <Text style={styles.buttonText}>Mua</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSell} onPress={() => console.log('Sell button pressed')}>
        <Text style={styles.buttonText}>Bán</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width*0.04,
    zIndex:10,
    height: 80,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',

  },
  buttonBuy: {
    backgroundColor: '#00ab56', // Change to 'red' for the Sell button
    borderRadius: 40,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: width*0.44,
    height: 40,
  },
  buttonSell: {
    backgroundColor: '#d93843', // Change to 'red' for the Sell button
    borderRadius: 40,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: width*0.44,
    height: 40,

  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 17,
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
});

export default BuySell;
