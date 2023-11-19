import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import HeaderComponent from "../Components/HeaderScreen";
import { useDispatch, useSelector } from "react-redux";
import { planNewRegister } from "../../apis/planapi";

export default function PlanCreate5Screen({ navigation, route }) {
  // 토큰
  const grantType = useSelector((state) => state.user.grantType);
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  // 그 외

  const [planInfo, setPlanInfo] = useState(route.params.planInfo);
  const [categoryData, setCategoryData] = useState(route.params.categoryData);
  const calculateTotalAmount = () => {
    if (!categoryData) return 0;
    return categoryData.reduce((groupAcc, group) => {
      return (
        groupAcc +
        group.categories.reduce(
          (catAcc, category) => catAcc + category.targetAmount,
          0
        )
      );
    }, 0);
  };
  const [totalAmount, setTotalAmount] = useState(calculateTotalAmount());

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  const handleNextButton = () => {
    doPlanNewRegister();
    navigation.navigate("PlanMainScreen", {
      accountSeq: planInfo.accountSeq,
    });
  };

  const doPlanNewRegister = async () => {
    try {
      const payload = {
        accountSeq: planInfo.accountSeq,
        startedAt: planInfo.startedAt.toString() + " 00:00:00",
        endAt: planInfo.endAt.toString() + " 00:00:00",
        categoryGroupList: categoryData,
      };
      
      const response = await planNewRegister(payload, accessToken, grantType);
      if (response.status === 200) {
        console.log("계획 생성 성공");
        setCategoryData(response.data);
      } else {
      }
    } catch (error) {
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="계획 생성(5/5)"
        cancelNavi="MainPageScreen"
        navigation={navigation}
      ></HeaderComponent>
      <ScrollView style={styles.header}>
        <Text style={styles.title}>계획 확인</Text>
        <Text style={styles.subtitle}>설정 내용을 확인해주세요.</Text>

        <View style={styles.center}>
          <View style={styles.rowContainer}>
            <Text style={styles.dateText}>시작 날짜</Text>
            <Text style={styles.dateNumText}>{planInfo.startedAt}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.dateText}>종료 날짜</Text>
            <Text style={styles.dateNumText}>{planInfo.endAt}</Text>
          </View>
        </View>

        {categoryData &&
          categoryData.map((group, index) => (
            <View key={index} style={styles.categoryGroup}>
              <Text style={styles.inputText}>{group.categoryGroupName}</Text>
              <View style={styles.categoriesContainer}>
                {group.categories.map((category, idx) => (
                  <View key={idx} style={styles.categoryBox}>
                    <Text style={styles.categoryText}>
                      {category.categoryName}{" "}
                      {formatNumber(category.targetAmount)}원
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

        <View style={styles.center}>
          <View style={styles.rowContainer}>
            <Text style={styles.dateText}>총 금액</Text>
            <Text style={styles.dateNumText}>
              {formatNumber(totalAmount)}원
            </Text>
          </View>
          <Text>이 계획기간동안 사용할 총 금액입니다!</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleNextButton}>
        <Text style={styles.buttonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    flex: 1,
    marginTop: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#7B7B7B",
    marginBottom: 40,
  },
  dateText: {
    fontSize: 20,
    marginRight: 40,
  },
  dateNumText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputText: {
    fontSize: 16,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 12,
  },
  button: {
    height: 50,
    backgroundColor: "#FF965C",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  inputBehindText: {
    color: "#7B7B7B",
    marginBottom: 40,
    fontSize: 12,
    marginLeft: 10,
  },
  rowContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  categoryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#BAC0CA",
    borderRadius: 20,
    padding: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  centerImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
  },
  moveText: {
    color: "#7B7B7B",
  },
  center: { justifyContent: "center", alignItems: "center" },
  categoryGroup: { marginBottom: 20 },
});
