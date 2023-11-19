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

export default function PlanCreate3Screen({ navigation, route }) {
  // 토큰
  const grantType = useSelector((state) => {
    state.user.grantType;
  });
  const accessToken = useSelector((state) => {
    state.user.accessToken;
  });
  const refreshToken = useSelector((state) => {
    state.user.refreshToken;
  });
  const dispatch = useDispatch();
  // 그 외

  const [planInfo, setPlanInfo] = useState(route.params.planInfo);
  const [categoryGroupName, setCategoryGroupName] = useState("");
  const [categoryGroups, setCategoryGroups] = useState([]);

  const handleAddCategoryGroup = () => {
    if (categoryGroupName) {
      setCategoryGroups([...categoryGroups, categoryGroupName]);
      setCategoryGroupName("");
    }
  };
  const handleNextButton = () => {
    navigation.navigate("PlanCreate4Screen", {
      planInfo: { ...planInfo, categoryGroups: categoryGroups },
    });
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="계획 생성(3/5)"
        cancelNavi="MainPageScreen"
        navigation={navigation}
      ></HeaderComponent>
      <ScrollView style={styles.header}>
        <Text style={styles.title}>카테고리 그룹 등록</Text>
        <Text style={styles.subtitle}>
          카테고리를 모아서 저장할 그룹을 등록해주세요.
        </Text>
        <Text style={styles.inputText}>카테고리 그룹명</Text>
        <View style={styles.rowContainer}>
          <TextInput
            style={[styles.input, { flex: 4 }]}
            onChangeText={setCategoryGroupName}
            value={categoryGroupName}
            placeholder="예) 한달생활비, 의류비, 식비, 문화생활비 등"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddCategoryGroup}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowContainer}>
          <Text style={styles.inputBehindText}>15자 이내로 작성해주세요</Text>
        </View>

        <Text style={styles.inputText}>등록된 카테고리 그룹</Text>
        <View style={styles.categoriesContainer}>
          {categoryGroups.map((categoryGroupName, index) => (
            <View key={index} style={styles.categoryBox}>
              <Text style={styles.categoryText}>{categoryGroupName} </Text>
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
