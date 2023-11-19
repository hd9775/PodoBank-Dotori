import React, { useEffect, useRef, useState } from "react";
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

export default function PurposeCreate1Screen({ navigation }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외
  const purposeTitleRef = useRef()
  
  const [purposeInfo, setPurposeInfo] = useState({
    purposeTitle: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [purposeTitleMessage, setPurposeTitleMessage] = useState("10자 이내로 작성해주세요.")

  const validatePurposeTitle = (text) => {
    const regex = /^[A-Za-z가-힣\s0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]{1,10}$/;
    return regex.test(text);
  };

  const handleNameChange = (text) => {
    setPurposeInfo((prev) => ({ ...prev, purposeTitle: text }));
    if (validatePurposeTitle(text)) {
      setIsValid(true);
      setPurposeTitleMessage("목표 이름 설정 완료!")
    } else {
      setIsValid(false);
      setPurposeTitleMessage("10자 이내로 작성해주세요.")
    }
  };

  const goPurposeCreate2Screen = () => {
    if(isValid){
      navigation.navigate("PurposeCreate2Screen", {
        purposeInfo: purposeInfo,
      })
    }{
      
    }
  }

  useEffect(()=>{
    purposeTitleRef.current.focus()
  })

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="목표생성(1/3)"
        cancelNavi="PurposeScreen"
        navigation={navigation}
      ></HeaderComponent>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>목표 설정하기</Text>
          <Text style={styles.subtitle}>달성할 목표를 입력해주세요.</Text>
          <View style={styles.imageView}>
            <Image
              style={styles.middleImage}
              source={require("../../assets/images/Hamster/PurposeCreateHamster.png")}
            ></Image>
          </View>

          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              handleNameChange(text)
            }}
            maxLength={10}
            value={purposeInfo.purposeTitle}
            ref={purposeTitleRef}
            keyboardType="default"
            returnKeyType="done"
            onSubmitEditing={()=>{
              goPurposeCreate2Screen()
            }}
          />
          <View style={styles.textRight}>
            <Text style={[styles.instructionText,{color:isValid?'blue':'gray'}]}>
              {purposeTitleMessage}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: isValid?"#FF965C":"gray"}]}
          onPress={() =>{
            goPurposeCreate2Screen()
          }}
          disabled={!isValid}
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
    height: 50,
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
    marginTop: 10,
  },
  instructionText: {
    color: "#A9A9A9",
    fontSize: 12,
  },
});
