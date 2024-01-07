import React, { useRef, useState } from 'react';
import { StyleSheet, View, Animated, PanResponder, Dimensions, ScrollView, Text, Image } from 'react-native';
import IndexList from './IndexList';
import FinancialSummary from './FinancialSummary';
import MenuBar from './MenuBar';
import PortfolioComponent from './PortfolioComponent';
import PortfolioSummary from './PortfolioSummary';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../redux/actions';

const { height,width } = Dimensions.get('window');
let dragupHeight = -312;

const AppBody = () => {
  // const useState
  const [isDraggingDown, setIsDraggingDown] = useState(false);
  const [isDraggedUp, setIsDraggedUp] = useState(true);
  const [isSrollable, setScrollable] = useState(false);
  const [isSrolledUp, setSrolledUp] = useState(true);
  const [top_comps_height, setTop_comps_height] = useState(height);

  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.activeTab);

  if (activeTab === '3') {
    dragupHeight = -358;
  } else {
    dragupHeight = -312;
  }

  console.log('Active Tab on AppBody: ', activeTab);

  // Dragging animation
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = PanResponder.create({

    onStartShouldSetPanResponder: (event, gestureState) => {
      const locationY = event.nativeEvent.pageY;

      const isTouchWithinHeader = locationY <= top_comps_height;
      const isTouchWithinScrollView = locationY > top_comps_height;
      
      return isTouchWithinHeader;
    },

    onMoveShouldSetPanResponder: (event, gestureState) => {
      const locationY = event.nativeEvent.pageY;
  
      const isTouchWithinHeader = locationY <= top_comps_height;
      const isTouchWithinScrollView = locationY > top_comps_height;
  
      // console.log(
      //   isTouchWithinHeader ? 'Dragging Text or PortfolioSummary' : isTouchWithinScrollView ? 'Dragging ScrollView' : 'Dragging Content'
      // );
      return isTouchWithinHeader;
    },

    onPanResponderMove: (_, gestureState) => {
      const velocityFactor = 0.2;
      const newY = pan.y._value + gestureState.dy * velocityFactor;
  
      if (newY >= 0) {
        setScrollable(false);
  
        if (newY === 0) {
          setIsDraggingDown(false);
        } else {
          setIsDraggingDown(true);
        }
        pan.setValue({ x: 0, y: newY });
      }
    },

    onPanResponderRelease: () => {

      setScrollable(true);
      // if user dragging down when the comp is up
      if (isDraggingDown && isSrolledUp) {
        Animated.timing(pan, {
          toValue: { x: 0, y: 0 },
          duration: 350,
          useNativeDriver: false,
        }).start(() => {
          setIsDraggingDown(false);
          setScrollable(false);
          setTop_comps_height(height);
          setIsDraggedUp(false);
        });
      } else {
        Animated.timing(pan, {
          toValue: { x: 0, y: dragupHeight },
          duration: 350,
          useNativeDriver: false,
        }).start(() => {
          setIsDraggingDown(true);
          setScrollable(true);
          setTop_comps_height(height*0.6);
          setIsDraggedUp(true);
        });
      }
    },
  });
  
  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;

    // Check if the scroll position is at the top
    if (currentOffset === 0) {
      // console.log('scrolled up');
      setSrolledUp(true);
    } else {
      // console.log('scrolling down');
      setSrolledUp(false);
    }
  };

  const style_of_glowingLine = isDraggedUp ? {} : {    

  }

  return (
    <View style={styles.container}>

      {/* Nonchanging comps, fixed position */}
      <View>
        <IndexList />
        <FinancialSummary />
        <MenuBar />
        <View style={styles.grayBackgr} />
      </View>
      {/* <View style={{
        height: 0.1,
        width: width,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      }}></View> */}
      {/* Comp that react on user sroll behavior */}

      <Animated.View
        {...(isSrolledUp ? panResponder.panHandlers : {})}
        style={[
          styles.draggable,
          { transform: pan.getTranslateTransform()},
          style_of_glowingLine
          
        ]}
        elevation={5}
      >

        <View style={styles.placeHolderBox}>
          <View style={styles.placeHolder}></View>
        </View>

        <ScrollView 
          style={styles.draggableContent}
          scrollEnabled={isSrollable}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.portfolioHeader}>
            <Text style={styles.textDMNG}>Danh mục nắm giữ</Text>
          </View>
          <PortfolioSummary />
          <PortfolioComponent />
        </ScrollView>

      </Animated.View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    zIndex: 10,
    height: height*0.72,
  },
  grayBackgr: {
    height: height*0.015,
    backgroundColor:'#f4f5f9',
  },
  draggable: {
    width: width,
    elevation: 6,
  },
  placeHolderBox: {
    width: width,
    height: 32,
    backgroundColor: '#fff',
    alignItems: "center",
  },
  placeHolder: {
    width: width*0.125,
    height: 6,
    backgroundColor: "#c4c4cf",
    borderRadius: 8,
    position: 'absolute',
    top: width*0.03,
  },
  draggableContent: {
    backgroundColor: '#fff',
    width: '100%',
  },
  textDMNG: {
    fontSize: 17,
    fontWeight: '500',
    
  },
  portfolioHeader: {
    // marginBottom: 15,
    marginLeft: width*0.04,
    marginTop: -3,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AppBody;
