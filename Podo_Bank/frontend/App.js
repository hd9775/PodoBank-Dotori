import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging'
import { Provider, useDispatch, useSelector } from "react-redux"; // react-redux에서 Provider 가져오기
import store from "./src/redux/store"; // Redux 스토어 가져오기
import AccessTokenRefreshModalScreen from "./src/screens/Modal/AccessTokenRefreshModalScreen";
// import { setAccessTokenExpiration } from '../../redux/slices/auth/user'

import { StyleSheet, Text, View, Alert } from "react-native";
import {
  setAccessTokenExpiration,
  setUserTokenRefreshModalVisible,
  setIsnotReissuanceToken,
} from "./src/redux/slices/auth/user";

// import messaging from "@react-native-firebase/messaging";

// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   console.log("[Background Remote Message]", remoteMessage);
// });

// import { useNotifications } from "./src/hooks/useNotifications";

function MainApp() {
  const accessTokenExpiration = useSelector(
    (state) => state.user.accessTokenExpiration
  );
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const accessToken = useSelector((state) => state.user.accessToken);

  const dispatch = useDispatch();

  // accessToken 카운트다운
  useEffect(() => {
    if (accessTokenExpiration > 0) {
      const timerId = setInterval(() => {
        dispatch(setAccessTokenExpiration(accessTokenExpiration - 1));
      }, 1000);
      return () => clearInterval(timerId);
    }
    if (accessTokenExpiration === 0 && refreshToken) {
      dispatch(setUserTokenRefreshModalVisible(true));
    }
  }, [accessTokenExpiration, accessToken]);

  return (
    <>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
