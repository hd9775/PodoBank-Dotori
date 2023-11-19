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
import { userInfoInquiry } from "../../apis/userapi";
import { useIsFocused } from "@react-navigation/native";
import { Alert } from "react-native";

const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export default function MainPageScreen({ navigation }) {
  // 토큰
  const grantType = useSelector((state) => state.user.grantType);
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  // 그 외
  const [accountList, setAccountList] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const isFocused = useIsFocused();

  const doAccountWholeInquiry = async () => {
    try {
      const response = await accountWholeInquiry(accessToken, grantType);
      if (response.status === 200) {
        setAccountList(response.data);
      } else {
      }
    } catch (error) {
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

  useEffect(() => {
    if (isFocused) {
      doAccountWholeInquiry();
      doUserInfoInquiry();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <FlatList
          data={accountList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <View></View>
                <Image
                  style={styles.logo}
                  source={require("../../assets/images/dotori_logo.png")}
                />
                <View></View>
              </View>

              <Text style={styles.title}>당신의 소비를 계획 해보세요!</Text>
              <Text style={styles.subtitle}>
                계좌를 등록하고 계획을 만들어 볼까요?
              </Text>

              <Image
                style={styles.rightImage}
                source={require("../../assets/images/Hamster/MainHamster.png")}
              />
            </>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bankContainer}
              onPress={() =>
                navigation.navigate("PlanMainScreen", {
                  accountSeq: item.accountSeq,
                  accountTitle: item.accountTitle,
                })
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
                style={styles.addButton}
                onPress={() => {
                  navigation.navigate("OneCent1Screen", {
                    userName: userInfo.userName,
                  });
                }}
              >
                <Text style={styles.addText}>+</Text>
              </TouchableOpacity>
              <View style={{ marginTop: 50 }}></View>
            </>
          }
          keyExtractor={(item) => item.accountSeq.toString()}
        />
      </View>

      <View style={styles.footer}>
        <FooterScreen navigation={navigation} />
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
  },
  subtitle: {
    fontSize: 16,
    color: "#7B7B7B",
    marginBottom: 20,
  },
  rightImage: {
    alignSelf: "flex-end",
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

  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCAF17",
    borderRadius: 15,
    height: 50,
    borderStyle: "dashed",
    marginVertical: 10,
  },
  addText: {
    color: "#FCAF17",
    fontSize: 24,
    fontWeight: "bold",
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
});
