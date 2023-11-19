import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import FooterScreen from "../Components/FooterScreen";
import { useDispatch, useSelector } from "react-redux";
import {accountWholeBank} from '../../apis/accountapi'

const banks = [
  {
    bankSeq: 1,
    bankName: "포도은행",
    image: require("../../assets/images/bankImage0.png"),
  },
  {
    bankSeq: 2,
    bankName: "국민은행",
    image: require("../../assets/images/bankImage1.png"),
  },
  {
    bankSeq: 3,
    bankName: "카카오뱅크",
    image: require("../../assets/images/bankImage2.png"),
  },
  {
    bankSeq: 4,
    bankName: "신한은행",
    image: require("../../assets/images/bankImage3.png"),
  },
  {
    bankSeq: 5,
    bankName: "농협은행",
    image: require("../../assets/images/bankImage4.png"),
  },
  {
    bankSeq: 6,
    bankName: "하나은행",
    image: require("../../assets/images/bankImage5.png"),
  },
  {
    bankSeq: 7,
    bankName: "새마을금고",
    image: require("../../assets/images/bankImage6.png"),
  },
  {
    bankSeq: 8,
    bankName: "대구은행",
    image: require("../../assets/images/bankImage7.png"),
  },
  {
    bankSeq: 9,
    bankName: "케이뱅크",
    image: require("../../assets/images/bankImage8.png"),
  },
];

export default function OneCent1Screen({ navigation,route }) {
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  const [bankList, setBankList] = useState([])
  const [userName, setUserName] = useState(route.params.userName)

  const doAccountWholeBank = async () => {
    try{
      const response = await accountWholeBank(accessToken, grantType)
      if(response.status===200){
        setBankList(response.data)
        console.log(response.data)
      }else{
        console.log("은행 리스트 조회 실패", response.status)
      }
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    doAccountWholeBank()
  },[])
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.boldText}>인증을 하기 위한</Text>
          <Text style={styles.boldText}>은행을 선택하세요.</Text>
          <Text style={styles.grayText}>
            1원 인증을 진행할 은행을 선택해주세요.
          </Text>
        </View>

        <View style={styles.bankContainer}>
          {banks.map((bank) => (
            <TouchableOpacity
              key={bank.bankSeq}
              style={styles.bankBox}
              onPress={() =>
                navigation.navigate("OneCent2Screen", {
                  userName: userName,
                  bankSeq: bank.bankSeq,
                  bankName: bank.bankName,
                  bankImage: bank.image,
                })
              }
              disabled={bankList.some((item) => item.bankSeq != bank.bankSeq)}  
            >
              <Image style={styles.bankLogo} source={bank.image} />
              <Text style={[styles.bankName, {color: bankList.some((item) => item.bankSeq != bank.bankSeq)?"#A9A9A9":"black"}]}>{bank.bankName}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  inContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  innerContainer: {
    marginTop: 160,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 5,
    textAlign: "left",
  },
  grayText: {
    color: "#A9A9A9",
    fontSize: 10,
    marginTop: 10,
    marginBottom: 60,

    marginLeft: 5,
    textAlign: "left",
  },
  bankContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bankBox: {
    width: "30%",
    backgroundColor: "#FBFBFD",
    borderRadius: 13,
    margin: 4,
    padding: 8,
    alignItems: "center",
  },
  bankLogo: {
    width: 25,
    height: 25,
  },
  bankName: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 12,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: -20,
  },
});
