import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView, TextInput, Button, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setAccountNumber, setAccountSummary, setAccountPortfolio } from '../redux/actions';

const { width, height } = Dimensions.get('window');

function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
      // If the value is not an object or is null, return the value itself
      return obj;
    }
  
    if (Array.isArray(obj)) {
      // If the value is an array, create a new array and recursively deep copy its elements
      return obj.map(deepCopy);
    }
  
    // If the value is an object, create a new object and recursively deep copy its properties
    const copiedObject = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copiedObject[key] = deepCopy(obj[key]);
      }
    }
  
    return copiedObject;
  }

const Modify = () => {
    const dispatch = useDispatch();
    const accountNumber = useSelector((state) => state.accountNumber);
    const activeTab = useSelector((state) => state.activeTab);
    const summary = useSelector((state) => state.accountSummary);
    const accountPortfolio = useSelector((state) => state.accountPortfolio);

    let portfolioData = deepCopy(accountPortfolio.stocks);

    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [newSummary, setNewSummary] = useState({
        account_type: '3',
        account_number: "123456",
        total_asset: 0,
        total_cash: 0,
        margin_ratio: 0,
    });
    const [loading, setLoading] = useState(false);
    const [modifiedStocks, setModifiedStocks] = useState([]);
    const [newStockSymbol, setNewStockSymbol] = useState('');
    const [newStockAdding, setNewStockAdding] = useState({});


    console.log('modifiedStocks',modifiedStocks)

    console.log('newStockAdding',newStockAdding);

    const handleAccountNumberChange = () => {
        // Validate that the input has exactly 6 characters
        if (newAccountNumber.length === 6) {
        dispatch(setAccountNumber(newAccountNumber));
        setNewAccountNumber('');
        } else {
        // Display an alert or handle the error as needed
        console.error('Invalid account number length. Please enter exactly 6 characters.');
        }
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

    const modifyAccountSummary = async () => {
        setLoading(true);

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        let raw = {
            ...newSummary,
            account_type: activeTab,
            account_number: accountNumber
        };
        
        let jsonString = JSON.stringify(raw);    

        console.log("data that modify: ", raw);

        let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: jsonString,
        redirect: 'follow',
        };

        try {
        const response = await fetch(
            'https://magnetic-eminent-bass.ngrok-free.app/add-or-modify-summary/',
            requestOptions
        );
        const result = await response.text();
        console.log(result);

        fetchAccountSummary();
        } catch (error) {
        console.error('Error modifying account summary:', error);
        } finally {
        setLoading(false);
        }
    };

    const fetchStocksData = async () => {
        setLoading(true);
    
        try {
          const response = await fetch(`https://magnetic-eminent-bass.ngrok-free.app/stocks/${accountNumber}/${activeTab}`);
          const data = await response.json();
          console.log('fetch data from API')
          dispatch(setAccountPortfolio(data));
        //   setStocksData(data);
        } catch (error) {
          console.error('Error fetching stocks data:', error);
        } finally {
          setLoading(false);
        }
    };

    const addStock = async () => {
        setLoading(true);
      
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        console.log('portfolioData before go to add or modify', portfolioData)
      
        try {

            let symbol = newStockSymbol;
        
            let modifiedStock = newStockAdding;
        
            let raw = JSON.stringify({
                account_type: activeTab,
                account_number: accountNumber,
                stock_data: {
                stock_symbol: symbol,
                owning_price: parseInt(modifiedStock?.owning_price) || 0,
                t0_volume: parseInt(modifiedStock?.t0_volume) || 0,
                t1_volume: parseInt(modifiedStock?.t1_volume) || 0,
                t2_volume: parseInt(modifiedStock?.t2_volume) || 0,
                other_volume: parseInt(modifiedStock?.other_volume) || 0,
                having_volume: parseInt(modifiedStock?.having_volume) || 0,
                reward_volume: parseInt(modifiedStock?.reward_volume) || 0,
                FS_volume: parseInt(modifiedStock?.FS_volume) || 0,
                Outroom_volume: parseInt(modifiedStock?.Outroom_volume) || 0,                
                },
            });
        
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow',
            };

            console.log('requestOptions', requestOptions)
        
            const response = await fetch('https://magnetic-eminent-bass.ngrok-free.app/stock/', requestOptions);
            const result = await response.text();
            console.log(result);
            
          fetchStocksData();
        } catch (error) {
          console.error('Error modifying stock:', error);
        } finally {
          setLoading(false);
        }
    };

    const modifyStock = async () => {
        setLoading(true);
      
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        console.log('portfolioData before go to add or modify', portfolioData)
      
        try {
          // Loop through each stock in the portfolioData array
          for (const stockData of portfolioData) {
            let symbol = stockData.stock_symbol;
      
            let modifiedStock = modifiedStocks[symbol];
      
            let raw = JSON.stringify({
              account_type: activeTab,
              account_number: accountNumber,
              stock_data: {
                stock_symbol: symbol,
                owning_price: parseInt(modifiedStock?.owning_price) || parseInt(stockData.owning_price) || 0,
                t0_volume: parseInt(modifiedStock?.t0_volume) || parseInt(stockData.t0_volume) || 0,
                t1_volume: parseInt(modifiedStock?.t1_volume) || parseInt(stockData.t1_volume) || 0,
                t2_volume: parseInt(modifiedStock?.t2_volume) || parseInt(stockData.t2_volume) || 0,
                other_volume: parseInt(modifiedStock?.other_volume) || parseInt(stockData.other_volume) || 0,
                having_volume: parseInt(modifiedStock?.having_volume) || parseInt(stockData.having_volume) || 0,
                reward_volume: parseInt(modifiedStock?.reward_volume) || parseInt(stockData.reward_volume) || 0,
                FS_volume: parseInt(modifiedStock?.FS_volume) || parseInt(stockData.FS_volume) || 0,
                Outroom_volume: parseInt(modifiedStock?.Outroom_volume) || parseInt(stockData.Outroom_volume) || 0,                
              },
            });
      
            let requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow',
            };

            console.log('requestOptions', requestOptions)
      
            const response = await fetch('https://magnetic-eminent-bass.ngrok-free.app/stock/', requestOptions);
            const result = await response.text();
            console.log(result);
          }
          fetchStocksData();
        } catch (error) {
          console.error('Error modifying stock:', error);
        } finally {
          setLoading(false);
        }
    };
      
    const deleteStock = async (stockSymbol) => {
        try {
          const requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
          };
      
          const url = `https://magnetic-eminent-bass.ngrok-free.app/stock/${accountNumber}/${activeTab}/${stockSymbol}/`;
      
          const response = await fetch(url, requestOptions);
          const result = await response.text();
          fetchStocksData();
          console.log(result);
        } catch (error) {
          console.error('Error deleting stock:', error);
        }
    };
  


    return (
        <ScrollView style={styles.container}>
        <View style={styles.box}>
            <Text>Tài khoản: {accountNumber}</Text>
            <TextInput
                style={styles.input}
                placeholder="6 ký tự, 123456, A12345,..."
                onChangeText={(text) => setNewAccountNumber(text)}
                value={newAccountNumber}
                maxLength={6} // Set maximum length to 6 characters
            />
            <Button title="Chuyển tài khoản" onPress={handleAccountNumberChange} />
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            summary && (
            <View style={styles.box}>
                <Text>Tổng quan tài sản:</Text>
                <Text>{`Tài sản ròng: ${((summary.total_asset ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}`}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="1000000,..."
                    keyboardType="numeric"
                    onChangeText={(text) => setNewSummary((prev) => ({ ...prev, total_asset: text }))}
                    value={newSummary.total_asset}
                />
                <Text>{`Sức mua: ${((summary.total_cash ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}`}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="1000000,..."
                    keyboardType="numeric"
                    onChangeText={(text) =>  setNewSummary((prev) => ({ ...prev, total_cash: text }))}
                    value={newSummary.total_cash}
                />
                <Text>{`Tỷ lệ an toàn: ${(summary.margin_ratio ?? 0)}`} %</Text>
                <TextInput
                    style={styles.input}
                    placeholder="100,00 , 69,69 ,..."
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        // Remove non-numeric characters and replace commas with dots
                        setNewSummary((prev) => ({ ...prev, margin_ratio: text.replace(',', '.') }));
                    }}
                    value={newSummary.margin_ratio}
                />
                {/* Display other account summary details as needed */}
                <Button title="Change" onPress={modifyAccountSummary} />

            </View>
            )
        )}

        <View style={styles.box}>
        <Text>Thêm cổ phiếu:</Text>
            <View>

            {/* <Text>{`Giá TB:`}</Text> */}
            <TextInput
                style={styles.input}
                placeholder="Giá mua, hệ thống tự tính phí, vd: 15200"
                keyboardType="numeric"
                onChangeText={(text) => 
                    setNewStockAdding((prev) => ({
                        ...prev,
                        owning_price: text
                    }))
                }
            />

            {/* <Text>{`KL có:`}</Text> */}
            <TextInput
                style={styles.input}
                placeholder="KL đang sở hữu, không dùng số phẩy, vd: 5000, 100000"
                keyboardType="numeric"
                onChangeText={(text) => 
                    setNewStockAdding((prev) => ({
                        ...prev,
                        having_volume: text
                    }))
                }
                />

            {/* <Text>{`T0:`}</Text> */}
            <TextInput
                style={styles.input}
                placeholder="T0"
                keyboardType="numeric"
                onChangeText={(text) => 
                    setNewStockAdding((prev) => ({
                        ...prev,
                        t0_volume: text
                    }))
                }
                />

            {/* <Text>{`T1:`}</Text> */}
            <TextInput
                style={styles.input}
                placeholder="T1"
                keyboardType="numeric"
                onChangeText={(text) => 
                    setNewStockAdding((prev) => ({
                        ...prev,
                        t1_volume: text
                    }))
                }
                />

            {/* <Text>{`T2:`}</Text> */}
            <TextInput
                style={styles.input}
                placeholder="T2"
                keyboardType="numeric"
                onChangeText={(text) => 
                    setNewStockAdding((prev) => ({
                        ...prev,
                        t2_volume: text
                    }))
                }
                />

            {/* <Text>{`Outroom:`}</Text> */}
            <TextInput
                style={styles.input}
                placeholder="Outroom"
                keyboardType="numeric"
                onChangeText={(text) => 
                    setNewStockAdding((prev) => ({
                        ...prev,
                        Outroom_volume: text
                    }))
                }
                />

            {/* <Text>{`CP Thưởng:`}</Text> */}
            <TextInput
                style={styles.input}
                placeholder="CP thưởng"
                keyboardType="numeric"
                onChangeText={(text) => 
                    setNewStockAdding((prev) => ({
                        ...prev,
                        reward_volume: text
                    }))
                }
                />

            {/* <Text>{`KL khác:`}</Text> */}
            <TextInput
                style={styles.input}
                placeholder="Khối lượng khác"
                keyboardType="numeric"
                onChangeText={(text) => 
                    setNewStockAdding((prev) => ({
                        ...prev,
                        other_volume: text
                    }))
                }
                />

            {/* <Text>{`FS:`}</Text> */}
            <TextInput
                style={styles.input}
                placeholder="khối lượng FS"
                keyboardType="numeric"
                onChangeText={(text) => 
                    setNewStockAdding((prev) => ({
                        ...prev,
                        FS_volume: text
                    }))
                }
                />

            <Text>Mã *điền sau cùng*:</Text>
            <TextInput
                style={styles.input}
                placeholder="VCB, MBB, DXG, CEO,..."
                keyboardType="default"
                onChangeText={(text) => {
                    setModifiedStocks((prev) => ({ [text]: newStockAdding }));
                    setNewStockSymbol(text);
                }}
                maxLength={6}
            />
            <Button title="Thêm" onPress={() => addStock()} />

            </View>
        
        </View>

        {/* Display stock information */}
        {portfolioData && (
            <View style={styles.box}>
            <Text>Danh muc:</Text>

            {portfolioData.map((stock, index) => (
                <View style={styles.box} key={index}>
                <Text>{`${stock.stock_symbol}`}</Text>
                <Text>{`Giá TB: ${stock.owning_price}`}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Owning Price"
                    keyboardType="numeric"
                    onChangeText={(text) => setModifiedStocks((prev) => ({ ...prev, [stock.stock_symbol]: { ...prev[stock.stock_symbol], owning_price: text } }))}
                    value={modifiedStocks[stock.stock_symbol]?.owning_price || ''}
                    />

                <Text>{`KL có: ${stock.having_volume}`}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Owning Price"
                    keyboardType="numeric"
                    onChangeText={(text) => setModifiedStocks((prev) => ({ ...prev, [stock.stock_symbol]: { ...prev[stock.stock_symbol], having_volume: text } }))}
                    value={modifiedStocks[stock.stock_symbol]?.having_volume || ''}
                    />

                <Text>{`T0: ${stock.t0_volume}`}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Owning Price"
                    keyboardType="numeric"
                    onChangeText={(text) => setModifiedStocks((prev) => ({ ...prev, [stock.stock_symbol]: { ...prev[stock.stock_symbol], t0_volume: text } }))}
                    value={modifiedStocks[stock.stock_symbol]?.t0_volume || ''}
                    />

                <Text>{`T1: ${stock.t1_volume}`}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Owning Price"
                    keyboardType="numeric"
                    onChangeText={(text) => setModifiedStocks((prev) => ({ ...prev, [stock.stock_symbol]: { ...prev[stock.stock_symbol], t1_volume: text } }))}
                    value={modifiedStocks[stock.stock_symbol]?.t1_volume || ''}
                    />

                <Text>{`T2: ${stock.t2_volume}`}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Owning Price"
                    keyboardType="numeric"
                    onChangeText={(text) => setModifiedStocks((prev) => ({ ...prev, [stock.stock_symbol]: { ...prev[stock.stock_symbol], t2_volume: text } }))}
                    value={modifiedStocks[stock.stock_symbol]?.t2_volume || ''}
                    />

                <Text>{`Outroom: ${stock.Outroom_volume}`}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Owning Price"
                    keyboardType="numeric"
                    onChangeText={(text) => setModifiedStocks((prev) => ({ ...prev, [stock.stock_symbol]: { ...prev[stock.stock_symbol], Outroom_volume: text } }))}
                    value={modifiedStocks[stock.stock_symbol]?.Outroom_volume || ''}
                    />

                <Text>{`CP Thưởng: ${stock.reward_volume}`}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Owning Price"
                    keyboardType="numeric"
                    onChangeText={(text) => setModifiedStocks((prev) => ({ ...prev, [stock.stock_symbol]: { ...prev[stock.stock_symbol], reward_volume: text } }))}
                    value={modifiedStocks[stock.stock_symbol]?.reward_volume || ''}
                    />

                <Text>{`KL khác: ${stock.other_volume}`}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Owning Price"
                    keyboardType="numeric"
                    onChangeText={(text) => setModifiedStocks((prev) => ({ ...prev, [stock.stock_symbol]: { ...prev[stock.stock_symbol], other_volume: text } }))}
                    value={modifiedStocks[stock.stock_symbol]?.other_volume || ''}
                    />

                <Text>{`FS: ${stock.FS_volume}`}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Owning Price"
                    keyboardType="numeric"
                    onChangeText={(text) => setModifiedStocks((prev) => ({ ...prev, [stock.stock_symbol]: { ...prev[stock.stock_symbol], FS_volume: text } }))}
                    value={modifiedStocks[stock.stock_symbol]?.FS_volume || ''}
                    />

                {/* <Text>{`Tổng KL: ${stock.total_volume}`}</Text> */}

                <Button title="Change" onPress={() => modifyStock()} />
                <Button title="Sell" onPress={() => deleteStock(stock.stock_symbol)} />

                </View>
            ))}
            </View>
        )}

        <View style={{height: height*0.5}}/>
        
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: height * 0.1,
    width: width,
    marginTop: 100,
    opacity: 0.95,
    padding: 10,
    // position: 'absolute',
    // top: 0,
    // zIndex: 10,
  },
  box: {
    borderBottomWidth: 0.8,
    borderBottomColor: '#808080',
    // padding: 15,
    margin:10

  },
  input: {
    height: 40,
    borderColor: 'gray',
    // borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default Modify;


