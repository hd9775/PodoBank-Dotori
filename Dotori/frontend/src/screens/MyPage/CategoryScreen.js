import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import HeaderComponent from "../Components/HeaderScreen";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { planCategoryList } from "../../apis/planapi"

const randomColors = [
  "#FFD700",
  "#FFA07A",
  "#FFC0CB",
  "#90EE90",
  "#87CEEB",
  "#FFB6C1",
  "#FF1493",
  "#DDA0DD",
  "#F0E68C",
  "#00CED1",
  "#FF6347",
  "#E0FFFF",
  "#F08080",
  "#FFDAB9",
  "#D8BFD8",
];

export default function CategoryScreen({ navigation }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외

  const [categoryList, setCategoryList] = useState([])
  
  const doPlanCategoryList = async () => {
    try{
      const response = await planCategoryList(accessToken, grantType)
      if(response.status === 200){
        setCategoryList(response.data)
      }else{
      }
    }catch(error){
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        {
          backgroundColor:
            randomColors[Math.floor(Math.random() * randomColors.length)],
        },
      ]}
      onPress={() =>
        navigation.navigate("CategorySettingScreen", {
          categorySeq: item.categorySeq,
          categoryTitle: item.categoryTitle,
        })
      }
    >
      <Text style={styles.categoryTitle}>{item.categoryTitle}</Text>
      <Text style={styles.categoryGroup}>{item.categoryGroup}</Text>
      <Image
        style={styles.arrowIcon}
        source={require("../../assets/icon/forward_arrow.png")}
      />
    </TouchableOpacity>
  );

  useEffect(()=>{
    doPlanCategoryList()
  }, [])

  return (
    <View style={styles.container}>
      <HeaderComponent title="카테고리 보기" navigation={navigation} cancelNavi="MyPageScreen"/>

      <View style={styles.titleContainer}>
        <View style={styles.rectangleContainer}>
          <View style={styles.smallRectangles}>
            <View
              style={[styles.smallRectangle, { backgroundColor: "#FFEEAD" }]}
            />
            <View
              style={[styles.smallRectangle, { backgroundColor: "#D9534F" }]}
            />
          </View>
          <View style={styles.smallRectangles}>
            <View
              style={[styles.smallRectangle, { backgroundColor: "#96CEB4" }]}
            />
            <View
              style={[styles.smallRectangle, { backgroundColor: "#FFAD60" }]}
            />
          </View>
        </View>
        <Text style={styles.titleText}>카테고리 </Text>
      </View>

      {categoryList.length
        ?(<FlatList
          data={categoryList}
          renderItem={renderItem}
          keyExtractor={(item) => item.categorySeq}
          contentContainerStyle={styles.categoryList}
          />)
        :(<View
          style={[
            styles.categoryItem,
            {
              backgroundColor:
                randomColors[Math.floor(Math.random() * randomColors.length)],
            },
          ]}
        >
          <Text style={styles.categoryTitle}>현재 등록된 카테고리가 없습니다.</Text>
        </View>)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 15,
  },
  arrowIcon: {
  },
  CategoryText: {
    fontSize: 24,
    flex: 1,
    textAlign: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "10%",
    marginTop: 30,
    marginBottom: 40,
  },
  smallRectangles: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  smallRectangle: {
    width: 12,
    height: 12,
    backgroundColor: "red",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
  },
  rectangleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 10,
    marginTop: 10,
  },
  titleText: {
    fontSize: 20,
    marginTop: -2,
    fontWeight: "bold",
  },
  categoryList: {
    alignItems: "center",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 15,
    borderRadius: 28,
    height: 50,
    width: "100%",
  },
  categoryTitle: {
    fontSize: 16,
    marginRight: "auto",
    marginLeft: "5%",
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
});
