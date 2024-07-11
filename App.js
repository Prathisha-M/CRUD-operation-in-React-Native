import * as React from 'react';
import { StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import Details from './Details';
import Profile from './Profile';
import Update from './Update';
import DetailsView from './DetailsView';

const Stack = createNativeStackNavigator();

const App = () => {
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Details"
          component={Details}
          options={{ 
            title: 'Welcome Students',
            headerStyle: { backgroundColor: '#cfe7ff' }
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          initialParams={{ searchQuery }}
          options={({ navigation }) => ({
            title: 'Profile',
            headerStyle: { backgroundColor: '#98c0e4' },
            headerRight: () => (
              <View style={styles.headerRight}>
                {searchVisible && (
                  <TextInput
                    style={styles.searchBox}
                    placeholder="Search by Name or ID"
                    value={searchQuery}
                    onChangeText={(query) => {
                      setSearchQuery(query);
                      navigation.setParams({ searchQuery: query });
                    }}
                  />
                )}
                <TouchableOpacity onPress={toggleSearch} style={styles.searchIcon}>
                  <Icon name="search" size={20} color="black" />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="Update"
          component={Update}
          options={{ 
            title: 'Update Details',
            headerStyle: { backgroundColor: '#cfe7ff' }
          }}
        />
        <Stack.Screen
          name="DetailsView"
          component={DetailsView}
          options={{ 
            title: 'View Details',
            headerStyle: { backgroundColor: '#cfe7ff' }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 10,
    color: 'black',
  },
  searchBox: {
    width: 150,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    color: 'black',
    marginRight: 10,
  },
});

export default App;
