import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import HeaderComponent from "../Header/HeaderScreen"; // 경로는 실제 HeaderComponent의 위치에 따라 변경해주세요.
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";

export default function AccountSetupScreen({ navigation }) {
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  const initialOpacity = 0;
  const [fadeAnim] = useState(new Animated.Value(initialOpacity));
  const [slideUpAnim1] = useState(new Animated.Value(50));
  const [slideUpAnim2] = useState(new Animated.Value(50));
  const [slideUpAnim3] = useState(new Animated.Value(50));
  const [slideUpAnim4] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim1, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim2, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim3, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim4, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderComponent navigation={navigation} title="계좌개설" />
      <View style={styles.contentContainer}>
        <Animated.Text
          style={{
            ...styles.textStyle,
            marginBottom: 200,
            opacity: slideUpAnim1.interpolate({
              inputRange: [0, 50],
              outputRange: [1, initialOpacity],
            }),
            transform: [{ translateY: slideUpAnim1 }],
          }}
        >
          PODO BANK 입출금 통장
        </Animated.Text>
        <Animated.Text
          style={{
            ...styles.textStyle,
            opacity: slideUpAnim2.interpolate({
              inputRange: [0, 50],
              outputRange: [1, initialOpacity],
            }),
            transform: [{ translateY: slideUpAnim2 }],
          }}
        >
          까다로운
        </Animated.Text>
        <Animated.Text
          style={{
            ...styles.textStyle,
            opacity: slideUpAnim3.interpolate({
              inputRange: [0, 50],
              outputRange: [1, initialOpacity],
            }),
            transform: [{ translateY: slideUpAnim3 }],
          }}
        >
          계좌 개설도
        </Animated.Text>
        <Animated.Text
          style={{
            ...styles.textStyle,
            opacity: slideUpAnim4.interpolate({
              inputRange: [0, 50],
              outputRange: [1, initialOpacity],
            }),
            transform: [{ translateY: slideUpAnim4 }],
          }}
        >
          정말 손쉽게
        </Animated.Text>
        {/* <Animated.Image 
        source={require('path-to-your-image.png')} // 이미지 경로를 변경해주세요.
        style={{ ...styles.imageStyle, opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }}
      /> */}
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("AccountConfigurationScreen")}
        >
          <Text style={styles.buttonText}>신청하기</Text>
        </TouchableOpacity>
      </View>
      {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start", // 여기를 수정합니다.
  },
  contentContainer: {
    // 이 스타일을 추가합니다.
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  textStyle: {
    fontSize: 20,
    marginBottom: 20, // 간격 추가
  },
  centerText: {
    fontSize: 20,
    marginBottom: 20, // 간격 추가
    textAlign: "center",
  },
  imageStyle: {
    width: 200,
    height: 200,
    marginBottom: 30,
    resizeMode: "contain",
  },
  buttonStyle: {
    width: "100%",
    padding: 10,
    backgroundColor: "#2196F3", // 버튼의 배경색입니다. 원하는 색상으로 변경 가능합니다.
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4, // 버튼의 모서리를 둥글게 만들어 줍니다. 원하는 값으로 조절 가능합니다.
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
