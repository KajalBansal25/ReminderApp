import React, {useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import uuid from 'react-native-uuid';
import PushNotification from 'react-native-push-notification';

import DateTimePicker from '@react-native-community/datetimepicker';

export const AddReminderScreen = ({navigation, route}) => {
  const [reminderName, setReminderName] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const {addListItem = () => {}} = route.params;

  const addNewItemHandler = async () => {
    try {
      const timeString = `${time.getHours().toString().padStart(2, '0')}:${time
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      const newItem = {
        id: uuid.v4(),
        title: reminderName,
        reminder: timeString,
      };
      addListItem(newItem);

      const notificationTime = new Date();
      notificationTime.setHours(time.getHours());
      notificationTime.setMinutes(time.getMinutes());
      notificationTime.setSeconds(0);
      notificationTime.setMilliseconds(0);

      PushNotification.localNotificationSchedule({
        channelId: 'reminder-channel',
        title: 'Reminder',
        message: reminderName,
        date: notificationTime,
        allowWhileIdle: true,
        vibrate: true,
        soundName: 'default',
      });

      navigation.goBack();
    } catch (e) {
      console.log('errr>>>>', e);
    }
  };

  const isItemEmpty = !reminderName;

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  return (
    <View style={styles.container}>
      <View style={styles.addItemContainer}>
        <View style={styles.textInputView}>
          <TextInput
            onChangeText={setReminderName}
            value={reminderName}
            placeholder="Reminder name"
            style={styles.text}
          />
        </View>
        <TouchableOpacity onPress={showTimePickerModal} style={styles.btn}>
          <Text style={styles.text}>{`${time
            .getHours()
            .toString()
            .padStart(2, '0')}:${time
            .getMinutes()
            .toString()
            .padStart(2, '0')}`}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
            style={styles.text}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={addNewItemHandler}
        disabled={isItemEmpty}
        style={[
          styles.addNewItemBtn,
          isItemEmpty ? styles.isItemEmptyStyle : styles.isItemNotEmptyStyle,
        ]}>
        <Text style={styles.addNewItemBtnTxt}>Add new item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, margin: 12, marginTop: 16},
  addItemContainer: {flex: 1, gap: 16},
  textInputView: {borderWidth: 1, borderRadius: 12},
  btn: {borderWidth: 1, borderRadius: 12, padding: 12},
  text: {color: 'black'},
  addNewItemBtn: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  addNewItemBtnTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  isItemEmptyStyle: {backgroundColor: 'grey'},
  isItemNotEmptyStyle: {backgroundColor: 'green'},
});
