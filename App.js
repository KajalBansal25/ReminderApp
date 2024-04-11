import {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';
import {SafeAreaView, StyleSheet} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AddReminderScreen} from './src/components/screens/AddReminderScreen';
import HomeScreen from './src/components/screens/HomeScreen';
import {checkForNotificationPermission} from './src/utils';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    const createNotificationChannel = () => {
      PushNotification.createChannel(
        {
          channelId: 'reminder-channel',
          channelName: 'Reminders',
          channelDescription: 'Channel for reminders',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        created => console.log(`createChannel returned '${created}'`),
      );
    };

    createNotificationChannel();
  }, []);
  useEffect(() => {
    PushNotification.getChannels(channel_ids =>
      console.log('channel_ids===', channel_ids),
    );
    async function checkPermissions() {
      const res = await checkForNotificationPermission();
      // console.log('🚀 ~ checkPermissions ~ res:', res);
      if (!res) {
        //do something
      }
    }
    checkPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddReminder" component={AddReminderScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {flex: 1},
});

export default App;
