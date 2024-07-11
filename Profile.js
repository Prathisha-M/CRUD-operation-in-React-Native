import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { searchQuery } = route.params || {};
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (searchQuery) {
      const filtered = data.filter(item =>
        item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toString().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.29.45:3000/profile");
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } else {
        Alert.alert('Error', 'Failed to fetch profile data')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile data');
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await fetch(`http://192.168.29.45:3000/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        Alert.alert('Success', 'Record Deleted Successfully!');
        fetchData();
      } else {
        Alert.alert('Error', 'Failed to delete student');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete student');
      console.error("Error deleting student:", error);
    }
  };

  const confirmDelete = (id, name) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete the student record for ${name}?`,
      [
        { text: "NO", style: "cancel" },
        { text: "YES", onPress: () => deleteStudent(id) }
      ],
      { cancelable: false }
    );
  };

  const handleUpdate = async (id, item) => {
    navigation.navigate('Update', { id, item });
  };
  const handleView = async (id,item) => {
    navigation.navigate('DetailsView', {id, item});
  };

  const toggleOptions = (id) => {
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  const renderItem = ({ item, index }) => {
    const isSelected = selectedItemId === item.id;
    const itemBackgroundColor = index % 2 === 0 ? '#cfe7ff' : '#EAF2FF';
    // const itemColor = index % 2 === 0 ? '#98c0e4' : '#cfe7ff';

    return (
      <View style={[styles.listItem, { backgroundColor: itemBackgroundColor }]}>
        <View style={styles.itemContainer}>
          <Text style={[styles.itemText, { fontWeight: 'bold' }]}>ID: {item.id}</Text>
          <TouchableOpacity 
         style={styles.threedotIcon}
          onPress={() => toggleOptions(item.id)}>
            <Icon name="ellipsis-v" size={20} color="#000"/>
          </TouchableOpacity>
        </View>
        {isSelected && (
          <View style={styles.floatComponent}>
            <TouchableOpacity 
            style={styles.iconWrapper}
            onPress={() => handleUpdate(item.id, item)}>
              <View style={styles.option}>
                <Icon name="edit" size={20} color="#000"/>
                <Text style={styles.optionText}>Edit</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.iconWrapper}
            onPress={() => confirmDelete(item.id, item.Name)}>
              <View style={styles.option}>
                <Icon name="trash" size={20} color="#000"/>
                <Text style={styles.optionText}>Delete</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.iconWrapper}
            onPress={() => handleView(item.id, item.Name)}>
              <View style={styles.option}>
                <Icon name="eye" size={20} color="#000"/>
                <Text style={styles.optionText}>View</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.textin}>
          <LabelValuePair label="Name" value={item.Name} />
          {/* <LabelValuePair label="Phone Number" value={item.Phone} /> */}
          <LabelValuePair label="Email ID" value={item.EmailId} />
          {/* <LabelValuePair label="Department" value={item.Dept} /> */}
        </View>
      </View>
    );
  };

  const LabelValuePair = ({ label, value }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}: </Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No profile data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#cfe7ff',
    position: 'relative',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  listItem: {
    // backgroundColor: '#cfe7ff',
    elevation: 5,
    borderRadius: 12,
    marginVertical: 10,
    zIndex: 1,
  },
  threedotIcon: {
    borderRadius: 50,
    backgroundColor: 'transparent',
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 6,
    paddingBottom: 6,
  },
  iconWrapper: {
    // padding: 10,                 
    borderRadius: 20,            
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    backgroundColor: '#98c0e4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    zIndex: 1,
  },
  textin: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  floatComponent: {
    position: 'absolute',
    top: 35,
    right: 35,
    backgroundColor: '#98c0e4',
    borderRadius: 5,
    elevation: 5,
    padding: 5,
    zIndex: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    zIndex: 1,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#000',
  },
  label: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
});

export default Profile;
