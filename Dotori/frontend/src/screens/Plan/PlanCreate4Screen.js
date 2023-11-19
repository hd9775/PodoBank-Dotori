import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import HeaderComponent from "../Components/HeaderScreen";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { planClassifyChatGpt } from "../../apis/planapi";

export default function PlanCreate4Screen({ navigation, route }) {
  // 토큰
  const grantType = useSelector((state) => state.user.grantType);
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  // 그 외
  const { categorise, categoryGroups } = route.params.planInfo;

  const [isLoading, setIsLoading] = useState(false);

  const [planInfo, setPlanInfo] = useState(route.params.planInfo);
  const isFocused = useIsFocused();

  const [categoryData, setCategoryData] = useState(null);
  const [data, setData] = useState(categoryData);

  const doPlanClassifyChatGpt = async () => {
    setIsLoading(true);
    try {
      const payload = {
        categorise: categorise,
        categoryGroups: categoryGroups,
      };
      const response = await planClassifyChatGpt(
        payload,
        accessToken,
        grantType
      );
      if (response.status === 200) {
        setCategoryData(response.data);
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isFocused) {
      doPlanClassifyChatGpt();
    }
  }, [isFocused]);
  const renderItem = ({ item, index, drag, isActive }) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.categoryGroup,
          backgroundColor: isActive ? "#E0E0E0" : "transparent",
        }}
        onLongPress={drag}
      >
        <Text style={styles.inputText}>{item.categoryGroupName}</Text>
        <View style={styles.categoriesContainer}>
          {item.categories &&
            item.categories.map((category, idx) => (
              <View key={idx} style={styles.categoryBox}>
                <Text style={styles.categoryText}>
                  {category.categoryName} {formatNumber(category.targetAmount)}
                  원
                </Text>
              </View>
            ))}
        </View>
      </TouchableOpacity>
    );
  };

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };
  const handleNextButton = () => {
    navigation.navigate("PlanCreate5Screen", {
      planInfo: planInfo,
      categoryData: categoryData,
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Image
            style={styles.loadingImage}
            source={require("../../assets/images/Hamster/LoadingHamster.png")}
          ></Image>
          <ActivityIndicator size="large" color="#FF965C" />
          <Text style={styles.loadingText}>다람쥐가 열심히 분류 중입니다!</Text>
          <Text style={styles.loadingText}>조금만 기다려 주세용</Text>
        </View>
      ) : (
        <View style={styles.innerContainer}>
          <HeaderComponent
            title="계획 생성(4/5)"
            cancelNavi="MainPageScreen"
            navigation={navigation}
          ></HeaderComponent>
          <ScrollView style={styles.header}>
            <Text style={styles.title}>카테고리 분류</Text>
            <Text style={styles.subtitle}>
              카테고리 그룹과 카테고리를 확인해주세요.
            </Text>

            <View style={styles.center}>
              <Image
                style={styles.centerImage}
                source={require("../../assets/images/Hamster/PlanCreateHamster.png")}
              />
              <Text style={styles.questionText}>이 분류가 맞나요?</Text>
              <Text style={styles.moveText}>카테고리를 눌러서 옮겨보세요!</Text>
            </View>

            {categoryData &&
              categoryData.map((group, index) => (
                <View key={index} style={styles.categoryGroup}>
                  <Text style={styles.inputText}>
                    {group.categoryGroupName}
                  </Text>
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

          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={handleNextButton}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      )}
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
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  loadingImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    marginBottom: 20,
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
  inputText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#D9D9D920",
    borderWidth: 1,
    borderColor: "#BAC0CA",
    borderRadius: 10,
    padding: 10,
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
  },
  addButton: {
    flex: 1,
    backgroundColor: "#FF965C",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginLeft: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
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
