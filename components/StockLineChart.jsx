import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { AreaChart, Path } from 'react-native-svg-charts';

const { height, width } = Dimensions.get('window');

const StockLineChart = ({ indexName, onExportChange }) => {
  let COLOR = '#ce5a63';

  // Use a ref to store the onExportChange function
  const onExportChangeRef = useRef();
  onExportChangeRef.current = onExportChange;

  const [stockData, setStockData] = useState([]);
  const [chartColor, setChartColor] = useState('#ce5a63');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      console.log('calling API');
      try {
        const response = await fetch(
          `https://magnetic-eminent-bass.ngrok-free.app/stockapi?data_type=index&stock_name=${indexName}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const closePrices = data.map(item => item.close);

          setStockData(closePrices);

          if (onExportChange && typeof onExportChange === 'function') {
            // Calculate change and percentage change
            if (closePrices.length > 1) {
              const CHANGE = (closePrices[closePrices.length - 1] - closePrices[0]) / 1000;
              const CHANGE_PERCENT = ((CHANGE / Math.abs(closePrices[0])) * 100000).toFixed(2);
              const CLOSE_PRICE = (closePrices[closePrices.length - 1] / 1000).toFixed(2);

              let COLOR;
              if (CHANGE < 0) {
                COLOR = '#ce5a63';
                setChartColor('#ce5a63');
              } else if (CHANGE > 0) {
                COLOR = '#00ab56';
                setChartColor('#00ab56');
              } else {
                COLOR = '#F7CE46';
                setChartColor('#F7CE46');
              }

              onExportChangeRef.current({ CHANGE, CHANGE_PERCENT, CLOSE_PRICE, COLOR });
            }
          }
        } else {
          console.error('Invalid stock data format:', data);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStockData();
    const intervalId = setInterval(() => {
      fetchStockData();
    }, 15000); // 10 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);

    // Only run the effect when indexName changes
  }, [indexName]);

  // Add indexName and onExportChange as dependencies

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  const Line = ({ line }) => (
    <>
      {/* Main Line */}
      <Path key={'line'} d={line} stroke={chartColor} strokeWidth={1.5} fill="none" />

      {/* Shadow Line */}
      <Path key={'line-shadow'} d={line} stroke={'rgba(0, 0, 0, 0.06)'} strokeWidth={3} fill="none" transform={`translate(0, 2)`} />
    </>
  );

  return (
    <View style={styles.container}>
      <AreaChart
        style={{
          height: 10,
          width: 53,
          marginLeft: 2,
        }}
        data={stockData}
        svg={{
          // fill: chartColor,
          // fillOpacity: 0.1,
          // fillRule: 'nonzero',
          // I want this line to have its shadow, not fill
        }}
        contentInset={{ top: 2, bottom: 2, left: 3, right: 3 }}
      >
        <Line />
      </AreaChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StockLineChart;
