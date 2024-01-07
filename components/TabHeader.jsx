import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet, Dimensions, Animated, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../redux/actions';
import Modify from './Modify';

const { width, height } = Dimensions.get('window');

const TabHeader = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.activeTab);
  const accountNumber = useSelector((state) => state.accountNumber);
  const [hiddenModify, setHiddenModify] = useState(true);

  // const [activeTab, setActiveTab] = useState('1');
  const redLine = useRef(new Animated.Value(0)).current;

  const DoublePressTouchableOpacity = ({ onDoublePress, ...props }) => {
    let lastPress = 0;
  
    const handlePress = () => {
      const currentTime = new Date().getTime();
      const delta = currentTime - lastPress;
  
      if (delta < 300) {
        // Double press detected
        if (onDoublePress && typeof onDoublePress === 'function') {
          onDoublePress();
        }
      }
  
      lastPress = currentTime;
    };
  
    return (
      <TouchableOpacity {...props} onPress={handlePress}>
        {props.children}
      </TouchableOpacity>
    );
  };

  const handlePress = (tab) => {
    const tabIndex = ['1', '3', '6'].indexOf(tab);
    const newLinePosition = (width / 3) * tabIndex;

    // Animate the red line to the new position
    Animated.timing(redLine, {
      toValue: newLinePosition,
      duration: 300, // Adjust the duration as needed
      useNativeDriver: false, // Make sure to set useNativeDriver to false for layout animations
    }).start();

    // Dispatch the setActiveTab action to update the Redux store
    dispatch(setActiveTab(tab));
  };

  const handle2Press = () => {
    setHiddenModify((prevHidden) => !prevHidden);
  };

  return (
    <View style={styles.container}>
      {/* Conditionally render Modify based on hiddenModify state */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={!hiddenModify}
        onRequestClose={() => setHiddenModify(true)}
      >
        <Modify />
        <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setHiddenModify(true)}
        >
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </Modal>
      <View style={styles.topRow}>
        <Image source={require('../assets/back_icon.jpg')} style={styles.icon} />
        <View style={styles.centerContainer}>
          <DoublePressTouchableOpacity 
            onDoublePress={() => handle2Press()} 
            activeOpacity={1}
          >
            <Text style={styles.title}>Cổ phiếu</Text>
          </DoublePressTouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image source={require('../assets/manifyingglass_icon.jpg')} style={[styles.icon, { marginRight: 20 }]} />
          <Image source={require('../assets/menu_icon.jpg')} style={styles.icon} />
        </View>
      </View>

      <View style={styles.bottomRow}>
        {['1', '3', '6'].map((mark) => (
          <TabButton
            key={mark}
            label={accountNumber}
            mark={mark}
            onPress={() => handlePress(mark)}
            isActive={activeTab === mark}
          />
        ))}
        {/* Gray line */}
        <View style={styles.grayLine} />

        {/* Red sliding line */}
        <Animated.View style={[styles.redLine, { left: redLine }]} />
      </View>


    </View>
  );
};

const TabButton = ({ label, mark, onPress, isActive }) => (
  <TouchableOpacity style={styles.tab} onPress={onPress} activeOpacity={1}>
    <View style={styles.tabAllText}>
      <Text style={[styles.tabText, isActive ? styles.blackText : styles.grayText]}>{label}</Text>
      <View style={[styles.badge, isActive ? styles.activeBadge : styles.inactiveBadge]}>
        <Text style={styles.badgeText}>{mark}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 88, // Adjust the height as needed
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    width: width,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    width: width,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 12,
    marginVertical: 2,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  tabAllText: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  tabText: {
    marginTop: 1,
    fontWeight: '400',
    fontSize: 14,
  },
  badge: {
    width: 17,
    height: 17,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 1,
    fontWeight: '500',
  },
  activeBadge: {
    backgroundColor: '#a30625',
  },
  inactiveBadge: {
    backgroundColor: '#808080',
  },
  grayLine: {
    height: 0.7,
    width: width,
    backgroundColor: '#808080',
    position: 'absolute',
    bottom: 0,
    left:0,
    opacity:0.5,
  },
  redLine: {
    height: 2.5,
    width: '33.33%', // 1/3 of the width
    backgroundColor: '#a30625',
    position: 'absolute',
    bottom: 0,
  },
  grayText: {color: '#808080'},
  blackText: {color: 'black'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 10,
    borderRadius: 5,
    borderWidth: 2
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black',
  },

});

export default TabHeader;
