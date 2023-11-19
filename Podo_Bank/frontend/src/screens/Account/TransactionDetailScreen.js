import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import HeaderComponent from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";
import { useSelector } from "react-redux";


export default function TransactionDetailScreen({ navigation, route }) {
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  const [transactionInfo, setTransactionInfo] = useState(route.params.transactionInfo)
  // const isWithdrawal = true; // 예제에서는 출금으로 가정
  const formDateTransaction = (dateString) =>{
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="거래내역 상세"
        navigation={navigation}
        showHome={true}
      />
      {/* <View style={styles.header}>
        <Text style={{ flex: 1 }}></Text>
        <Text
          style={{
            flex: 2,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          거래내역상세
        </Text>
        <TouchableOpacity
          style={{ flex: 1, alignItems: "flex-end" }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20 }}>X</Text>
        </TouchableOpacity>
      </View> */}
      <View style={{flex:0.05}}></View>
      <View style={{flex:0.95}}>
        <Text style={styles.boldText}>{transactionInfo.content}</Text>
        <View style={styles.separator} />

        {/* <Text style={styles.date}>2023.08.29 12:46:25</Text> */}
        <Text style={styles.date}>{formDateTransaction(transactionInfo.transactionAt)}</Text>
        <View style={styles.transactionRow}>
          <Text>거래금액</Text>
          <View style={{ flexDirection: "row" }}>
            {/* <Text>{isWithdrawal ? "출금 " : "입금 "}</Text> */}
            <Text>{transactionInfo.transactionType==="WITHDRAWAL" ? "출금 " : "입금 "}</Text>
            <Text style={transactionInfo.transactionType==="WITHDRAWAL" ? styles.redText : styles.blueText}>
              {(transactionInfo.amount.toLocaleString())}
            </Text>
            <Text>원</Text>
          </View>
        </View>
        <View style={styles.transactionRow}>
          <Text>거래 후 잔액</Text>
          <Text>{transactionInfo.balanceAfter.toLocaleString()}원</Text>
        </View>
        <View style={styles.transactionRow}>
          <Text>거래유형</Text>
          {/* <Text>자동이체</Text> */}
          <Text>{transactionInfo.transactionType==="WITHDRAWAL" ? "체크카드" : "전자금융"}</Text>
        </View>

        <View style={styles.transactionRow}>
          <Text>내 통장 표시</Text>
          <Text>{transactionInfo.content}</Text>
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
      {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 30,
    marginTop: 15,
  },
  boldText: {
    fontWeight: "bold",
    marginBottom: 30,
  },
  separator: {
    borderBottomWidth: 2,
    marginVertical: 10,
    marginBottom: 20,
  },
  date: {
    marginBottom: 20,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    marginBottom: 10,
  },
  redText: {
    color: "red",
  },
  blueText: {
    color: "blue",
  },
  rightAlignedMultiLineText: {
    alignItems: "flex-end",
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#842DC480",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 60,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
