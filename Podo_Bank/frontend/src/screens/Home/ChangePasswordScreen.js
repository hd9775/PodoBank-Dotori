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
import {
  userPasswordChange
} from '../../apis/userapi'

import { useSelector, useDispatch } from 'react-redux';
import { inputAccessToken, inputRefreshToken } from '../../redux/slices/auth/user'


export default function ChangePasswordScreen({ navigation, route}) {
  const [userEmail, setUserEmail] = useState(route.params.userEmail);  // 회원가입하면서 router를 통해 가져오고 있는 userInfo
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPasswordMessage, setNewPasswordMessage] = useState("");
  const [confirmNewPasswordMessage, setConfirmNewPasswordMessage] = useState("");
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
  const [isConfirmNewPasswordValid, setIsConfirmNewPasswordValid] = useState(false);
  const [isSucceed, setIsSucceed] = useState(false);              // 회원가입 성공여부
  const [passwordChangedMessage, setPasswordChangedMessage] = useState(""); // 회원가입 버튼 클릭시 메시지
  const accessToken = useSelector((state) => state.user.accessToken)
  const refreshToken = useSelector((state) => state.user.refreshToken)
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)

  const validateNewPassword = (newPassword) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    return regex.test(newPassword);
  };

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    if(text === currentPassword){
      setNewPasswordMessage("동일한 비밀번호는 사용 할 수 없습니다.");
      setIsNewPasswordValid(false);
    } else if (validateNewPassword(text)) {
      setNewPasswordMessage("완벽합니다.");
      setIsNewPasswordValid(true);
    } else {
      setNewPasswordMessage("양식을 맞춰주세요!");
      setIsNewPasswordValid(false);
    }
  };

  const handleConfirmNewPasswordChange = (text) => {
    setConfirmNewPassword(text);
    if(text === currentPassword){
      setConfirmNewPasswordMessage("동일한 비밀번호는 사용 할 수 없습니다.");
      setIsConfirmNewPasswordValid(false);
    } else if (text === newPassword && isNewPasswordValid) {
      setConfirmNewPasswordMessage("완벽합니다.");
      setIsConfirmNewPasswordValid(true);
    } else {
      setConfirmNewPasswordMessage("비밀번호가 일치하지 않습니다");
      setIsConfirmNewPasswordValid(false);
    }
  };

  // 비밀번호 변경
  const handleUserNewPasswordChange = async()=>{
    // const userPassword = { password: currentPassword, newPassword: confirmNewPassword };
    // console.log(userPassword)
    // const response = await userPasswordChange(userPassword, accessToken)
    const response = await userPasswordChange(currentPassword, confirmNewPassword, accessToken)
    if(response.status === 200){
      console.log('비밀번호 변경 성공')
      setIsSucceed(true)
      setPasswordChangedMessage('비밀번호 변경에 성공했습니다.')
      // navigation.navigate("ChangePasswordSucceessScreen", {
      //   userEmail: userEmail,
      // })
      navigation.reset({
        index: 0,
        routes: [{ name: 'ChangePasswordSucceessScreen', params: { userEmail: userEmail },}],
      });
    }else if(response.status === 400){
      console.log('비밀번호 변경 실패')
      setPasswordChangedMessage('비밀번호 변경에 실패했습니다.')
    }else if(response.status === 401){
      console.log('인증 실패')
      setPasswordChangedMessage('인증에 실패했습니다.')
    }else if(response.status === 403){
      console.log('토큰 없음')
      setPasswordChangedMessage('로그인 인증이 종료된 상태입니다.')
    }else if(response.status === 404){
      console.log('존재하지 않는 회원')
      setPasswordChangedMessage('존재하지 않는 회원입니다.')
    }else if(response.status === 422){
      console.log('비밀번호 형식 오류')
      setPasswordChangedMessage('비밀번호 형식 오류가 발생했습니다.')
    }else{
      console.log('오류 발생')
      setPasswordChangedMessage('오류 발생')
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderComponent
        navigation={navigation}
        title="비밀번호 변경"
      ></HeaderComponent>

      {/* 본인 인증 안내 */}
      <Text style={styles.boldText}>본인 인증을 진행해주세요</Text>

      {/* 현재 비밀번호 */}
      <View style={styles.inputContainer}>
        <View style={styles.textRow}>
          <Text style={styles.inputText}>현재 비밀번호</Text>
        </View>

        <TextInput
          style={styles.input}
          onChangeText={(text)=>{
            setCurrentPassword(text)
          }}
          secureTextEntry={true}
          placeholder="현재 비밀번호를 입력해 주세요."
        />
      </View>
      {/* <Text
        style={{
          color: isNewPasswordValid ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {newPasswordMessage}
      </Text> */}

      {/* 새 비밀번호 */}
      <View style={styles.inputContainer}>
        <View style={styles.textRow}>
          <Text style={styles.inputText}>새 비밀번호</Text>
          <Text style={styles.descriptionText}>
            영문, 숫자, 특수문자가 모두 들어간 8~16글자
          </Text>
        </View>

        <TextInput
          style={styles.input}
          onChangeText={handleNewPasswordChange}
          secureTextEntry={true}
          placeholder="변경할 비밀번호를 입력해 주세요."
        />
      </View>
      <Text
        style={{
          color: isNewPasswordValid ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {newPasswordMessage}
      </Text>
      
      {/* 비밀번호 확인 */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>비밀번호 확인</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleConfirmNewPasswordChange}
          secureTextEntry={true}
          placeholder="비밀번호를 한번 더 입력해 주세요."
        />
      </View>
      
      <Text
        style={{
          color: isConfirmNewPasswordValid ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {confirmNewPasswordMessage}
      </Text>
      <View>
        <Text
          style={{
            color: isSucceed ? "blue" : "red",
            alignSelf: 'center',
          }}
        >
          {passwordChangedMessage}
        </Text>
      </View>
      

      <TouchableOpacity
        style={[
          styles.customButton,
          !(isNewPasswordValid && isConfirmNewPasswordValid) && {
            backgroundColor: "grey",
          },
        ]}
        // back에 회원가입 정보 보내야함
        onPress={() =>{
          handleUserNewPasswordChange()
          // if(isSucceed){
          //   navigation.navigate("ResetNewPasswordSucceessScreen", {
          //     email: "abc123@naver.com",
          //     // email: email,
          //   })
          // }
        }}
        disabled={!(isNewPasswordValid && isConfirmNewPasswordValid)}
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
