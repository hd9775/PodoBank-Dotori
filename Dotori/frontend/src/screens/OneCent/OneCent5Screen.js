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
import FooterScreen from "../Components/FooterScreen";
import { useDispatch, useSelector } from "react-redux";
import { accountNicknameRegist } from '../../apis/accountapi'

export default function OneCent5Screen({ navigation, route }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외
  const accountTitleRef = useRef(null)

  const [accountInfo, setAccountInfo] = useState({...route.params.accountInfo, accountTitle:""});
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validateAccountTitle = (text) => {
    const regex = /^[A-Za-z0-9가-힣]{1,10}$/; 
    return regex.test(text);
  };

  const handleAccountTitle = (text) =>{
    setAccountInfo({ ...accountInfo, accountTitle: text });
    
    if (!validateAccountTitle(text)) {
      setIsValid(false)
      setErrorMessage("계좌 별칭을 10자리 띄어쓰기 없이 음절로 입력해주세요.");
    } else {
      setIsValid(true)
      setErrorMessage("");
    }
  }

  const handleConfirm = () => {
    if (!validateAccountTitle(accountInfo.accountTitle)) {
      setErrorMessage("계좌 별칭을 10자리 띄어쓰기 없이 음절로 입력해주세요.")
    } else {
      setErrorMessage("");
      navigation.navigate("OneCent3Screen", {
        accountInfo: accountInfo,
      })
    }
  };

  const handleAccountNicknameRegist = () => {
    if(isValid){
      setErrorMessage("")
      doAccountNicknameRegist()
    }else{
      setErrorMessage("10자 이내로 띄어쓰기 없이 올바르게 작성해주세요")
    }
  }

  const doAccountNicknameRegist = async () => {
    const data = {accountNumber: accountInfo.accountNumber, accountTitle: accountInfo.accountTitle}
    try{
      const response =  await accountNicknameRegist(data, accessToken, grantType)
      if(response.status === 200){
        console.log('계좌 별칭 설정 성공')
        Alert.alert("","계좌 별칭 설정을 완료했습니다.")
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainPageScreen', params:{}}],
        });
      }else{
        console.log('계좌 별칭 설정 실패', response.status)
        setErrorMessage("계좌 별칭을 다시 확인해주세요.")
      }
    }catch(error){
      console.log('계좌 별칭 설정 실패', error)
      setErrorMessage("오류 발생: 계좌 별칭 설정 실패")
    }
  }

  useEffect(()=>{
    accountTitleRef.current.focus()
  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.boldTextLeft}>계좌 별칭을 입력해주세요.</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, {fontSize:accountInfo.accountTitle?16:12}]}
            placeholder="10자 이내로 띄어쓰기 없이 음절로 작성해주세요."
            placeholderTextColor="#A9A9A9"
            underlineColorAndroid="transparent"
            returnKeyType="done"
            keyboardType="default"
            maxLength={10}
            textAlign="center"
            value={accountInfo.accountTitle}
            ref={accountTitleRef}
            onChangeText={(text) => {
              handleAccountTitle(text)
            }}
            onSubmitEditing={()=>{
              handleAccountNicknameRegist()
            }}
          />
        </View>

        <Text style={styles.errorMessage}>{(errorMessage !== "") &&errorMessage}</Text>
        

        {/* 버튼 */}
        <TouchableOpacity style={[styles.button, {backgroundColor:isValid?"#FF965C":"gray"}]}
          onPress={() => {
            handleAccountNicknameRegist()
          }}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <FooterScreen navigation={navigation} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  boldTextLeft: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 120,
    textAlign: "left",
    marginTop: 150,
  },
  inputContainer: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#FF965C",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    fontSize: 16,
    paddingVertical: 8,
    color: "#000000",
  },
  button: {
    backgroundColor: "#FF965C",
    borderRadius: 8,
    width: "100%",
    padding: 10,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    textAlign: "center",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: -20,
  },
});
