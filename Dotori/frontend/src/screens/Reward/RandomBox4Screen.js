import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";

import FooterScreen from "../Components/FooterScreen";
import { useDispatch, useSelector } from "react-redux";
import { accountWholeInquiry } from "../../apis/accountapi";
import { userInfoInquiry, userKeepReward } from "../../apis/userapi";
import { useIsFocused } from "@react-navigation/native";
import { Alert } from "react-native";

const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export default function MainPageScreen({ navigation, route }) {
  // 토큰
  const grantType = useSelector((state) => state.user.grantType);
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  // 그 외
  const [accountList, setAccountList] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [selectedAccountName, setSelectedAccountName] = useState(null)
  const [prizeAmount, setPrizeAmount] = useState(route.params.prizeAmount)

  const isFocused = useIsFocused();

  const doAccountWholeInquiry = async () => {
    try {
      const response = await accountWholeInquiry(accessToken, grantType);
      if (response.status === 200) {
        setAccountList(response.data);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  const doUserInfoInquiry = async () => {
    try {
      const response = await userInfoInquiry(accessToken, grantType);
      if (response.status === 200) {
        setUserInfo(response.data);
      } else {
      }
    } catch (error) {
    }
  };

  const handleUserKeepReward = () => {
    if(!selectedAccount){
      Alert.alert("","당첨금을 이체할 계좌를 선택해 주세요.")
    }else{
      doUserKeepReward()
    }
  }

  const doUserKeepReward = async () => {
    const data = {
      accountSeq:selectedAccount,
      amount:prizeAmount
    }
    try{
      const response = await userKeepReward(data, accessToken, grantType)
      if (response.status == 200) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'RandomBoxCompleteScreen', params:{prizeAmount:prizeAmount, selectedAccountName:selectedAccountName } }],
        });
      } else {
      }
    }catch(error){
    }
  }

  useEffect(() => {
    if (isFocused) {
      doAccountWholeInquiry();
      doUserInfoInquiry();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={{flex:0.1}}></View>
      <View style={styles.innerContainer}>
        <FlatList
          data={accountList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>당첨금을 이체해요!</Text>
              <Text style={styles.subtitle}>
                어느 계좌로 이체 할까요?
              </Text>
              <Text style={{textAlign:'center', marginVertical:20, fontSize:18,}}>
                {selectedAccountName
                  ? `${selectedAccountName}에 입금해주세요!`
                  : "어느 곳으로 이체를 받을까~"
                }
              </Text>
            </>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bankContainer}
              onPress={() => {
                setSelectedAccount(item.accountSeq)
                setSelectedAccountName(item.accountTitle)
              }
              }
            >
              <View style={styles.imageText}>
                <Image
                  style={styles.bankIcon}
                  source={require("../../assets/images/logo_podo.png")}
                />
                <Text style={styles.bankName}>{item.accountTitle}</Text>
              </View>

              <View style={styles.bankTextContainer}>
                <View style={styles.balanceRow}>
                  <Text style={styles.bankSubtitle}>잔액</Text>
                  <Text style={styles.bankBalance}>
                    {formatNumber(item.currentBalance)}원
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <>
              <TouchableOpacity
                style={[
                  styles.button,
                ]}
                onPress={() => {
                  handleUserKeepReward()
                }}
              >
                <Text style={styles.buttonText}>저축하기</Text>
              </TouchableOpacity>
              <View style={{ marginTop: 50 }}></View>
            </>
          }
          keyExtractor={(item) => item.accountSeq.toString()}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  innerContainer: {
    paddingHorizontal: 20,
    flex:0.9
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginLeft: 30,
  },
  helpButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#BAC0CA",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  helpIcon: {
    fontSize: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 30,
    alignSelf:'center'
  },
  subtitle: {
    fontSize: 16,
    color: "#7B7B7B",
    marginBottom: 20,
    alignSelf:'center'
  },
  rightImage: {
    alignSelf: "center",
    width: 140,
    height: 120,
    marginBottom: 20,
  },
  imageText: { flexDirection: "row" },
  bankName: {
    marginTop: 6,
    fontSize: 18,
  },
  bankContainer: {
    borderWidth: 1,
    borderColor: "#FCAF17",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,

    elevation: 5,
    backgroundColor: "white",
  },
  bankIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },

  footer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: -20,
  },
  bankTextContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },

  bankBalance: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FF965C",
    borderRadius: 8,
    width: "100%",
    padding: 10,
    alignItems: "center",
    // marginTop: 35,
    marginTop: 15,
  },
  buttonText: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
});
