import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function PurposeEnd1Screen({ navigation, route }) {
  const [purposeData, setPurposeData] = useState(route.params.purposeData);

  const [purposeEndData, setPurposeEndData] = useState({
    purposeSeq: route.params.purposeData.purposeSeq,
    purposeSavings: route.params.purposeData.currentBalance,
    title: route.params.purposeData.title,
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="x" size={24} />
      </TouchableOpacity>

      <Text style={styles.titleText}>{purposeData.title}</Text>

      <Image
        style={styles.image}
        source={require("../../assets/images/Hamster/End1Hamster.png")}
      />

      <Text style={styles.achievedText}>달성 금액</Text>

      <Text style={styles.currentBalance}>
        {purposeData.currentBalance.toLocaleString()}원
      </Text>

      <Text style={styles.goalPeriodText}>목표 기간</Text>

      <Text style={styles.periodDates}>
        {purposeData.startedAt} ~ {purposeData.terminatedAt.slice(0,10)}
      </Text>

      <Text style={styles.goalAmountText}>목표 금액</Text>

      <Text style={styles.goalAmount}>
        {purposeData.goalAmount.toLocaleString()}원
      </Text>

      <TouchableOpacity
        style={styles.receiveButton}
        onPress={() =>
          navigation.navigate("PurposeEnd2Screen", {
            purposeData: purposeEndData,
          })
        }
      >
        <Text style={styles.receiveButtonText}>지급받기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: "#FFFFFF",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 40,
  },
  achievedText: {
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 10,
  },
  currentBalance: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ED4343",
    alignSelf: "center",
    marginBottom: 40,
  },
  goalPeriodText: {
    fontSize: 20,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  periodDates: {
    fontSize: 20,
    fontWeight: "bold",

    alignSelf: "center",
    marginBottom: 40,
  },
  goalAmountText: {
    fontSize: 20,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  goalAmount: {
    fontSize: 20,
    fontWeight: "bold",

    alignSelf: "flex-start",
    marginBottom: 30,
  },
  receiveButton: {
    alignSelf: "center",
    backgroundColor: "#FF965C",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    marginTop: 20,
  },
  receiveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});
