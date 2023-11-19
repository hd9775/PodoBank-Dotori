import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HeaderScreen from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

export default function TransferAmountScreen({ navigation, route }) {
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  // const { receiverBank, accountInput } = route.params;
  const [receiverName, setReceiverName] = useState(route.params.receiverName) ;
  const [receiverBank, setReceiverBank] = useState(route.params.receiverBank) ;
  const [receiverAccount, setReceiverAccount] = useState(route.params.receiverAccount) ;
  const [accountInfo, setAccountInfo] = useState(route.params.accountInfo)
  console.log(accountInfo, receiverBank, receiverAccount)

  const [amount, setAmount] = useState(0);
  const [accountBalance] = useState(Math.floor(accountInfo.balance)); // 이 값은 실제 계좌 잔액에 따라 바뀌어야 합니다.

  const appendAmount = (value) => {
    setAmount((prevAmount) => {
      const newAmount = prevAmount * 10 + parseInt(value);
      return Math.min(newAmount, accountBalance);
    });
  };

  const setQuickAmount = (value) => {
    if (value === "전액") {
      setAmount(accountBalance);
    } else {
      const quickValues = {
        "100만": 1000000,
        "10만": 100000,
        "5만": 50000,
        "1만": 10000,
      };
      setAmount(Math.min(quickValues[value], accountBalance));
    }
  };
  //   console.log(receiverAccount + "11receiverAccount");

  // const appendAmount = (value) => {
  //   if (amount === "0원") {
  //     setAmount(`${value}원`);
  //   } else {
  //     setAmount(`${amount.slice(0, -1)}${value}원`);
  //   }
  // };

  // const removeLast = () => {
  //   if (amount.length > 2) {
  //     setAmount(`${amount.slice(0, -2)}`);
  //   } else {
  //     setAmount("0원");
  //   }
  // };

  // const formatCurrency = (value) => {
  //   return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
  // };

  // const appendAmount = (value) => {
  //   setAmount((prevAmount) => prevAmount * 10 + parseInt(value));
  // };
  const goTransferDetailScreen = () =>{
    switch (true) {
      case !amount:
        Alert.alert('이체불가','이체 금액으로 0원을 이체할 수는 없습니다.')
        break;
      case !accountBalance:
        Alert.alert('이체불가','출금 가능 금액이 없어 이체할 수 없습니다.')
        break;
      case amount > accountBalance:
        Alert.alert('이체불가','이체 금액이 출금 가능 금액보다 클 수는 없습니다.')
        break;
    
      default:
        navigation.navigate("TransferDetailScreen", {
          amount: amount,
          receiverName: receiverName,
          receiverBank: receiverBank,
          receiverAccount: receiverAccount,
            accountInfo: accountInfo,
        });
        break;
    }
  }

  const removeLast = () => {
    setAmount((prevAmount) => Math.floor(prevAmount / 10));
  };


  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <View style={styles.container}>
        <HeaderScreen navigation={navigation} title="계좌이체(2/3)" />

        {/* <Text style={styles.amountText}>{formatCurrency(amount)}</Text> */}
        <Text style={styles.amountText}>{amount.toLocaleString()}원</Text>
        <Text style={styles.balanceText}>
          {/* 출금 가능 금액: {formatCurrency(accountBalance)} */}
          출금 가능 금액: {accountBalance.toLocaleString()}원
        </Text>

        <View style={styles.quickSelect}>
          {["100만", "10만", "5만", "1만", "전액"].map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={styles.quickSelectButton}
              onPress={() => setQuickAmount(quickAmount)}
            >
              <Text>{quickAmount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.numPad}>
          {[
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            ["", "0", "←"],
          ].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.numRow}>
              {row.map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.numButton}
                  onPress={() => {
                    if (num === "←") {
                      removeLast();
                    } else if (num !== "") {
                      appendAmount(num);
                    }
                  }}
                >
                  <Text style={styles.numText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

      </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            goTransferDetailScreen()
            // navigation.navigate("TransferDetailScreen", {
            //   amount: amount,
            //   receiverName: receiverName,
            //   receiverBank: receiverBank,
            //   receiverAccount: receiverAccount,
            //   accountInfo: accountInfo,
            // });
          }}
        >
          <Text style={styles.confirmText}>확인</Text>
        </TouchableOpacity>
        {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  amountText: {
    fontSize: 36,
    textAlign: "center",
    marginVertical: 20,
  },
  balanceText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 50,
  },
  quickSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickSelectButton: {
    padding: 10,
  },
  numPad: {
    flex: 1,
    justifyContent: "center",
  },
  numRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  numButton: {
    width: width / 3 - 40,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
  },
  numText: {
    fontSize: 40,
  },
  confirmButton: {
    // marginLeft: -30,
    // marginRight: -30,
    width:'100%',
    backgroundColor: "purple",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  confirmText: {
    fontSize: 18,
    color: "white",
  },
});
