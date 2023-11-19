import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import {userLogin} from "../../apis/userapi"
import { useDispatch, useSelector } from "react-redux";
import {inputgrantType, inputAccessToken, inputRefreshToken} from "../../redux/slices/auth/user"

export default function SignUpCompleteScreen({ navigation, route }) {
  // 토큰
  const grantType =  useSelector((state)=>{state.user.grantType})
  const accessToken =  useSelector((state)=>{state.user.accessToken})
  const refreshToken =  useSelector((state)=>{state.user.refreshToken})
  const dispatch = useDispatch()
  // 그 외
  const [loginInfo] = useState(route.params.loginInfo)
  const [userName] = useState(loginInfo.userName)


  const handleLogin = () => {
    if(loginInfo.id && loginInfo.password){
      doLogin();
    }else{
      navigation.navigate("LoginScreen")
    }
  }

  const doLogin = async () => {
    const data = {id:loginInfo.id, password:loginInfo.password}
    const response = await userLogin(data)
    if(response.status === 200){
      console.log('로그인 성공')
      try{
        dispatch(inputgrantType(response.data.grantType))
        dispatch(inputAccessToken(response.data.accessToken))
        dispatch(inputRefreshToken(response.data.refreshToken))
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainPageScreen' }],
        });
      }catch(error){
        console.log("access토큰 저장 실패")
        navigation.navigate("LoginScreen")
      }
    }else if(response.status === 400){
      console.log('로그인 실패')
      navigation.navigate("LoginScreen")
    }else{
      console.log('오류 발생: 로그인 실패')
      navigation.navigate("LoginScreen")
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.centerContainer}>
          <Image
            style={styles.centerImage}
            source={require("../../assets/images/Hamster/SignUpHamster.png")}
          />
          <Text style={styles.boldText}>{userName}님</Text>
          <Text style={styles.regularText}>회원가입을 축하합니다!</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleLogin()
          }}
        >
          <Text style={styles.buttonText}>도토리 시작하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerImage: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 10,
  },
  regularText: {
    fontSize: 20,
  },

  button: {
    height: 40,
    backgroundColor: "#FF965C",
    marginBottom: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
