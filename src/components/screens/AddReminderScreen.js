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
  const [isFocused, setIsFocused] = useState(false);
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

      time.setHours(time.getHours());
      time.setMinutes(time.getMinutes());
      time.setSeconds(0);
      time.setMilliseconds(0);

      PushNotification.localNotificationSchedule({
        channelId: 'reminder-channel',
        title: 'Reminder',
        message: reminderName,
        date: time,
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
        <View
          style={[
            styles.textInputView,
            isFocused && styles.inputContainerFocused,
          ]}>
          <TextInput
            onChangeText={setReminderName}
            value={reminderName}
            placeholder="Reminder name"
            style={styles.text}
            placeholderTextColor="grey"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
        <TouchableOpacity onPress={showTimePickerModal} style={styles.btn}>
          <Text style={styles.btnText}>{`${time
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
  textInputView: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  inputContainerFocused: {
    borderColor: '#007AFF',
  },
  btn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: {height: 2, width: 0},
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
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
