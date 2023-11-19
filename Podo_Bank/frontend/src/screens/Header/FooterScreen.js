import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

export default function FooterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <AntDesign name="home" size={24} />
        <Text style={styles.iconText}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => {
          Alert.alert('', '차후 기능을 추가할 예정입니다. 기대해주세요❤')
          navigation.navigate("HomeScreen")
        }}
      >
        <Image
          style={{ width: 24, height: 24 }}
          source={require("../../assets/images/all-account.png")}
        ></Image>
        <Text style={styles.iconText}>전체계좌</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("AccountWhatMakeScreen")}
      >
        <Image
          style={{ width: 30, height: 24 }}
          source={require("../../assets/images/openAccount.png")}
        ></Image>
        {/* <FontAwesome5 name="file-invoice-dollar" size={24} color="black" /> */}
        <Text style={styles.iconText}>계좌개설</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("MyPageScreen")}
      >
        <AntDesign name="user" size={24} />
        <Text style={styles.iconText}>마이페이지</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 10,
  },
});
