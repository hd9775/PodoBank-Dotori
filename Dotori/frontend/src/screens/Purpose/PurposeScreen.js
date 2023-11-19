import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import FooterScreen from "../Components/FooterScreen";
import { useDispatch, useSelector } from "react-redux";
import { purposeGetList } from "../../apis/purposeapi";
import { useIsFocused } from "@react-navigation/native";

export default function PurposeScreen({ navigation }) {
  // 토큰
  const grantType = useSelector((state) => state.user.grantType);
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  // 그 외
  const isFocused = useIsFocused();

  const [currentTotalSavings, setcurrentTotalSavings] = useState(0);
  const [purposeList, setPurposeList] = useState([]);

  const data = [
    {
      id: "1",
      name: "목표1",
      currentAmount: 2500,
      targetAmount: 10000,
    },
    {
      id: "2",
      name: "목표2",
      currentAmount: 2500,
      targetAmount: 10000,
    },
  ];

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  const getRandomBorderColor = () => {
    const colors = ["#1DA9F8", "#30D71F", "#FF77E1"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const doPurposeGetList = async () => {
    try {
      const response = await purposeGetList(accessToken, grantType);
      if (response.status === 200) {
        setPurposeList(response.data.purposeList);
        setcurrentTotalSavings(response.data.currentTotalSavings);
      } else {
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (isFocused) {
      doPurposeGetList();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.topImage}
        source={require("../../assets/images/dotori_logo.png")}
      />

      <View style={styles.dateAmountContainer}>
        <TouchableOpacity>
          <Text style={styles.latest}>최신순</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.amount}>{currentTotalSavings}원</Text>
          <Text style={styles.currentSavings}>현재 저축액</Text>
        </View>
      </View>

      <View style={styles.middleImageContainer}>
        <Image
          style={styles.middleImage}
          source={require("../../assets/images/Hamster/PurposeHamster.png")}
        />
      </View>

      <View style={styles.divider}></View>

      <FlatList
        style={{ marginBottom: 80 }}
        data={purposeList}
        renderItem={({ item }) => {
          const borderColor = getRandomBorderColor();
          return (
            <TouchableOpacity
              style={[styles.targetContainer, { borderColor }]}
              onPress={() => {
                if (item.terminatedAt !== null) {
                  navigation.navigate("PurposeEnd1Screen", {
                    purposeData: item,
                  });
                } else {
                  navigation.navigate("PurposeDetailScreen", {
                    purposeSeq: item.purposeSeq,
                  });
                }
              }}
            >
              <Text style={styles.targetName}>{item.title}</Text>
              <View style={styles.rightAlignContainer}>
                <Text style={styles.currentAmount}>
                  {item.currentBalance.toLocaleString()}원
                </Text>
              </View>
              <View style={styles.targetAmounts}>
                <Text style={styles.targetAmountText}>목표 금액</Text>
                <View style={styles.rightAlignContainer}>
                  <Text style={styles.targetAmount}>
                    {item.goalAmount.toLocaleString()}원
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.purposeSeq}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("PurposeCreate1Screen")}
          >
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.footer}>
        <FooterScreen navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  topImage: {
    alignSelf: "center",
    marginTop: 20,
    resizeMode: "contain",
    width: 70,
    height: 70,
  },
  dateAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  latest: {
    backgroundColor: "#EFF3F6",
    borderRadius: 10,
    fontSize: 12,
    padding: 10,
  },
  amount: {
    fontSize: 20,
  },
  currentSavings: {
    color: "#9D9D9D",
    textAlign: "right",
  },
  middleImageContainer: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 1,
    top: "20%",
  },
  middleImage: {
    width: 100,
    height: 110,
  },
  divider: {
    marginTop: 115,
    height: 10,
    backgroundColor: "#FFF2DE",
    marginBottom: 30,
  },
  targetContainer: {
    borderRadius: 15,
    borderColor: "#A6A6A6",
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 15,
    marginTop: 20,
    flexDirection: "column",

    elevation: 5,
    backgroundColor: "white",
  },

  targetName: {
    marginBottom: 10,
    fontSize: 20,
    flex: 1,
  },

  rightAlignContainer: {
    alignItems: "flex-end",
    flex: 1,
  },

  currentAmount: {
    fontSize: 16,
    marginBottom: 10,
  },

  targetAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  targetAmountText: {
    fontSize: 12,
    flex: 1,
  },

  targetAmount: {
    fontSize: 12,
    textAlign: "right",
    flex: 1,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderColor: "#A6A6A6",
    borderWidth: 1,
    marginHorizontal: 15,
    height: 70,
    marginTop: 20,
    borderStyle: "dashed",
  },
  addText: {
    color: "#A6A6A6",
    fontSize: 24,
  },
});
