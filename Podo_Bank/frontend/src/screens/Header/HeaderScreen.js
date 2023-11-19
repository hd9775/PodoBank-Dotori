import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";

export default function HeaderComponent({
  navigation,
  title,
  showHome = true,
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => {navigation.goBack()}}>
        <FontAwesome name="angle-left" style={{ fontSize: 30 }}></FontAwesome>
        {/* <Text style={styles.backButton}>&lt;</Text> */}
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {showHome ? (
        <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
          <AntDesign name="home" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }}></View>
      )}
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
