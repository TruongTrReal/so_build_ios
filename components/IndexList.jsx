import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import StockLineChart from './StockLineChart';

// Get the width of the device
const { height,width } = Dimensions.get('window');

const MiniChart = ({ indexName, onExportChange }) => {
  return (
    <StockLineChart 
      indexName={indexName}
      onExportChange={onExportChange}    
    />
  );
};

const IndexItem = ({ indexName, displaySymbol }) => {
  const [changeValues, setChangeValues] = useState({ CHANGE: 0, CHANGE_PERCENT: 0, CLOSE_PRICE: 0, COLOR: '' });

  const handleExportChange = (values) => {
    setChangeValues(values);
  };
  return (
    <View style={styles.indexItem}>
      <View style={styles.indexColumn}>
        <Text style={styles.indexName}>{displaySymbol}</Text>
        <MiniChart indexName={indexName} onExportChange={handleExportChange}/>
      </View>
      <View style={styles.valuesColumn}>
        <Text style={styles.indexValue}>{changeValues.CLOSE_PRICE}</Text>
        <Text style={[styles.change, { color: changeValues.COLOR }]}>
          {changeValues.CHANGE} ({changeValues.CHANGE_PERCENT}%)
        </Text>
      </View>
      <View style={styles.rightBorder} />
    </View>
  );
};

const IndexList = () => {
  // Mock data
  const indices = [
    { name: 'VNINDEX', displaySymbol: 'VNIndex'},
    { name: 'VN30', displaySymbol: 'VN30'},
    { name: 'HNX', displaySymbol: 'HNX'},
    // { name: 'UPINDEX', value: '224.41', change: '-1.69', percentage: '-0.75%', isPositive: false },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.indexList}
      >
      {indices.map((item, idx) => (
        <IndexItem
          key={idx}
          indexName={item.name}
          displaySymbol={item.displaySymbol}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  indexList: {
    backgroundColor: '#fff',
    height: 65,
    margin: 0,
  },
  indexItem: {
    flexDirection: 'row',
    height: 65,
    width: 160,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indexColumn: {
    justifyContent: 'space-between',
  },
  valuesColumn: {
    alignItems: 'flex-end',
    marginRight: 2,
  },
  indexName: {
    fontSize: 13,
    fontWeight: '400',
    color: '#646464',
    marginBottom: 5,
  },
  indexValue: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 0,
  },
  change: {
    fontSize: 11,
    fontWeight: '400',

  },
  rightBorder: {
    backgroundColor: '#808080',
    opacity: 0.1,
    position: 'absolute',
    right: 0,
    top: '50%', // Adjust this value to place the border in the middle
    height: '50%',
    width: 1,
    backgroundColor: 'black', // Change the color of the border as needed
  },
});

export default IndexList;
