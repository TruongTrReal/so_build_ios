import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
const { height,width } = Dimensions.get('window');

const MenuOption = ({ iconName, label }) => {
  return (
    <TouchableOpacity style={styles.menuOption}>
      <Image source={iconName} style={styles.iconStyle} />
      <Text style={styles.labelStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

const MenuBar = () => {
  // Assuming you have the icons in your assets directory
  const menuOptions = [
    { iconName: require('../assets/naptien.jpg'), label: 'Nạp tiền' },
    { iconName: require('../assets/link_button.jpg'), label: 'Liên kết tài sản' },
    { iconName: require('../assets/book_button.jpg'), label: 'Sổ lệnh' },
    { iconName: require('../assets/setting_button.jpg'), label: 'Cài đặt' },
  ];

  return (
    <View style={styles.menuBar}>
      {menuOptions.map((option, index) => (
        <MenuOption key={index} iconName={option.iconName} label={option.label} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menuBar: {
    height: 95,
    flexDirection: 'row',
    justifyContent: 'space-around', // This will distribute the buttons evenly across the width of the screen
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#fff', // Or any other background color
  },
  menuOption: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    position: "absolute",
    top: 0,
    width: 40, // Set the width and height of the icons
    height: 40,
  },
  labelStyle: {
    position: "absolute",
    top: 45.5,
    fontSize: 12, // Set the font size of the label
    textAlign: 'center', // Center the label text below the icon
    fontWeight: '400',
    fontSize: 12
  },
  // Add any additional styling you may need
});

export default MenuBar;
