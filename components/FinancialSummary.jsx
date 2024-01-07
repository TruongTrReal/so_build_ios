import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, Image, TouchableWithoutFeedback } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab, setAccountSummary } from '../redux/actions';

const { height,width } = Dimensions.get('window');
let imageHeight = 135;

const FinancialSummary = () => {
  const [isContentHidden, setContentHidden] = useState(false);

  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.activeTab);
  const accountNumber = useSelector((state) => state.accountNumber);
  const summary = useSelector((state) => state.accountSummary);
  const [loading, setLoading] = useState(false);

  
  const formattedNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const fetchAccountSummary = async () => {
    setLoading(true);

    try {
      const response = await fetch(`https://magnetic-eminent-bass.ngrok-free.app/account-summary/${accountNumber}/${activeTab}/`);
      const data = await response.json();
      dispatch(setAccountSummary(data.summary));
    } catch (error) {
      console.error('Error fetching account summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleContentHidden = () => {
    setContentHidden(prevState => !prevState);
  };

  const handleSummary = (x) => {
    if (x==undefined) {
      return fakedata = {
        total_asset: 0,
        total_cash: 0,
        margin_ratio: 100
      };
    } else {
      return x
    }
  };

  let imageSource, opaTrangthai, opaAntoan;

  if (activeTab === '1') {
    imageSource = require('../assets/finance_box_1.jpg');
    imageHeight = 135;
    opaTrangthai = 0;
    opaAntoan = 0;
  } else if (activeTab === '3') {
    imageSource = require('../assets/finance_box_3.jpg');
    imageHeight = 180;
    opaTrangthai = 1;
    opaAntoan = 1;
  } else {
    imageSource = require('../assets/finance_box_6.jpg');
    imageHeight = 135;
    opaTrangthai = 1;
    opaAntoan = 1;
  }

  useEffect(() => {
      fetchAccountSummary();
      // fetchStocksData();
  }, [accountNumber, activeTab]);
  
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={imageSource}
        style={[styles.absoluteFill, {
          height: imageHeight,
        }]} 
        resizeMode="stretch" 
      >
        <View style={styles.summary}>
          <View style={styles.detailColumn}>
            <View style={styles.firstLineBox}>
              <Text style={styles.title}>Tài sản ròng</Text>
              <TouchableWithoutFeedback onPress={toggleContentHidden} style={styles.eyeBox}>
                  <Image 
                    source={isContentHidden ? require('../assets/eye_true.jpg') : require('../assets/eye_false.jpg')}
                    resizeMode='contain'
                    style={styles.eye}
                  />
              </TouchableWithoutFeedback>
            </View>
            <Text style={styles.amount}>{isContentHidden ? '***' : formattedNumber(handleSummary(summary).total_asset ?? 0) + ' VND'}</Text>
            <Text style={styles.subTitle}>Sức mua</Text>
            <Text style={styles.subAmount}>{isContentHidden ? '***' : formattedNumber(handleSummary(summary).total_cash ?? 0) + ' VND'}</Text>
          </View>
          <View style={styles.actionColumn}>
            <TouchableOpacity style={{opacity: 1}}>
              <Image style={styles.detailButton} source={require("../assets/chitiet.jpg")} />
            </TouchableOpacity>
            <TouchableOpacity style={{opacity: opaTrangthai}}>
              <Image style={styles.statusButton} source={require('../assets/trangthai.jpg')} />
            </TouchableOpacity>
            <TouchableOpacity style={{opacity: opaAntoan}}>
              <View style={{
                flexDirection: 'row', 
                alignContent: 'center', 
                position: "absolute",
                right: 0,
                marginTop: 61,
              }}>
                <Text style={{fontWeight: '500', fontSize: 16, color: '#33a463'}}>{(handleSummary(summary).margin_ratio ?? 100).toFixed(2)}% - An toàn</Text>
                <Image style={styles.saveRatioButton} source={require("../assets/save_ratio.jpg")}/>
              </View>

            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
  },
  absoluteFill: {
    width: width*1,

  },
  summary: {
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstLineBox: {
    flexDirection: "row",
    marginTop: -10,
  },
  detailColumn: {
    justifyContent: 'space-around',
    marginLeft: width*0.02,
    position:'absolute',
    left: 24,
    top: 28
  },
  actionColumn: {
    width: width*0.5,
    height:'auto',
    justifyContent: 'space-around',
    marginRight: width*0.02,
    position:'absolute',
    right: 26,
    top: 40
  },
  title: {
    fontSize: 13,
    fontWeight: '300',
    color: '#333',
  },
  eye: {
    marginLeft: 5,
    width: 19,
    height: 19,
  },
  amount: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '300',
    marginTop: 20,
  },
  subAmount: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginTop: 5

  },
  detailButton: {
    position: "absolute",
    right: 0,
    width: 55,
    height: 13,
  },
  statusButton: {
    position: "absolute",
    right: 0,
    width: 80,
    height: 18,
    marginTop: 35,
  },
  saveRatioButton: {
    // position: "absolute",
    // right: 0,
    width: 15,
    height: 12,
    alignSelf: 'center',
    marginTop: 2,

  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: '400',
    color: 'green',
  },
  // ... Add other styles you might need
});

export default FinancialSummary;
