import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import HeaderComponent from "../Components/HeaderScreen";

export default function SignUp3Screen({ navigation, route }) {
  const passwordInputRef = useRef(null)
  const confirmPasswordInputRef = useRef(null)
  const [userInfo, setUserInfo] = useState(route.params.userInfo);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    return regex.test(password);
  };
  const handlePasswordChange = (text) => {
    setPassword(text);
    if (validatePassword(text)) {
      setPasswordMessage("완벽합니다.");
      setIsPasswordValid(true);
    } else {
      setPasswordMessage("양식을 맞춰주세요!");
      setIsPasswordValid(false);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if ((text === password) && validatePassword(text)) {
      setConfirmPasswordMessage("완벽합니다.");
      setIsConfirmPasswordValid(true);
      setUserInfo((prev) => ({ ...prev, password: text }));
    } else {
      setConfirmPasswordMessage("비밀번호가 일치하지 않습니다.");
      setIsConfirmPasswordValid(false);
    }
  };

  const gotoSignUp4Screen = () =>{
    switch (true) {
      case !password:
        Alert.alert('','사용하실 비밀번호를 입력해주세요')
        passwordInputRef.current.focus()
        break;
      case !confirmPassword:
        Alert.alert('','비밀번호 확인란을 입력해주세요')
        confirmPasswordInputRef.current.focus()
        break;
      case !isPasswordValid:
        Alert.alert('','비밀번호가 올바른지 확인해주세요.')
        passwordInputRef.current.focus()
        break;
      case !isConfirmPasswordValid:
        Alert.alert('','비밀번호 확인이 사용하실 비밀번호와 일치하지 않습니다. 비밀번호를 확인해주세요.')
        confirmPasswordInputRef.current.focus()
        break;
      default:
        navigation.navigate("SignUp4Screen", { userInfo: userInfo })
        break;
    }
  }
  useEffect(()=>{
    passwordInputRef.current.focus()
  },[])

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="회원가입(3/4)"
        cancelNavi="LoginScreen"
        navigation={navigation}
      ></HeaderComponent>
      <View style={styles.innerContainer}>
        <ScrollView style={styles.header}>
          <Text style={styles.title}>비밀번호 설정하기</Text>
          <Text style={styles.subtitle}>비밀번호</Text>
          <TextInput
            // style={styles.input}
            style={password ?styles.input:[styles.input,{fontSize:12}]}
            placeholder="영문, 숫자, 특수문자 포함 8자 이상 16자 이내"
            placeholderTextColor="#7B7B7B"
            onChangeText={handlePasswordChange}
            secureTextEntry={true}
            value={password}
            maxLength={16}
            keyboardType="default"
            returnKeyType ="next"
            ref={passwordInputRef}
            onSubmitEditing={()=>{
              confirmPasswordInputRef.current.focus()
            }}
          />
          <View style={styles.rowContainer}>
            <Text
              style={ isPasswordValid ? styles.validMessage1 : styles.validMessage2}
            >
              {passwordMessage}
            </Text>
          </View>

          <Text style={styles.subtitle}>비밀번호 확인</Text>
          <TextInput
            style={confirmPassword ?styles.input:[styles.input,{fontSize:12}]}
            placeholder="비밀번호를 다시 입력해주세요."
            placeholderTextColor="#7B7B7B"
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry={true}
            value={confirmPassword}
            maxLength={16}
            returnKeyType ="done"
            ref={confirmPasswordInputRef}
            onSubmitEditing={()=>{
              gotoSignUp4Screen()
            }}

          />
          <View style={styles.rowContainer}>
            <Text
              style={ isConfirmPasswordValid ? styles.validMessage1 : styles.validMessage2}
            >
              {confirmPasswordMessage}
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.button, 
            !(isPasswordValid && isConfirmPasswordValid) && {backgroundColor: "grey",},
          ]}
          onPress={() =>{
            gotoSignUp4Screen()
          }}
          disabled={!isPasswordValid || !isConfirmPasswordValid}
        >
          <Text style={styles.buttonText}>다음</Text>
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
  header: {
    flex: 1,
    marginTop: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  subtitle: {
    color: "#7B7B7B",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#D9D9D920",
    borderWidth: 1,
    borderColor: "#BAC0CA",
    borderRadius: 10,
    padding: 10,
  },
  button: {
    height: 40,
    backgroundColor: "#FF965C",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  inputBehindText: {
    color: "#7B7B7B",
    marginBottom: 40,
    fontSize: 12,
    marginLeft: 10,
  },
  rowContainer: {
    flexDirection: "row",
  },
  validMessage1:{
    color: "blue",
    marginBottom: 20,
    fontSize: 12,
  },
  validMessage2:{
    color: "red",
    fontSize: 12,
    marginBottom: 20,
  }
});
