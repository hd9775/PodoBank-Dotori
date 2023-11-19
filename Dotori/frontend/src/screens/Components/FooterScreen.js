import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  AntDesign,
  FontAwesome5,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function FooterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("MainPageScreen")}
      >
        <AntDesign name="home" size={24} />
        <Text style={styles.iconText}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("PurposeScreen")}
      >

        <MaterialCommunityIcons
          name="target"
          size={24}
        ></MaterialCommunityIcons>
        <Text style={styles.iconText}>목표</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("RewardScreen")}
      >
        <SimpleLineIcons name="present" size={24}></SimpleLineIcons>
        <Text style={styles.iconText}>도토리</Text>
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
