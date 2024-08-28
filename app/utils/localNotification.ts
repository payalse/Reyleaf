import notifee from '@notifee/react-native';
type Props = {
  title: string;
  body: string;
};
export const LocalNotification = async ({title, body}: Props) => {
  try {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    });
  } catch (error) {
    console.log('ERROR in LocalNotification ==>', error);
  }
};
