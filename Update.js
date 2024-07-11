import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ImageBackground, Animated, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import bg from './assets/bg.jpg';

const FloatingLabelInput = ({ label, value, onChangeText, placeholder, keyboardType, icon, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value === '' ? 0 : 1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedIsFocused, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start(); 
  };

  const handleBlur = () => {
    if (value === '') {
      setIsFocused(false);
      Animated.timing(animatedIsFocused, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    position: 'absolute',
    left: 15,
    backgroundColor: '#cfe7ff',
    borderRadius: 10,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#000', '#000'],
    }),
  };

  return (
    <View style={[styles.inputContainer, error && { borderColor: 'red' }]}>
      <Animated.Text style={labelStyle}>
        {label}
      </Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={isFocused ? '' : placeholder}
        keyboardType={keyboardType}
      />
      {/* <Icon name={icon} size={20} /> */}
    </View>
  );
};

const Update = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [item, setItem] = useState({
    ...route.params.item,
    id: route.params.item.id,
    Name: route.params.item.Name.trim(),
    Phone: route.params.item.Phone.trim(),
    EmailId: route.params.item.EmailId.trim(),
    Dept: route.params.item.Dept.trim()
  });
  console.log("datatoUpdate------------",item)
  console.log("id-----",item.id)

  const handleUpdate = async () => {
    const dataToUpdate = {
      Name: item.Name.trim(),
      Phone: item.Phone.trim(),
      EmailId: item.EmailId.trim(),
      Dept: item.Dept.trim(),
    };

    try {
      const response = await fetch(`http://192.168.29.45:3000/update/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (response.ok) {
        Alert.alert('Success', 'Student updated successfully!');
        navigation.navigate('Profile');
        
      } else {
        Alert.alert('Error', 'Failed to update student.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.backgroundImage}>
        <Text style={styles.title}>UPDATE FORM</Text>
        <View style={styles.form}>
          <FloatingLabelInput
            label="Name"
            value={item.Name}
            onChangeText={(value) => setItem({ ...item, Name: value.trim() })}
            // icon="user"
          />
          <FloatingLabelInput
            label="Phone Number"
            value={item.Phone}
            onChangeText={(value) => setItem({ ...item, Phone: value.trim() })}
            keyboardType="phone-pad"
            // icon="phone"
          />
          <FloatingLabelInput
            label="Email ID"
            value={item.EmailId}
            onChangeText={(value) => setItem({ ...item, EmailId: value.trim() })}
            keyboardType="email-address"
            // icon="envelope-o"
          />
          <FloatingLabelInput
            label="Department"
            value={item.Dept}
            onChangeText={(value) => setItem({ ...item, Dept: value.trim() })}
            // icon="book"
          />
          <View style={styles.fixToText}>
          <Button 
          title='Update' 
          color='#4F5656'
          onPress={handleUpdate} />
          {/* <View style={styles.box} /> */}
          <Button 
          title='View' 
          color='#4F5656' 
          onPress={() => navigation.navigate('Profile')} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    height: 800,
    width: 412,
    resizeMode: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    paddingVertical: 50,
    paddingHorizontal: 40,
    width: '100%',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#666',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4F5656',
  },
  inputContainer: {
    height: 55,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 0.9,
    marginBottom: 10,
    position: 'relative',
    borderColor: 'black',
  },
  // box: {
  //   height: 10,
  // },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius:20,
    alignItems: 'center',
  
  },
});

export default Update;
