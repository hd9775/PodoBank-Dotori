import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import HeaderComponent from "../Components/HeaderScreen";
import { useDispatch, useSelector } from "react-redux";

export default function PlanCreate2Screen({ navigation, route }) {

  const [planInfo, setPlanInfo] = useState(route.params.planInfo);
  const [categoryName, setCategoryName] = useState("");
  const [targetAmount, setTargetAmount] = useState();
  const [categorise, setCategorise] = useState([]);
  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };
  const handleAddCategory = () => {
    if (categoryName && targetAmount) {
      setCategorise([
        ...categorise,
        { categoryName: categoryName, targetAmount: parseInt(targetAmount) },
      ]);
      setCategoryName("");
      setTargetAmount();
    }
  };
  const handleNextButton = () => {
    navigation.navigate("PlanCreate3Screen", {
      planInfo: { ...planInfo, categorise: categorise },
    });
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="계획 생성(2/5)"
        cancelNavi="MainPageScreen"
        navigation={navigation}
      ></HeaderComponent>
      <ScrollView style={styles.header}>
        <Text style={styles.title}>카테고리 등록</Text>
        <Text style={styles.subtitle}>원하는 카테고리를 등록해주세요.</Text>
        <Text style={styles.inputText}>카테고리명</Text>

        <TextInput
          style={styles.input}
          onChangeText={setCategoryName}
          value={categoryName}
          placeholder=" 예) 커피값, 배달비, 숙박비 등"
        />
        <View style={styles.rowContainer}>
          <Text style={styles.inputBehindText}>
            15자 이내로 띄어쓰기 및 특수문자없이 작성해주세요.
          </Text>
        </View>

        <Text style={styles.inputText}>목표금액</Text>
        <View style={styles.rowContainer}>
          <TextInput
            style={[styles.input, { flex: 4 }]}
            onChangeText={setTargetAmount}
            value={targetAmount}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddCategory}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowContainer}>
          <Text style={styles.inputBehindText}>숫자만 입력해주세요.</Text>
        </View>

        <Text style={styles.inputText}>등록된 카테고리</Text>
        <View style={styles.categoriesContainer}>
          {categorise.map((category, index) => (
            <View key={index} style={styles.categoryBox}>
              <Text style={styles.categoryText}>{category.categoryName} </Text>
              <Text style={styles.categoryText}>
                {formatNumber(category.targetAmount)}원
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleNextButton}>
        <Text style={styles.buttonText}>다음</Text>
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
    justifyContent: "center",
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
  categoryText: {
    fontSize: 12,
  },
});
