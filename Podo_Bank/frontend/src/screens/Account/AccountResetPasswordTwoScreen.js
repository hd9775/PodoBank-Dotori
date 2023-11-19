import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import HeaderComponent from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";
import { accountPasswordInitialization } from "../../apis/accountapi"
import { useSelector } from "react-redux";

export default function AccountResetPasswordTwoScreen({ navigation, route }) {
  const accessToken = useSelector((state) => state.user.accessToken)
  const [userInfo, setUserInfo] = useState(route.params.userInfo);
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isSucceed, setIsSucceed] = useState(false);              // 비밀번호 초기화 성공여부
  const [registeredMessage, setRegisteredMessage] = useState(""); // 비밀번호 초기화 버튼 클릭시 메시지
  console.log(userInfo)
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)

  // const validatePassword = (password) => {
  //   const regex =
  //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
  //   return regex.test(password);
  // };
  const validatePassword = (password) => {
    const regex = /^\d{4}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (validatePassword(text)) {
      setPasswordMessage("완벽합니다");
      setIsPasswordValid(true);
    } else {
      setPasswordMessage("계좌 비밀번호 양식은 4자리 숫자입니다.!");
      setIsPasswordValid(false);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    // setConfirmPassword(text);
    if (text === password && isPasswordValid) {
      setConfirmPasswordMessage("완벽합니당");
      setIsConfirmPasswordValid(true);
      // setUserInfo((prev) => ({ ...prev, password: text, newPassword: text }));
      setUserInfo((prev) => ({ ...prev, newPassword: text }));
    } else {
      setConfirmPasswordMessage("비밀번호가 일치하지 않습니다");
      setIsConfirmPasswordValid(false);
    }
  };

  // 비밀번호 초기화
  const hanldeAccountPasswordInitialization = async()=>{
    const response = await accountPasswordInitialization(userInfo, accessToken)
    if(response.status === 200){
      console.log('계좌 비밀번호 초기화 성공')
      setIsSucceed(true)
      setRegisteredMessage('계좌 비밀번호 초기화에 성공했습니다.')
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'AccountResetPasswordSucceessScreen', params: { email: userInfo.email, accountNumber: userInfo.accountNumber },}],
      });
    }else if(response.status === 400){
      console.log('계좌 비밀번호 초기화 실패')
      setRegisteredMessage('계좌 비밀번호 초기화에 실패했습니다.')
    }else if(response.status === 401){
      console.log('권한 없음으로 계좌 비밀번호 초기화 실패')
      setRegisteredMessage('로그인 여부를 다시 확인해주세요.')
    }else if(response.status === 403){
      console.log('계좌 소유주 불일치로 비밀번호 초기화 실패')
      setRegisteredMessage('계좌 소유주가 아닙니다.')
    }else if(response.status === 429){
      console.log('계좌 비밀번호 형식 오류')
      setRegisteredMessage('계좌 비밀번호 형식 오류가 발생했습니다.')
    }else{
      console.log('오류 발생')
      setRegisteredMessage('오류 발생')
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderComponent
        navigation={navigation}
        title="계좌 비밀번호 초기화(2/2)"
      ></HeaderComponent>

      {/* 본인 인증 안내 */}
      <Text style={styles.boldText}>본인 인증을 진행해주세요</Text>

      <View style={styles.inputContainer}>
        <View style={styles.textRow}>
          <Text style={styles.inputText}>새 비밀번호</Text>
          <Text style={styles.descriptionText}>
            영문, 숫자, 특수문자가 모두 들어간 8~16글자
          </Text>
        </View>

        <TextInput
          style={styles.input}
          onChangeText={handlePasswordChange}
          secureTextEntry={true}
          placeholder="비밀번호를 입력해 주세요."
          keyboardType="number-pad"
          maxLength={4}
        />
      </View>
      <Text
        style={{
          color: isPasswordValid ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {passwordMessage}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>비밀번호 확인</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleConfirmPasswordChange}
          secureTextEntry={true}
          placeholder="비밀번호를 한번 더 입력해 주세요."
          keyboardType="number-pad"
          maxLength={4}
        />
      </View>
      
      <Text
        style={{
          color: isConfirmPasswordValid ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {confirmPasswordMessage}
      </Text>
      <View>
        <Text
          style={{
            color: isSucceed ? "blue" : "red",
            alignSelf: 'center',
          }}
        >
          {registeredMessage}
        </Text>
      </View>
      

      <TouchableOpacity
        style={[
          styles.customButton,
          !(isPasswordValid && isConfirmPasswordValid) && {
            backgroundColor: "grey",
          },
        ]}
        // back에 회원가입 정보 보내야함
        onPress={() =>{
          hanldeAccountPasswordInitialization()
        }}
        disabled={!(isPasswordValid && isConfirmPasswordValid)}
      >
        <Text style={styles.linkText}>비밀번호 등록</Text>
      </TouchableOpacity>
      {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "white",
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  boldText: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 30,
    marginBottom: 30,
    marginRight: 30,
    marginLeft: 30,
  },
  inputText: {
    marginLeft: 30,
  },
  descriptionText: {
    color: "grey",
    marginLeft: 10,
    fontSize: 12,
  },
  inputContainer: {
    marginTop: 10,
    justifyContent: "flex-start",
  },
  inputRowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifyButton: {
    backgroundColor: "#A175FD",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginLeft: -10,
    height: 50,
    marginTop: -20,
  },
  verifyButtonText: {
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
    marginRight: 30,
    marginLeft: 30,
    marginBottom: 30,
    height: 50,
    textAlignVertical: "center",

    // 그림자 스타일 추가
    elevation: 5,
    backgroundColor: "white",
  },
  customButton: {
    backgroundColor: "#A175FD",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginRight: 30,
    marginLeft: 30,
    borderRadius: 5,
  },
});
