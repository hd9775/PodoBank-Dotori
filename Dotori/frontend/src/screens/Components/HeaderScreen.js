import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";

export default function HeaderComponent({ navigation, title, cancelNavi }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => {navigation.goBack()}}>
        <FontAwesome name="angle-left" style={{ fontSize: 30 }}></FontAwesome>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>

      <TouchableOpacity onPress={() => navigation.navigate(cancelNavi)}>
        <Text>취소</Text>
      </TouchableOpacity>
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
