import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import Feather from "react-native-vector-icons/Feather"; // Feather 아이콘을 가져올 수 있는 라이브러리
import { useDispatch, useSelector } from "react-redux";
import { purposeDetail } from "../../apis/purposeapi"

const tmpData = {"currentBalance": 230, "endAt": "2024-02-28", "goalAmount": 512000, 
"purposeDataList": [
  {"dataAmount": 1, "dataCreatedAt": "2023-09-27 23:02:51", "dataCurrentBalance": 1, "dataName": "진성갓2계좌"},
{"dataAmount": 2, "dataCreatedAt": "2023-09-27 23:03:00", "dataCurrentBalance": 2, "dataName": "진성갓2계좌"},
{"dataAmount": 3, "dataCreatedAt": "2023-09-30 23:03:09", "dataCurrentBalance": 3, "dataName": "진성갓2계좌"},
{"dataAmount": 4, "dataCreatedAt": "2023-10-01 23:03:18", "dataCurrentBalance": 4, "dataName": "진성갓2계좌"},
{"dataAmount": 5, "dataCreatedAt": "2023-10-25 23:03:27", "dataCurrentBalance": 5, "dataName": "진성갓2계좌"},
{"dataAmount": 6, "dataCreatedAt": "2023-10-28 23:03:36", "dataCurrentBalance": 6, "dataName": "진성갓2계좌"},
{"dataAmount": 7, "dataCreatedAt": "2023-11-05 23:03:45", "dataCurrentBalance": 7, "dataName": "진성갓2계좌"},
{"dataAmount": 8, "dataCreatedAt": "2023-11-09 23:03:54", "dataCurrentBalance": 8, "dataName": "진성갓2계좌"},
{"dataAmount": 9, "dataCreatedAt": "2023-11-24 23:04:03", "dataCurrentBalance": 9, "dataName": "진성갓2계좌"},
{"dataAmount": 10, "dataCreatedAt": "2023-12-01 23:04:12", "dataCurrentBalance": 10, "dataName": "진성갓2계좌"},
{"dataAmount": 11, "dataCreatedAt": "2023-12-02 23:04:21", "dataCurrentBalance": 11, "dataName": "진성갓2계좌"},
{"dataAmount": 12, "dataCreatedAt": "2023-12-05 23:04:30", "dataCurrentBalance": 12, "dataName": "진성갓2계좌"},
{"dataAmount": 13, "dataCreatedAt": "2023-12-07 23:04:39", "dataCurrentBalance": 13, "dataName": "진성갓2계좌"},
{"dataAmount": 14, "dataCreatedAt": "2023-12-14 23:04:48", "dataCurrentBalance": 14, "dataName": "진성갓2계좌"},
{"dataAmount": 15, "dataCreatedAt": "2023-12-14 23:04:57", "dataCurrentBalance": 15, "dataName": "진성갓2계좌"},
{"dataAmount": 16, "dataCreatedAt": "2023-12-14 23:05:06", "dataCurrentBalance": 16, "dataName": "진성갓2계좌"},
{"dataAmount": 17, "dataCreatedAt": "2023-12-14 23:05:15", "dataCurrentBalance": 17, "dataName": "진성갓2계좌"},
{"dataAmount": 18, "dataCreatedAt": "2023-12-14 23:05:24", "dataCurrentBalance": 18, "dataName": "진성갓2계좌"},
{"dataAmount": 19, "dataCreatedAt": "2023-12-14 23:05:33", "dataCurrentBalance": 19, "dataName": "진성갓2계좌"},
{"dataAmount": 20, "dataCreatedAt": "2023-12-14 23:05:42", "dataCurrentBalance": 20, "dataName": "진성갓2계좌"},
{"dataAmount": 21, "dataCreatedAt": "2024-01-14 23:05:42", "dataCurrentBalance": 21, "dataName": "진성갓2계좌"},
{"dataAmount": 22, "dataCreatedAt": "2024-02-14 23:05:42", "dataCurrentBalance": 22, "dataName": "진성갓2계좌"},
{"dataAmount": 23, "dataCreatedAt": "2024-03-14 23:05:42", "dataCurrentBalance": 23, "dataName": "진성갓2계좌"},
{"dataAmount": 24, "dataCreatedAt": "2024-04-14 23:05:42", "dataCurrentBalance": 24, "dataName": "진성갓2계좌"},
{"dataAmount": 25, "dataCreatedAt": "2024-05-14 23:05:42", "dataCurrentBalance": 50, "dataName": "진성갓2계좌"},
{"dataAmount": 26, "dataCreatedAt": "2024-06-14 23:05:42", "dataCurrentBalance": 21, "dataName": "진성갓2계좌"},
{"dataAmount": 27, "dataCreatedAt": "2024-07-14 23:05:42", "dataCurrentBalance": 18, "dataName": "진성갓2계좌"},
], "purposeTitle": "노트북구매할거야", "startedAt": "2023-09-27"}




export default function PurposeDetailScreen({ navigation, route }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외

  const isFocused = useIsFocused()
  const [purposeSeq, setPurposeSeq] = useState(route.params.purposeSeq)
  const [purposeDetailData, setPurposeDetailData] = useState({})

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${formattedHours}:${formattedMinutes}`;
  }

  const [dateGroups, setDateGroups] = useState({});

  const groupingDate = (data) => {
    const newDateGroups = { ...dateGroups };
    data.purposeDataList.forEach((item) => {
      const dateKey = formatDate(item.dataCreatedAt);
      if (!newDateGroups[dateKey]) {
        newDateGroups[dateKey] = [];
      }
      newDateGroups[dateKey].push(item);
    });

    setDateGroups(newDateGroups);
  };

  const handleData = (data) => {
    setPurposeDetailData(data)
    if(!purposeDetailData.purposeDataList){
      groupingDate(data)
    }
  }


  const doPurposeDetail = async () =>{
    try{
      const response = await purposeDetail(purposeSeq, accessToken, grantType)
      if(response.status===200){
        console.log("목표 상세 조회 성공")
        handleData(response.data)
      }else{
        console.log("목표 상세 조회 실패", response.status)
      }
    }catch(error){
      console.log("목표 상세 조회 실패", error)
    }
  }
  

  useEffect(()=>{
    if(isFocused){
      doPurposeDetail()
    }
  }, [isFocused])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, }} />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={30} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.purposeTitle}>{purposeDetailData.purposeTitle}</Text>
        <Text style={styles.titleRight}>{purposeDetailData.currentBalance ? purposeDetailData.currentBalance.toLocaleString() : purposeDetailData.currentBalance}원</Text>
      <Text style={styles.goalAmountText}>목표 금액</Text>
      <Text style={styles.goalAmount}>{purposeDetailData.goalAmount ? purposeDetailData.goalAmount.toLocaleString() : purposeDetailData.goalAmount}원</Text>
      </View>

      <View style={styles.divider} />

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(dateGroups).map(([date, items]) => (
          <View style={styles.dateGroup} key={date}>
            <Text style={styles.dateText}>{date}</Text>
            {items.map((item) => (
              <View style={styles.dataBox} key={`${item.dataCreatedAt}-${item.dataAmount}-${item.dataCurrentBalance}`}>
                <View style={styles.dataBoxInTop}key={`${item.dataCreatedAt}-${item.dataAmount}-${item.dataCurrentBalance}`}>
                  <Text style={styles.timeText}>{formatTime(item.dataCreatedAt)}</Text>
                  <Text style={styles.dataNameText}>{item.dataName}</Text>
                  <Text style={styles.dataAmountText}>{item.dataAmount ? item.dataAmount.toLocaleString():item.dataAmount}원</Text>
                </View>
                <View style={styles.dataBoxInBottom}>
                  <Text style={styles.dataCurrentBalanceText}>{item.dataCurrentBalance ? item.dataCurrentBalance.toLocaleString() : item.dataCurrentBalance}원</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.purposeStopContainer}>
          <TouchableOpacity
            style={styles.stopPurposeButton}
            onPress={() => {
              navigation.navigate("PurposeStopScreen", {purposeSeq:purposeSeq, purposeDetailData:purposeDetailData})
            }}
            
          >
            <Text style={styles.stopPurposeText}>그래프로 보기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    justifyContent: "flex-end",
    paddingVertical: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  titleContainer: {
    width: "90%",
    alignItems: "left",
    marginBottom: 20,
  },
  purposeTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  titleRight: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF965C",
    alignSelf: "flex-end",
  },
  goalAmountText: {
    fontSize: 15,
    marginBottom: 5,
  },
  goalAmount: {
    fontSize: 15,
    fontWeight: "bold",
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: "#D0D4DA",
    marginBottom: 10,
  },
  scrollContainer: {
    marginTop: 20,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dateContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  dataBox: {
    width: "100%",
    height: 80,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D0D4DA",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  dataBoxInTop: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    alignSelf: "center",
    marginRight: 13,
  },
  dataNameText: {
    fontSize: 15,
    flex: 1,
    alignSelf: "center",
  },
  dataAmountText: {
    fontSize: 15,
    alignSelf: "center",
  },
  dataBoxInBottom: {
    fontSize: 15,
    width: "90%",
    flexDirection: "row",
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  dataCurrentBalanceText: {
    fontSize: 13,
    alignSelf: "flex-end",
    color: "#858585",
  },
  closeIcon: {
    marginRight: 20,
  },
  purposeStopContainer: {
    width: "90%",
    alignItems: "flex-end",
    justifyContent: "center",
    margin: 20,
  },
  stopPurposeButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  stopPurposeText: {
    fontSize: 13,
    color: "#939393",
  },
});
