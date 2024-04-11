import {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {FAB} from 'react-native-paper';

import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {PlusIcon} from '../../images/svgs';

const HomeScreen = () => {
  const [list, setList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadList = async () => {
      try {
        const existingList = await AsyncStorage.getItem('list');
        const existingListArr = existingList ? JSON.parse(existingList) : [];
        setList(existingListArr);
      } catch (e) {
        // console.log('error loading list', e);
      }
    };

    loadList();
  }, []);

  const renderItem = ({item}) => {
    const {title, reminder, id} = item || {};
    return (
      <View key={id} style={styles.itemView}>
        <Text style={styles.text}>{title}</Text>
        <Text style={styles.text}>{reminder}</Text>
      </View>
    );
  };

  const addListItem = async item => {
    try {
      const existingList = await AsyncStorage.getItem('list');
      const existingListArr = existingList ? JSON.parse(existingList) : [];
      const updatedList = [...existingListArr, item];
      await AsyncStorage.setItem('list', JSON.stringify(updatedList));
      setList(updatedList);
    } catch (e) {
      // console.log('error>>>>>>', e);
    }
  };

  const handleNavigate = () => {
    navigation.navigate('AddReminder', {addListItem});
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          renderItem={renderItem}
          data={list}
          keyExtractor={item => item.id}
        />
      </View>
      <FAB
        icon={() => <PlusIcon />}
        style={styles.fab}
        onPress={handleNavigate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, margin: 12},
  listContainer: {flex: 1, marginTop: 12},
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: {height: 2, width: 0},
    elevation: 3,
  },
  text: {color: 'black'},
});

export default HomeScreen;
