import {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {FAB} from 'react-native-paper';

import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <FAB icon="plus" style={styles.fab} onPress={handleNavigate} />
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
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  text: {color: 'black'},
});

export default HomeScreen;
