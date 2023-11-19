import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';

export function useNotifications() {
  useEffect(() => {
    // 포그라운드 상태에서 알림을 받을 때
    const onMessageUnsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground FCM message received:', remoteMessage);
    });

    // 백그라운드 및 종료 상태에서 알림을 받을 때
    const onBackgroundMessageUnsubscribe = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log('Background FCM message received:', remoteMessage);
      }
    );

    return () => {
      onMessageUnsubscribe();
      // setBackgroundMessageHandler에 대한 unsubscribe는 없으므로,
      // 백그라운드 리스너를 제거하는 것에 대한 명시적인 방법은 없습니다.
    };
  }, []);
}