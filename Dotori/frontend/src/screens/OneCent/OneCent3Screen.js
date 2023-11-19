import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FooterScreen from "../Components/FooterScreen";
import { useDispatch, useSelector } from "react-redux";
import {accountVerificationsOnecentSend} from '../../apis/accountapi'

export default function OneCent3Screen({ navigation, route }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외
  
  const [accountInfo, setAccountInfo] = useState(route.params.accountInfo);

  const handleConfirm = () => {
    doAccountVerificationsOnecentSend()
  };

  const doAccountVerificationsOnecentSend = async () =>{
    const data = {bankSeq: accountInfo.bankSeq, accountNumber:accountInfo.accountNumber}
    try{
      const response = await accountVerificationsOnecentSend(data, accessToken, grantType)
      if(response.status === 200){
        navigation.navigate("OneCent4Screen", {
          accountInfo: accountInfo,
        });
      }else if(response.status === 404){
      }else{
      }
    }catch(error){
    }
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/images/Hamster/LightHamster.png")}
      />

      <View style={styles.box}>
        <Image
          style={styles.leftImage}
          source={require("../../assets/images/logo_podo.png")}
        />
        <Text style={styles.text}>{accountInfo.accountNumber}</Text>
      </View>

      <Text style={styles.text}>{accountInfo.userName}님 계좌가 맞는지</Text>
      <Text style={styles.text}>확인하기 위해</Text>
      <Text style={{ fontSize: 18 }}>
        <Text style={{ color: "#FF965C" }}>1원</Text>을 보내볼께요
      </Text>

      <TouchableOpacity style={styles.button}
        onPress={() =>{
          handleConfirm()
        }}
      >
        <Text style={styles.buttonText}>1원 보내기</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <FooterScreen navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 180,
  },
  box: {
    width: "60%",
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    elevation: 4,
    padding: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    height: 55,
  },
  leftImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    color: "#000000",
  },
  button: {
    backgroundColor: "#FF965C",
    borderRadius: 8,
    width: "80%",
    height: 40,
    marginTop: 180,
    marginBottom: -100,
  },
  buttonText: {
    fontSize: 15,
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: "center",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: -20,
  },
});
