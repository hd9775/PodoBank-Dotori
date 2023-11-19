import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import HeaderComponent from "../Components/HeaderScreen";
import { useDispatch, useSelector } from "react-redux";
import { purposeNewRegister } from "../../apis/purposeapi"

export default function PurposeCreate3Screen({ navigation, route }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외
  
  const goalAmountRef = useRef()
  const [purposeInfo, setPurposeInfo] = useState(route.params.purposeInfo);
  const [isValid, setIsValid] = useState(false);
  const [goalAmountMessage, setgoalAmountMessage] = useState("숫자만 입력해주세요.")

  const validategoalAmount = (text) => {
    const regex = /^[0-9]{1,}$/
    return regex.test(text)
  }

  const handleMoneyChange = (text) => {
    if(validategoalAmount(text)) {
      setPurposeInfo((prev) => ({ ...prev, goalAmount: text }))
      setIsValid(true)
      setgoalAmountMessage("목표 금액 설정 완료!")
    }else if(text.length <= 0){
      setPurposeInfo((prev) => ({ ...prev, goalAmount: "" }))
      setIsValid(false)
      setgoalAmountMessage("숫자만 입력해주세요.")
    }
    else {
      setIsValid(false)
      setgoalAmountMessage("숫자만 입력해주세요.")
    }
  }

  const handlePurposeNewRegister = () => {
    if(isValid){
      doPurposeNewRegister()
    }else{
      setIsValid(false)
      setgoalAmountMessage("숫자만 입력해주세요.")
    }
  }

  const doPurposeNewRegister = async () => {
    data = {
      "purposeTitle" : purposeInfo.purposeTitle,
      "goalAmount" : parseInt(purposeInfo.goalAmount),
      "startedAt" : purposeInfo.startedAt,
      "endAt" : purposeInfo.endAt,
    }
    try{
      const response = await purposeNewRegister(data, accessToken, grantType)
      if(response.status===200){
        navigation.reset({
          index: 0,
          routes: [{ name: 'PurposeCompleteScreen', params: {name : purposeInfo.purposeTitle}}],
        })
      }else if(response.status===400){
      }else{
      }
    }catch(error){
    }
  }

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="목표생성(3/3)"
        cancelNavi="PurposeScreen"
        navigation={navigation}
      ></HeaderComponent>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>목표 금액 설정하기</Text>
          <Text style={styles.subtitle}>목표 금액을 숫자로 적어주세요.</Text>

          <TextInput
            style={styles.input}
            onChangeText={handleMoneyChange}
            multiline={true}
            placeholder="예시) 10000"
            keyboardType="numeric"
            returnKeyType="done"
            ref={goalAmountRef}
            onSubmitEditing={()=>{
              handlePurposeNewRegister()
            }}
            value={purposeInfo.goalAmount}
          />
          <View style={styles.textRight}>
            <Text style={[styles.instructionText, {color:isValid?'blue':'#A9A9A9'}]}>{goalAmountMessage}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, {backgroundColor:isValid?"#FF965C":"gray"}]}
          onPress={() => {
            handlePurposeNewRegister()
          }}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>목표 생성하기</Text>
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
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    flex: 1,
    marginTop: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#7B7B7B",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#D9D9D920",
    borderWidth: 1,
    borderColor: "#BAC0CA",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  button: {
    height: 40,
    backgroundColor: "#FF965C",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  imageView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  middleImage: {
    width: 150,
    height: 150,
  },
  textRight: {
    alignItems: "flex-end",
  },
  instructionText: {
    color: "#A9A9A9",
  },
});
