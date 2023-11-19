import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import HeaderComponent from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";
import { useSelector } from "react-redux";

export default function OpenAccountCompleteScreen({ navigation, route }) {
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  const [accountInfo, setAccountNumber] = useState(route.params.accountInfo)
  return (
    <View style={styles.container}>
      <HeaderComponent navigation={navigation} title="계좌개설 완료" />
      <View style={styles.contentContainer}>
        <Image
          source={require("../../assets/images/double_podo.png")}
          style={styles.image}
        />

        <Text style={styles.boldText}>계좌 개설</Text>
        <Text style={styles.boldText}>완료</Text>
        <View style={styles.bankInfoContainer}>
          { accountInfo
            ?<Text style={styles.bankInfoText}>포도은행 {accountInfo.accountNumber.slice(0,4)}-{accountInfo.accountNumber.slice(4,6)}-{accountInfo.accountNumber.slice(6)}</Text>
            :<Text style={styles.bankInfoText}>포도은행 1234-12-1234567</Text>
          }
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={styles.homeButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
      {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 30,
    marginTop: -50,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  accountNumber: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: "#842DC480",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    // width: "80%", // 버튼의 넓이를 조절
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bankInfoContainer: {
    width: "70%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    padding: 10,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    alignSelf: "center", // 이 스타일을 추가하여 중앙에 위치하게 합니다.
  },
  bankInfoText: {
    fontSize: 13,
  },
  confirmText: {
    color: "white",
    fontSize: 20,
  },
});
