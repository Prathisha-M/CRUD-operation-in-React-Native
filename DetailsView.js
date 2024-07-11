import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import bg from './assets/bg.jpg';

const DetailsView = () => {
  const route = useRoute();
  const { id } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.29.45:3000/view/${id}`);
        if (response.ok) {
          const result = await response.json();
          setItem(result);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No details available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={bg} style={styles.backgroundImage}>
        <Text style={styles.title}>Details</Text>
        <View style={styles.detailsContainer}>
          <LabelValuePair label="Name" value={item.Name} />
          <LabelValuePair label="Email" value={item.EmailId} />
          <LabelValuePair label="Phone" value={item.Phone} />
          <LabelValuePair label="Department" value={item.Dept} />
        </View>
        
      </ImageBackground>
    </SafeAreaView>
  );
};

const LabelValuePair = ({ label, value }) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: 'white',
    // padding: 30,
    paddingHorizontal: 50,
    paddingVertical: 30,
    borderRadius: 10,
    maxWidth: '80%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
  },
  value: {
    fontSize: 18,
    color: 'black',
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default DetailsView;

