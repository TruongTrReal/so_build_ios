import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setAccountPortfolio, setAccountPortfolioSummary } from '../redux/actions';

const { width, height } = Dimensions.get('window');

const PortfolioComponent = () => {

  const dispatch = useDispatch();
  const accountNumber = useSelector((state) => state.accountNumber);
  const activeTab = useSelector((state) => state.activeTab);
  const accountPortfolio = useSelector((state) => state.accountPortfolio);
  const accountPortfolioSummary = useSelector((state) => state.accountPortfolio);
  const gainHiddenRedux  = useSelector((state) => state.gain_hidden);
  const volumeHiddenRedux  = useSelector((state) => state.volume_hidden);
  
  const [loading, setLoading] = useState(false);
  const [stocksData, setStocksData] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});


  const fetchStocksData = async () => {
    setLoading(true);

    try {
      const response = await fetch(`https://magnetic-eminent-bass.ngrok-free.app/stocks/${accountNumber}/${activeTab}`);
      const data = await response.json();
      console.log('fetch data from API')
      dispatch(setAccountPortfolio(data));
      setStocksData(data);
    } catch (error) {
      console.error('Error fetching stocks data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formattedNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  // Function to calculate gainLoss and gainPercentage for each item
  const ModifyData = (portfolio) => {
    let totalGainLoss = 0;
    let totalGainPercentage = 0;
    let totalAsset = 0;
    let totalMarketValue = 0;
    let todayChange = 0;
  
    if (portfolio!==undefined) {
      const modifiedPortfolio = portfolio.map(item => {
        const averagePrice = ((item.owning_price - (item.owning_price * 0.0013)) / 1000).toFixed(2);
        const marketPrice = (item.market_price / 1000).toFixed(2);
        const gainLoss = ((marketPrice - averagePrice) * item.total_volume * 1000).toFixed(0);
        const gainPercentage = (((marketPrice - averagePrice) / averagePrice) * 100);
    
        totalGainLoss += parseFloat(gainLoss);
        totalAsset += parseFloat(averagePrice * item.total_volume * 1000);
        totalMarketValue += parseFloat(item.market_price * item.total_volume);
        todayChange += item.total_volume * item.change;
  
        return {
          ...item,
          market_price: marketPrice,
          gainLoss: `${gainLoss >= 0 ? '+' : '-'}${formattedNumber(Math.abs(gainLoss))}`,
          gainPercentage: `${gainPercentage >= 0 ? '+' : '-'}${formattedNumber(Math.abs(gainPercentage).toFixed(2))}%`,
          owning_price: averagePrice,
        };
      });
    }



    totalGainPercentage = (100 - ((totalAsset - totalGainLoss) / totalAsset) * 100).toFixed(2);
    return {
      modifiedPortfolio,
      totalGainLoss: `${totalGainLoss >= 0 ? '+' : '-'}${formattedNumber(Math.abs(totalGainLoss))}`,
      totalGainPercentage: `${totalGainLoss >= 0 ? '+' : '-'}${formattedNumber(Math.abs(totalGainPercentage).toFixed(2))} %`,
      totalAsset: `${formattedNumber(Math.abs(totalAsset))}`,
      totalMarketValue: `${formattedNumber(Math.abs(totalMarketValue))}`,
      todayChange: `${todayChange >= 0 ? '+' : '-'}${formattedNumber(Math.abs(todayChange))}`,

    };
  };
  
  // Calculate gainLoss and gainPercentage for the portfolioData
  const { modifiedPortfolio, totalGainLoss, totalGainPercentage, totalAsset, totalMarketValue, todayChange } = ModifyData(accountPortfolio.stocks);
  

  dispatch(setAccountPortfolioSummary({
    totalGain: totalGainLoss,
    totalGainPercentage: totalGainPercentage,
    totalAsset: totalAsset,
    totalMarketValue: totalMarketValue,
    todayChange: todayChange,
  }));

  useEffect(() => {
      // fetchAccountSummary();
      fetchStocksData();
      dispatch(setAccountPortfolioSummary({
        totalGain: totalGainLoss,
        totalGainPercentage: totalGainPercentage,
        totalAsset: totalAsset,
        totalMarketValue: totalMarketValue,
        todayChange: todayChange,
      }));
  }, [activeTab, accountNumber]);

  let renderPortfolioItems;
  if (modifiedPortfolio!==undefined) {
    let renderPortfolioItems = modifiedPortfolio.map((item, index) => (
    
      <React.Fragment key={index}>
  
        <TouchableOpacity
          style={[styles.portfolioItem,
            !selectedItems[index] ? { borderBottomWidth: 0.5, borderBottomColor: '#ECECEC' } :{}
          ]}
          activeOpacity={1}
          onPress={() => {
            setSelectedItems((prevSelectedItems) => ({
              ...prevSelectedItems,
              [index]: !prevSelectedItems[index],
            }));
          }}
  
        >
          {/*  */}
          <View style={[{ position: 'relative', left: width * 0, flexDirection: 'row' }]}>
            <Text style={[styles.symbolText, { color: item.gainPercentage.startsWith('+') ? '#02ab57' : '#d93843' }]}>{item.stock_symbol}</Text>
            <Image 
              source={ selectedItems[index] ? require('../assets/vup.png') : require('../assets/vdown.png')}
              resizeMode='contain'
              style={styles.vDown}
            />
          </View>
          <View style={[{ position: 'absolute', right: width * 0.68 }]}>
            <Text style={[styles.buyingPriceText]}>{gainHiddenRedux ? item.owning_price : '***'}</Text>
  
          </View>
          <View style={[{ position: 'absolute', right: width * 0.53 }]}>
            <Text style={[styles.priceText, ]}>{item.market_price}</Text>
  
          </View>
          <View style={[{ position: 'absolute', right: width * 0.31 }]}>
            <Text style={[styles.sharesText, ]}>{volumeHiddenRedux ? formattedNumber(item.having_volume) : '***'}</Text>
  
          </View>
          {gainHiddenRedux ? 
          <View 
            style={[{ 
              position: 'relative', 
              right: width*.004,
              width: width*0.173,
              height: width*0.065,
              // borderWidth: 2,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: item.gainPercentage.startsWith('+') ? '#02ab57' : '#d93843',
            }]}
          >
            <Text style={[styles.gainLossText, { color: '#fff' }]}>
              {item.gainPercentage}
            </Text>
          </View>
          :
          <View 
            style={[{ 
              position: 'relative', 
              right: width*.004,
              width: width*0.17,
              height: height*0.04,
              // borderWidth: 2,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }]}
          ><Text>***</Text></View>
          }
  
        </TouchableOpacity>
  
        {/* Conditionally render the detail view below the selected item */}
        {selectedItems[index] && (
          <View style={styles.detailContainer}>
  
            {/* first row  */}
            <View style={styles.firstRowBox}>
              <View  style={styles.firstRowCol}>
                <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>Tổng vốn</Text>
                <Text style={[{fontWeight: '400', fontSize: 13, marginTop: 5,}]}>{gainHiddenRedux ? formattedNumber((1000*item.total_volume*item.owning_price).toFixed(0)) : '***'}</Text>
              </View>
              <View style={styles.firstRowCol}>
                <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>Giá trị thị trường</Text>
                <Text style={[{fontWeight: '400', fontSize: 13, marginTop: 5}]}>{gainHiddenRedux ? formattedNumber((1000*item.total_volume*item.market_price).toFixed(0)) : '***'}</Text>
              </View>
              <View style={styles.firstRowCol}>
                <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>Lãi / lỗ</Text>
                {gainHiddenRedux ? 
                <Text style={[{fontWeight: '400', fontSize: 13, marginTop: 5, color: item.gainLoss.startsWith('+') ? '#07ba5b' : '#ff424e'}]}>
                  {formattedNumber(item.gainLoss)}
                </Text>
                : <Text style={[{fontWeight: '400', fontSize: 13, marginTop: 5}]}>
                  ***
                </Text>
              }
              </View>
            </View>
            
            {/* second row  */}
            <View style={styles.secondRowBox}>
  
              {/* top box  */}
              <View style={styles.secondRowBox_1}>
                <View style={styles.line_rows}>
                  <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>Tổng KL</Text>
                  <Text style={[{fontWeight: '400', fontSize: 13}]}>{volumeHiddenRedux ? formattedNumber(item.total_volume) : '***'}</Text>
                </View>
                <View style={styles.line_rows}>
                  <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>KL thường</Text>
                  <Text style={[{fontWeight: '400', fontSize: 13}]}>{volumeHiddenRedux ? formattedNumber(item.having_volume) : '***'}</Text>
                </View>
                <View style={styles.line_rows}>
                  <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>KL FS</Text>
                  <Text style={[{fontWeight: '400', fontSize: 13}]}>{volumeHiddenRedux ? formattedNumber(item.FS_volume) : '***'}</Text>
                </View>
                <View style={styles.line_rows}>
                  <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>KL khả dụng</Text>
                  <Text style={[{fontWeight: '400', fontSize: 13}]}>{volumeHiddenRedux ? formattedNumber(item.having_volume) : '***'}</Text>
                </View>
                <View style={styles.line_rows}>
                  <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>Outroom</Text>
                  <Text style={[{fontWeight: '400', fontSize: 13}]}>{volumeHiddenRedux ? formattedNumber(item.Outroom_volume) : '***'}</Text>
                </View>
              </View>
  
              {/* bottom box  */}
              <View  style={styles.secondRowBox_2}>
                <View  style={styles.secondRowBox_2a}>
                  <View style={styles.line_rows}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>KL Khác</Text>
                      <Image 
                        source={require('../assets/detail2.jpg')}
                        resizeMode='contain'
                        style={{
                          width: 14,
                          height:14,
                          marginLeft: 5,
                        }}
                      />
                    </View>
                    <Text style={[{fontWeight: '400', fontSize: 13}]}>{volumeHiddenRedux ? formattedNumber(item.other_volume) : '***'}</Text>
                  </View>
                  <View style={styles.line_rows}>
                    <Text style={[{fontWeight: '300', fontSize: 12, color: '#676770' }]}>CPCT/Thưởng</Text>
                    <Text style={[{fontWeight: '400', fontSize: 13}]}>{volumeHiddenRedux ? formattedNumber(item.reward_volume) : '***'}</Text>
                  </View>
                </View>
  
                <View  style={styles.secondRowBox_2b}>
                  <Text  style={[{fontWeight: '400', fontSize: 13}]}>KL mua chờ về</Text>
                  <View style={styles.line_rows}>
                    <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>KL T0</Text>
                    <Text style={[{fontWeight: '400', fontSize: 13}]}>{volumeHiddenRedux ? formattedNumber(item.t0_volume) : '***'}</Text>
                  </View>
                  <View style={styles.line_rows}>
                    <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>KL T1</Text>
                    <Text style={[{fontWeight: '400', fontSize: 13}]}>{volumeHiddenRedux ? formattedNumber(item.t1_volume) : '***'}</Text>
                  </View>
                  <View style={styles.line_rows}>
                    <Text style={[{fontWeight: '300', fontSize: 13, color: '#676770' }]}>KL T2</Text>
                    <Text style={[{fontWeight: '400', fontSize: 13}]}>{volumeHiddenRedux ? formattedNumber(item.t2_volume): '***'}</Text>
                  </View>
                </View>
              </View>
            </View>
  
            <View style={styles.buttons_row}>
              <TouchableOpacity activeOpacity={1} style={[styles.buttonInRow, { borderColor: '#0baf5d' }]}>
                <Text style={{fontSize: 13, fontWeight: '400', color: '#0baf5d'}}>Mua</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={[styles.buttonInRow, { borderColor: '#d93843' }]}>
                <Text style={{fontSize: 13, fontWeight: '400', color: '#d93843'}}>Bán</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={[styles.buttonInRow, { borderColor: '#656565' }]}>
                <Text style={{fontSize: 13, fontWeight: '400', color: '#656565'}}>Thông tin mã</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </React.Fragment>
    ));
  } else {
    let renderPortfolioItems = () => {
      return (
        <View></View>
      )
    }
  }


  return (
    <View style={styles.container}>
      {/* Handle area */}

      <View style={styles.tableHeader}>
        <Text style={[styles.headerLabel, { position: 'relative', left: 0 }]}>MÃ CP</Text>
        <Text style={[styles.headerLabel, { position: 'absolute', right: width * 0.68, top: height*.007 }]}>GIÁ VỐN</Text>
        <Text style={[styles.headerLabel, { position: 'absolute', right: width * 0.53, top: height*.007 }]}>GIÁ TT</Text>
        <View style={{ position: 'absolute', right: width * 0.3,top: height*.007, flexDirection: 'row' }}>
          <Text style={[styles.headerLabel]}>KL</Text>
          <Image 
            source={require('../assets/updown.png')}
            resizeMode='contain'
            style={styles.upDownIcon}
          />
        </View>
        <Text style={[styles.headerLabel, { position: 'relative', right: width*.04, }]}>LÃI/LỖ</Text>
      </View>

      {renderPortfolioItems}

      <View style={styles.whiteBox} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  portfolioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width*0.04,
    paddingVertical: width*0.036,

  },
  symbolText: {
    fontSize: 15,
    fontWeight: '500',
  },
  buyingPriceText: {
    fontSize: 15,
    fontWeight: '500',
  },
  sharesText: {
    fontSize: 15,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '500',
  },
  gainLossText: {
    fontSize: 13,
    fontWeight: '400',

  },
  tableHeader: {
    // backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width*0.04,
    paddingVertical: 6,
    marginTop:-7,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 0.5,
    
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '300',
    color: '#838383'
  },
  detailContainer: {
    // backgroundColor: 'yellow',
    paddingHorizontal: 0,
    paddingVertical: 0,
    zIndex: 1,
    height: 260,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 0.5,    
  },

  firstRowBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf:'center',
    width: width*0.91,
    backgroundColor: '#f5f5fa',
    paddingHorizontal: width*0.08,
    paddingVertical: 10,
    borderRadius: 5,
  },

  firstRowCol: {
    alignItems: 'center',
  },

  line_rows: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  secondRowBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf:'center',
    width: width*0.91,
    // backgroundColor: '#ececec',
  },

  secondRowBox_1: {
    backgroundColor: '#f5f5fa',
    width: width*0.45,
    height: 144,
    paddingHorizontal: width*0.02,
    paddingVertical: 7,
    paddingRight: width*0.025,
    borderRadius: 5,
    justifyContent: 'space-between',
    paddingBottom: 13,
    
    
  },
  secondRowBox_2: {
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },

  secondRowBox_2a: {
    backgroundColor: '#f5f5fa',
    width: width*0.442,
    height: 42,
    paddingHorizontal: width*0.02,
    paddingVertical: 5,
    paddingRight: width*0.02,
    borderRadius: 5,
    justifyContent: 'space-between',

  },
  secondRowBox_2b: {
    backgroundColor: '#f5f5fa',
    width: width*0.442,
    height: 94,
    paddingHorizontal: width*0.02,
    paddingVertical: 7,
    paddingRight: width*0.02,
    borderRadius: 5,
    justifyContent: 'space-between',
    paddingBottom: 10,
  },

  buttons_row: {
    flexDirection: 'row',
    alignSelf:'center',
    width: width*.912,
    justifyContent: 'space-between',
    // paddingHorizontal: width*0.05,
  },

  buttonInRow:{
    
    marginTop: 7,
    width: width*0.29,
    height: 27,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },

  whiteBox: {
    height: 100,
  },
  upDownIcon: {
    width: 15,
    height: 15,
  },
  vDown: {
    width: 8,
    height: 8,
    alignSelf: 'center',
    marginLeft: 4,
  },
});

export default PortfolioComponent;
