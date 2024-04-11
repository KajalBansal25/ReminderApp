import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

const notification_permission =
  Platform.OS === 'android' ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS : null;

const checkForNotificationPermission = async () => {
  if (Platform.OS === 'android' && DeviceInfo.getSystemVersion() > 12) {
    const result = await checkPermission(notification_permission);
    return result;
  }
  return 'granted';
};

const askForPermission = permission => {
  return new Promise((resolve, reject) => {
    request(permission)
      .then(res => {
        if (res == 'granted') {
          resolve(true);
        } else {
          reject(false);
        }
      })
      .catch(err => {
        // console.log('err>>>', err);
        reject(err);
      });
  });
};

const checkPermission = async permission => {
  let answer;
  return check(permission)
    .then(async res => {
      switch (res) {
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          return true;

        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          alert(
            'This feature is currently not available (on this device / in this context)',
          );
          return false;

        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          answer = await askForPermission(permission);
          return answer;

        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          return true;

        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          answer = await askForPermission(permission);
          return answer;
      }
    })
    .catch(err => {
      console.log('<<< Error In Check Permession >>>', err);
    });
};

export {
  checkForNotificationPermission,
  notification_permission,
  askForPermission,
};
