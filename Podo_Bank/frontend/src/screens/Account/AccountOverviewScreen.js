import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import HeaderScreen from "../Header/HeaderScreen";

const accounts = [
  // 더미 데이터
  { id: "1", number: "1234-5678-9101", balance: 10000 },
  { id: "2", number: "1234-5678-9102", balance: 20000 },
  { id: "3", number: "1234-5678-9102", balance: 20000 },
  { id: "4", number: "1234-5678-9102", balance: 20000 },
  { id: "5", number: "1234-5678-9102", balance: 20000 },
  { id: "6", number: "1234-5678-9102", balance: 20000 },
  { id: "7", number: "1234-5678-9102", balance: 20000 },
  { id: "8", number: "1234-5678-9102", balance: 20000 },
  // ... 필요하면 더 추가
];

const totalBalance = accounts.reduce(
  (acc, account) => acc + account.balance,
  0
);

export default function AccountOverview({ navigation }) {
  return (
    <LinearGradient colors={["#6BB5FF", "white"]} style={styles.container}>
      {/* Header */}
      <HeaderScreen navigation={navigation} title="전체 계좌 조회" />

      {/* Total Balance */}
      <Text style={styles.totalBalanceLabel}>총 잔액</Text>
      <Text style={styles.totalBalance}>{totalBalance.toLocaleString()}원</Text>

      {/* Transfer Button */}
      <View style={styles.transferButtonContainer}>
        <Button
          title="이체하기"
          onPress={() => {
            /* 이체하기 로직 */
          }}
        />
      </View>

      {/* Account List */}
      <FlatList
        data={accounts}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AccountDetailScreen", { account: item })
            }
          >
            <View style={styles.accountItem}>
              <Text style={styles.accountNumber}>{item.number}</Text>
              <Text style={styles.accountBalance}>
                {item.balance.toLocaleString()}원
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  totalBalanceLabel: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 20,
    marginBottom: 5,
  },
  totalBalance: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 20,
  },
  transferButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20, // 상하 간격 조정
    width: "60%", // 버튼의 너비를 조정하려면 이 값을 변경하세요.
    alignSelf: "center",
  },
  accountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  accountNumber: {
    alignSelf: "flex-start",
    flex: 1,
    marginBottom: 20, // 계좌번호를 위로 올립니다.
  },
  accountBalance: {
    alignSelf: "flex-end",
  },
  separator: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 10,
  },
});
