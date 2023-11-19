import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Modal,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Calendar, LocaleConfig, markedDates } from "react-native-calendars";
import HeaderComponent from "../Components/HeaderScreen";
import { useDispatch, useSelector } from "react-redux";

LocaleConfig.locales["kr"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1.",
    "2.",
    "3.",
    "4.",
    "5.",
    "6.",
    "7.",
    "8.",
    "9.",
    "10.",
    "11.",
    "12.",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
};

LocaleConfig.defaultLocale = "kr";

export default function PurposeCreate1Screen({ navigation, route }) {
  // 토큰
  const grantType = useSelector((state) => state.user.grantType);
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  // 그 외

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentDay = String(currentDate.getDate()).padStart(2, "0");
  const todayDate = `${currentYear}-${currentMonth}-${currentDay}`;

  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectionCount, setSelectionCount] = useState(0);
  const [startingDate, setStartingDate] = useState(null);
  const [endingDate, setEndingDate] = useState(null);

  const [settingDateType, setSettingDateType] = useState("")

  const [planInfo, setPlanInfo] = useState({
    startedAt: null,
    endAt: null,
    accountSeq: route.params.accountSeq,
  });
  const [isValid, setIsValid] = useState(false);

  const periodSelect = () => {
    if (selectionCount <= 1) {
      setSelectionCount(selectionCount + 1);
    } else {
      setSelectionCount(0);
    }
  };
  const handleStartingDate = (date) => {
    if (selectionCount === 0) {
      setStartingDate(date);
    } else if (selectionCount === 2) {
      setStartingDate(null);
    }
  };
  const handleEndingDate = (date) => {
    if (selectionCount === 1) {
      const startDate = new Date(startingDate);
      const endDate = new Date(date);
      if (endDate >= startDate) {
        setEndingDate(date);
        periodSelect();
      } else {
        Alert.alert("종료 시점 오류", "종료일은 시작일보다 앞설 수 없습니다.");
      }
    } else {
      setEndingDate(null);
      periodSelect();
    }
  };
  const getDatesBetween = (startDate, endDate) => {
    let dates = [];
    let currentDate = new Date(startDate);
    const stopDate = new Date(endDate);

    while (currentDate <= stopDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const periodDates = getDatesBetween(startingDate, endingDate).map(
    (date) => date.toISOString().split("T")[0]
  );
  let markedDates = {};
  periodDates.forEach((date) => {
    if (date === startingDate) {
      markedDates[date] = {
        startingDay: true,
        color: "#50cebb",
        textColor: "white",
      };
    } else if (date === endingDate) {
      markedDates[date] = {
        endingDay: true,
        color: "#50cebb",
        textColor: "white",
      };
    } else {
      markedDates[date] = { color: "#70d7c7", textColor: "white" };
    }
  });

  const handleConfirmDates = () => {
    setPlanInfo({
      ...planInfo,
      startedAt: startingDate,
      endAt: endingDate,
    });
    setCalendarVisible(false);
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="계획 생성(1/5)"
        cancelNavi="MainPageScreen"
        navigation={navigation}
      ></HeaderComponent>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>계획 기간 설정하기</Text>
          <Text style={styles.subtitle}>
            계획 시작 날짜와 종료 날짜를 선택해주세요.
          </Text>

          <Text style={styles.dateText}>시작 날짜</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setCalendarVisible(true);
            }}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={planInfo.startedAt}
                editable={false}
              />
              <AntDesign name="calendar" size={24} color="black" />
            </View>
          </TouchableOpacity>

          <Text style={styles.dateText}>종료 날짜</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setCalendarVisible(true);
            }}
            disabled={
              !planInfo.startedAt || (planInfo.startedAt && planInfo.endAt)
            }
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input]}
                value={planInfo.endAt}
                editable={false}
              />
              <AntDesign
                name="calendar"
                size={24}
                color={
                  !planInfo.startedAt || (planInfo.startedAt && planInfo.endAt)
                    ? "#7B7B7B"
                    : "black"
                }
              />
            </View>
          </TouchableOpacity>

          {isCalendarVisible && (
            <View style={styles.centeredView}>
              <Modal
                animationType="none"
                transparent={true}
                visible={isCalendarVisible}
                onRequestClose={() => {
                  setCalendarVisible(false);
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignSelf: "center",
                    width: "80%",
                  }}
                >
                  <Calendar
                    minDate={todayDate}
                    theme={{
                      arrowColor: "#FF965C",
                      "stylesheet.day.basic": {
                      },

                      "stylesheet.calendar.header": {
                        dayTextAtIndex0: {
                          color: "red",
                        },
                        dayTextAtIndex1: {
                          color: "black",
                        },
                        dayTextAtIndex2: {
                          color: "black",
                        },
                        dayTextAtIndex3: {
                          color: "black",
                        },
                        dayTextAtIndex4: {
                          color: "black",
                        },
                        dayTextAtIndex5: {
                          color: "black",
                        },
                        dayTextAtIndex6: {
                          color: "blue",
                        },
                      },
                    }}
                    monthFormat="yyyy년 MM월"
                    locale={"kr"}
                    current={todayDate}
                    onDayPress={(day) => {
                      handleStartingDate(day.dateString);
                      handleEndingDate(day.dateString);
                    }}
                    markingType={"period"}
                    markedDates={
                      endingDate
                        ? endingDate === startingDate
                          ? {
                              [startingDate]: {
                                startingDay: true,
                                color: "#50cebb",
                                textColor: "white",
                                endingDay: true,
                              },
                            }
                          : markedDates
                        : {
                            [startingDate]: {
                              startingDay: true,
                              color: "#50cebb",
                              textColor: "white",
                              endingDay: true,
                            },
                          }
                    }
                  />

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      handleConfirmDates();
                    }}
                  >
                    <Text style={styles.buttonText}>설정</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                !startingDate || !endingDate ? "gray" : "#FF965C",
            },
          ]}
          onPress={() => {
            navigation.navigate("PlanCreate2Screen", {
              planInfo: planInfo,
            });
          }}
          disabled={!startingDate || !endingDate}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
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
  innerContainer: {
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
    marginBottom: 60,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BAC0CA",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 40,
    backgroundColor: "#D9D9D920",
    position: "relative",
  },
  input: {
    flex: 1,
    height: 20,
    padding: 0,
    fontSize: 16,
    color: "black",
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
  dateText: {
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});
