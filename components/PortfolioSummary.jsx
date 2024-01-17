import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setGainHidden, setVolumeHidden } from '../redux/actions';


const { height,width } = Dimensions.get('window');

const PortfolioSummary = () => {
  const dispatch = useDispatch();

  // State for the toggle switch
  const [volumeHidden, setVolumeHiddenn] = useState(true);
  const [isProfitHidden, setProfitHidden] = useState(true);

  const accountPortfolioSummary  = useSelector((state) => state.accountPortfolioSummary);
  const gainHiddenRedux  = useSelector((state) => state.gain_hidden);
0
  const toggleProfitHidden = () => {
    setProfitHidden(prevState => !prevState);
    dispatch(setGainHidden(isProfitHidden))
  };
  // Handler for when the toggle switch changes
  const toggleSwitch = () => {
    setVolumeHiddenn(previousState => !previousState);
    dispatch(setVolumeHidden(volumeHidden))
  };


  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        {/* Tổng lãi danh mục */}
        <View style={[styles.summaryRow, { marginTop: height * 0.012 }]}>
          <View style={{flexDirection: 'row'}}>

            <Text style={styles.summaryTitle}>Lãi lỗ danh mục</Text>

            <TouchableWithoutFeedback onPress={toggleProfitHidden} style={styles.eyeBox}>
              <Image 
                source={isProfitHidden ? require('../assets/eye2_true.jpg') : require('../assets/eye2_false.jpg')}
                resizeMode='contain'
                style={styles.eye}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.totalProfitCol}>

            {gainHiddenRedux ? 
            <Text style={[
              styles.summaryValue, 
              styles.profitValue, 
              { color: accountPortfolioSummary.totalGain.startsWith('+') ? '#02ab57' : '#d93843' }
            ]}>{accountPortfolioSummary.totalGain ?? 0}</Text> : 
            <Text style={[
              styles.summaryValue, 
              styles.profitValue, 
            ]}>***</Text>
            }
            
            {gainHiddenRedux ? 
            <View style={[
              styles.summaryPercentage, 
              styles.percentBox,
              { borderColor: accountPortfolioSummary.totalGainPercentage.startsWith('+') ? '#02ab57' : '#d93843',
                backgroundColor: accountPortfolioSummary.totalGainPercentage.startsWith('+') ? '#def8de' : '#ffdbde',
              }

            ]}>     
              <Text style={[
                styles.profitPercentage, 
                { color: accountPortfolioSummary.totalGainPercentage.startsWith('+') ? '#02ab57' : '#d93843' }
              ]}>{accountPortfolioSummary.totalGainPercentage ?? 0}</Text>
            </View> : 
            <></> 
            }


          </View>
        </View>

        {/* Dash line */}
        <View style={{overflow: 'hidden'}}>
          <View
            style={{
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: '#d9d9d9',
              margin: -3.1,
              height: 1,
              marginBottom: 0,
            }}>
            <View style={{width: 2000}}></View>
          </View>
        </View>

        {/* Lãi lỗ hôm nay */}
        <View style={[styles.summaryRow, { marginTop: height * 0.012 }]}>
          <View style={{flexDirection: 'row', marginTop: height * 0.005 }}>
            <Text style={[styles.summaryTitle]}>Lãi/Lỗ hôm nay</Text>
            <TouchableWithoutFeedback onPress={toggleProfitHidden} style={styles.eyeBox}>
              <Image 
                source={require('../assets/detail2.jpg')}
                resizeMode='contain'
                style={styles.detailI}
              />
            </TouchableWithoutFeedback>
          </View>

          {gainHiddenRedux ? 
          <Text style={[styles.summaryValue, styles.lossValue, { color: accountPortfolioSummary.todayChange.startsWith('+') ? '#02ab57' : '#d93843' }]}>{accountPortfolioSummary.todayChange}</Text>
          : <Text style={[styles.summaryValue, styles.lossValue]}>***</Text>
          }

          </View>

        {/* tổng vốn */}
        <View style={styles.summaryRow}>
          <View style={{flexDirection: 'row', marginTop: height * 0.005 }}>
            <Text style={styles.summaryTitle}>Tổng vốn</Text>
            <TouchableWithoutFeedback onPress={toggleProfitHidden} style={styles.eyeBox}>
              <Image 
                source={require('../assets/detail2.jpg')}
                resizeMode='contain'
                style={styles.detailI}
              />
            </TouchableWithoutFeedback>
          </View>

          {gainHiddenRedux ? 
          <Text style={styles.summaryValue}>{accountPortfolioSummary.totalAsset}</Text>
          : <Text style={styles.summaryValue}>***</Text>
          }

        </View>

        {/* Giá trị thị trường */}
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryTitle, { marginTop: height * 0.005 }]}>Tổng giá trị thị trường</Text>
          <Text style={styles.summaryValue}>{gainHiddenRedux ? accountPortfolioSummary.totalMarketValue : '***'}</Text>
        </View>
      </View>
      
      {/* Ẩn KL, Bán nhiều button */}
      <View style={styles.row}>
        <View style={[styles.volumeRow, { marginLeft: -4 }]}>
          <TouchableWithoutFeedback onPress={toggleSwitch}>
            <Image 
              source={volumeHidden ? require('../assets/checked.jpg') : require('../assets/not_checked.jpg')}
              resizeMode='contain'
              style={styles.detailI}
            />
          </TouchableWithoutFeedback>
          <Text style={styles.volumeText}>Ẩn Khối Lượng</Text>
        </View>
        <TouchableOpacity style={styles.sellButton}>
          <Text style={styles.sellButtonText}>Bán nhiều mã</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,

  },
  summaryContainer: {
    backgroundColor: '#f5f5fa',
    marginTop: 2,
    paddingHorizontal: width*.03,
    paddingVertical: 3,
    borderRadius: 16,
    flexDirection: 'column',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  row: {
    // backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,

  },
  summaryTitle: {
    // backgroundColor: 'red',
    fontSize: 13,
    color: 'black',
    fontWeight: "300"
  },
  eyeBox: {
  },
  eye: {
    marginLeft: 5,
    marginTop: -2,
    width: 18,
    height: 18,
  },
  detailI: {
    marginLeft: 5,
    marginTop: -2,
    width: 18,
    height: 18,
  },
  totalProfitCol: {
    // backgroundColor: 'red',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  summaryValue: {
    marginTop: 2,
    color: 'black',
    fontSize: 15,
    fontWeight: '400',
  },
  summaryPercentage: {
    marginTop: 2,
    color: 'black',
    fontSize: 15,
    fontWeight: '400',
  },
  profitValue: {
    fontSize: 15,
    marginTop: 2,
  },
  percentBox: {
    // borderColor: '#d93843',
    borderWidth: 1,
    // backgroundColor: '#ffdbde',
    borderRadius: 10,
    padding: 1,
    marginTop: 5,
    height: 18,
    paddingHorizontal: 2,

  },
  profitPercentage: {
    color: '#d93843',
    fontSize: 12,
    fontWeight: '400',
  },
  lossValue: {
    marginTop: 2,
    color: 'black',
    fontSize: 15,
    fontWeight: '400',
  },
  divider: {
    height: 1, // Set the desired height for your divider line
    borderBottomColor: '#ECECEC', // Set the color of your divider line
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderRadius: 1
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,

  },
  volumeText: {
    marginLeft: 8,
    fontSize: 15,
    color: 'black',
    fontWeight: '300'
  },
  sellButton: {
    // width: width*0.1,
    // height: height*0.04,
    paddingVertical: 6,
    paddingHorizontal: 23,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#a00a23',
    alignSelf: 'center', // Align to the left
  },
  sellButtonText: {
    color: '#a00a23',
    fontSize: 13,
    fontWeight: '400',
  },
});

export default PortfolioSummary;
