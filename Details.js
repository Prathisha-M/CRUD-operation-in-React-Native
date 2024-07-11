import React, { useState, useRef } from 'react';
import { View, Text, StatusBar, StyleSheet, Button, TextInput, Platform, ScrollView, Animated, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <Icon name={icon} size={20} color={'#4F5656'} />
    </View>
  );
};

const Details = ({ navigation }) => {
  const [Name, setName] = useState('');
  const [Phone, setPhone] = useState('');
  const [EmailId, setEmailId] = useState('');
  const [Dept, setDept] = useState('');

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deptError, setDeptError] = useState('');

  const validateName = (name) => {
    setName(name);
    if (!name) {
      setNameError('Name is required');
    } else {
      setNameError('');
    }
  };

  const validatePhone = (phone) => {
    setPhone(phone);
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) {
      setPhoneError('Phone number is required');
    } else if (!phoneRegex.test(phone)) {
      setPhoneError('Phone number must be 10 digits');
    } else {
      setPhoneError('');
    }
  };

  const validateEmailId = (email) => {
    setEmailId(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email ID is required');
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validateDept = (dept) => {
    setDept(dept);
    if (!dept) {
      setDeptError('Department is required');
    } else {
      setDeptError('');
    }
  };

  const handleRegister = async () => {
    validateName(Name);
    validatePhone(Phone);
    validateEmailId(EmailId);
    validateDept(Dept);

    if (!Name || !Phone || !EmailId || !Dept || nameError || phoneError || emailError || deptError) {
      return;
    }

    const dataToSend = {
      Name,
      Phone,
      EmailId,
      Dept,
    };

    try {
      const response = await fetch('http://192.168.29.45:3000/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setName('');
        setPhone('');
        setEmailId('');
        setDept('');
        Alert.alert("Submitted","Student Registered Successfully!")
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Failed to submit data', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={bg}
      style={styles.backgroundImage}>
      <Text style={styles.title}>REGISTRATION FORM</Text>
      <View style={styles.form}>
        <FloatingLabelInput
          label="Name"
          value={Name}
          onChangeText={validateName}
          icon="user"
          error={nameError}
        />
        {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

        {/* <View style={styles.box} /> */}

        <FloatingLabelInput
          label="Phone Number"
          value={Phone}
          onChangeText={validatePhone}
          keyboardType="phone-pad"
          icon="phone"
          error={phoneError}
        />
        {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}

        {/* <View style={styles.box} /> */}

        <FloatingLabelInput
          label="Email ID"
          value={EmailId}
          onChangeText={validateEmailId}
          keyboardType="email-address"
          icon="envelope-o"
          error={emailError}
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        {/* <View style={styles.box} /> */}

        <FloatingLabelInput
          label="Department"
          value={Dept}
          onChangeText={validateDept}
          icon="book"
          error={deptError}
        />
        {deptError ? <Text style={styles.error}>{deptError}</Text> : null}

        {/* <View style={styles.box} /> */}

        <View style={styles.fixToText}>
          <Button
            title='Register'
            color='#4F5656'
            onPress={handleRegister}
          />
          {/* <View style={styles.box} /> */}
          <Button
        title='View'
        color='#4F5656'
        onPress={() => navigation.navigate('Profile')}
        />
          {/* <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Icon name="eye" size={25} color="#4F5656" />
          </TouchableOpacity> */}
        </View>
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    justifyContent: 'center',
    // backgroundColor: '#0DACB8',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backgroundImage: {
    flex: 1,
    height: 800,
    width: 412,
    resizeMode: 'stretch', // or 'stretch' or 'cover'
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    // backgroundColor: '#E0EDF1',
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
  input: {
    flex: 1,
    padding: 0,
    // borderColor: 'black',
    // borderColor: 'black',
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius:20,
    alignItems: 'center',
  
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4F5656',
  },
  // box: {
  //   height: 10,
  // },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Details;





// import Icon from 'react-native-vector-icons/FontAwesome';

// import Icon from 'react-native-vector-icons/AntDesign';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// <Icon name="phone" size={20}/>
        {/* <Image 
        style={styles.img}
        source={require('./assets/Phone.png')}/> */}