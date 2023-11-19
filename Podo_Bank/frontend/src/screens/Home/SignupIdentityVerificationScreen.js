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
import { useSelector } from "react-redux";

export default function SignupIdentityVerificationScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    name: "",
    birthdate: "",
    phoneNumber: "",
  });
  const [nameMessage, setNameMessage] = useState("")
  const [birthdateMessage, setBirthdateMessage] = useState("")
  const [phoneNumberMessage, setPhoneNumberMessage] = useState("")
  const [isValid, setIsValid] = useState({
    isNameValid: false,
    isBirthdateValid: false,
    isPhoneNumberValid: false,
  })
  // const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)

  const validateName = (text) => {
    const regex = /^[A-Za-z가-힣]{2,}$/
    return regex.test(text);
  };
  const validateBirthdate = (text) => {
    const regex = /^\d{8}$/;
    return regex.test(text);
  };
  const validatePhoneNumber = (text) => {
    const regex = /^01\d{9}$/;
    return regex.test(text);
  };
  const handleNameChange = (text) => {
    if (validateName(text)) {
      setNameMessage("이름 작성 완료");
      setIsValid((prev) => ({ ...prev, isNameValid: true }))
    } else {
      setNameMessage("이름은 2글자 이상이어야합니다.");
      setIsValid((prev) => ({ ...prev, isNameValid: false }))
    }
  };
  const handleBirthdateChange = (text) => {
    if (validateBirthdate(text)) {
      setBirthdateMessage("생년월일 작성 완료");
      setIsValid((prev) => ({ ...prev, isBirthdateValid: true }))
    } else {
      setBirthdateMessage('8자리 숫자로 작성해야 합니다.');
      setIsValid((prev) => ({ ...prev, isBirthdateValid: false }))
    }
  };
  const handlePhoneNumberMessageChange = (text) => {
    if (validatePhoneNumber(text)) {
      setPhoneNumberMessage("휴대폰번호 작성 완료");
      setIsValid((prev) => ({ ...prev, isPhoneNumberValid: true }))
    } else {
      setPhoneNumberMessage('01X로 시작하는 11자리 숫자로 작성해야 합니다.');
      setIsValid((prev) => ({ ...prev, isPhoneNumberValid: false }))
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderComponent
        title="회원가입(1/3)"
        navigation={navigation}
      ></HeaderComponent>

      {/* 본인 인증 안내 */}
      <Text style={styles.boldText}>본인 인증을 진행해주세요</Text>

      {/* 이름 입력창 */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>이름</Text>
        <TextInput
          placeholder="박보검"
          style={styles.input}
          onChangeText={(text) =>{
            handleNameChange(text)
            setUserInfo((prev) => ({ ...prev, name: text }))
          }}
          value={userInfo.name}
        />
      </View>
      <Text
        style={{
          color: (isValid.isNameValid) ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {nameMessage}
      </Text>
      {/* 생년월일 입력 */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>생년월일 8자리</Text>
        <TextInput
          placeholder="19991212"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={8}
          onChangeText={(text) => {
            handleBirthdateChange(text)
            setUserInfo({ ...userInfo, birthdate: text })
          }}
          value={userInfo.birthdate}
        />
      </View>
      <Text
        style={{
          color: (isValid.isBirthdateValid) ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {birthdateMessage}
      </Text>
      {/* 휴대폰번호입력 */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>휴대폰번호</Text>
        <TextInput
          placeholder="01012341234"
          style={styles.input}
          maxLength={11}
          keyboardType="number-pad"
          onChangeText={(text) =>{
            handlePhoneNumberMessageChange(text)
            setUserInfo({ ...userInfo, phoneNumber: text,})
          }}
          value={userInfo.phoneNumber}
        />
      </View>
      <Text
        style={{
          color: (isValid.isPhoneNumberValid) ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {phoneNumberMessage}
      </Text>
      <TouchableOpacity
        style={[
          styles.customButton,
          (!isValid.isNameValid || !isValid.isBirthdateValid || !isValid.isPhoneNumberValid) && {
            backgroundColor: "grey",
          },
        ]}
        onPress={() =>{
          navigation.navigate("SignupInformationEmailScreen", {
            userInfo: userInfo,
          })
        }}
        disabled={!isValid.isNameValid || !isValid.isBirthdateValid || !isValid.isPhoneNumberValid}
      >
        <Text style={styles.linkText}>확인</Text>
      </TouchableOpacity>
      {/* {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />} */}
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
  inputContainer: {
    marginTop: 10,
    justifyContent: "flex-start",
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
