import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import HeaderComponent from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";
import { useSelector } from "react-redux";

export default function TransferCompleteScreen({ navigation, route }) {
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  // const { receiverName, transferAmount } = route.params
  const [accountInfo] = useState(route.params.accountInfo)
  const [receiverName] = useState(route.params.receiverName)
  const [transferAmount] = useState(route.params.transferAmount)
  const [senderAccountNumber] = useState(route.params.senderAccountNumber)
  const [receiverAccountNumber] = useState(route.params.receiverAccountNumber)


  // 계좌 번호 형식 맞추는 함수
  const settingAccountNumber = (accountNumber) =>{
    return `${accountNumber.slice(0,4)}-${accountNumber.slice(4,6)}-${accountNumber.slice(6)}`
  }
  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <View style={styles.container}>
        <HeaderComponent navigation={navigation} title="계좌이체" />

        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/double_podo.png")}
            style={styles.image}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.largeText}>{receiverName}님께</Text>
          <Text style={styles.largeText}>{transferAmount.toLocaleString()}원</Text>
          <Text style={styles.normalText}>이체가 완료되었습니다.</Text>
          <View style={styles.bankInfoContainer}>
            {/* 어느부분?에 대해서 송금 받는곳? 아님 송금 하는 계좌? 우선 송금하는 계좌 번호*/}
            <Text style={styles.bankInfoText}>포도은행 {settingAccountNumber(senderAccountNumber)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.shadow]}
            onPress={()=>{
              navigation.navigate("TransferScreen", {
                accountNumber: accountInfo.accountNumber,
              });
            }}
          >
            <Text style={[styles.buttonText, styles.blackText]}>추가이체</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.shadow, styles.transactionButton]}
            onPress={()=>{
              navigation.navigate("AccountDetailScreen", {
                // account: accountInfo,
                account: accountInfo,
              });
            }}
          >
            <Text style={[styles.buttonText, styles.blackText]}>
              거래내역조회
            </Text>
          </TouchableOpacity>
        </View>

      </View>
      <TouchableOpacity
        // style={[styles.confirmButton, styles.bottom]}
        style={[styles.confirmButton]}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
      {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },

  imageContainer: {
    // 이 부분이 추가되었습니다.
    flex: 1,
    alignItems: "center",
    justifyContent: "center", // 이 부분이 추가되었습니다.
    // marginBottom: 60,
    marginBottom: -70,
  },
  textContainer: {
    // marginTop: -60,
    marginBottom: 160,
  },
  headerContainer: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  largeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    // alignItems: "center",
    // justifyContent: "center",
  },
  normalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  bankInfoText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    width: "100%",
    marginBottom: 30,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 130,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    width: 150,
  },
  confirmButton: {
    backgroundColor: "#842DC480",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: "100%",
    // marginLeft: -20,
    alignSelf: "center",
  },
  transactionButton: {
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    // fontWeight: "bold",
    textAlign: "center",
  },
  blackText: {
    color: "black",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // bottom: {
  //   position: "absolute",
  //   bottom: 0,
  // },
  bankInfoContainer: {
    width: "70%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    padding: 10,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 20,
    // marginLeft: -20,
    alignSelf: "center", // 이 스타일을 추가하여 중앙에 위치하게 합니다.
  },
  
  
  nextButton: {
    // marginLeft: -30,
    // marginRight: -30,
    width:"100%",
    backgroundColor: "purple",
    padding: 15,
    alignItems: "center",

    borderRadius: 5,
    // marginTop: 300,
  },
});
