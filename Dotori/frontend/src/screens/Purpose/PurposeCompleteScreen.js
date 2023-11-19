import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function PurposeCompleteScreen({ navigation, route }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외

  const [name,setName] = useState(route.params.name);
  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Image
          style={styles.centerImage}
          source={require("../../assets/images/Hamster/PurposeCompleteHamster.png")}
        />
        <Text style={styles.boldText}>{name}</Text>
        <Text style={styles.regularText}>목표를 생성하였습니다!</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PurposeScreen")}
      >
        <Text style={styles.buttonText}>목표 확인하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 40,
    backgroundColor: "white",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerImage: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 10,
  },
  regularText: {
    fontSize: 25,
  },

  button: {
    height: 40,
    backgroundColor: "#FF965C",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
