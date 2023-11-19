import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FooterScreen from "../Components/FooterScreen";
import { useDispatch, useSelector } from "react-redux";
import { purposeEndSaving } from "../../apis/purposeapi";

export default function PurposeEnd4Screen({ navigation, route }) {
  // 토큰
  const grantType = useSelector((state) => state.user.grantType);
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  // 그 외

  const [purposeData, setPurposeData] = useState(route.params.purposeData);

  const handleConfirm = () => {
    doPurposeEndSaving();
  };

  const doPurposeEndSaving = async () => {
    try {
      const response = await purposeEndSaving(
        purposeData,
        accessToken,
        grantType
      );
      if (response.status === 200) {
        navigation.navigate("PurposeEnd5Screen", {
          title: purposeData.title,
        });
      } else {
      }
    } catch (error) {
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/images/Hamster/LightHamster.png")}
      />

      <View style={styles.box}>
        <Image
          style={styles.leftImage}
          source={require("../../assets/images/logo_podo.png")}
        />
        <Text style={styles.text}>{purposeData.accountNumber}</Text>
      </View>

      <Text style={styles.text}>해당 계좌로 저축액을 지급받을까요?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleConfirm();
        }}
      >
        <Text style={styles.buttonText}>지급받기</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <FooterScreen navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 180,
  },
  box: {
    width: "60%",
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    elevation: 4,
    padding: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    height: 55,
  },
  leftImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    color: "#000000",
  },
  button: {
    backgroundColor: "#FF965C",
    borderRadius: 8,
    width: "80%",
    height: 40,
    marginTop: 180,
    marginBottom: -100,
  },
  buttonText: {
    fontSize: 15,
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: "center",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: -20,
  },
});
