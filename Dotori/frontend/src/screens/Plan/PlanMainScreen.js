import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import FooterScreen from "../Components/FooterScreen";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { planInProgress } from "../../apis/planapi";

function ProgressBar({ current, target }) {
  const progress = 100 - (current / target) * 100;
  const displayedProgress = Math.floor(progress);
  let progressBarColor;
  if (displayedProgress >= 50) {
    progressBarColor = "#5F9DF7";
  } else if (displayedProgress >= 20) {
    progressBarColor = "#89D770";
  } else if (displayedProgress >= 0) {
    progressBarColor = "#FEDE16";
  } else {
    progressBarColor = "#ED4343";
  }
  const absoluteProgress = Math.abs(displayedProgress);

  return (
    <View style={styles.progressBarContainer}>
      <View
        style={{
          position: "absolute",
          left: displayedProgress < 0 ? `${100 - absoluteProgress}%` : 0,
          height: 17,
          borderRadius: 8.5,
          width: `${absoluteProgress}%`,
          backgroundColor: progressBarColor,
        }}
      ></View>
    </View>
  );
}

export default function PlanMainScreen({ navigation, route }) {
  // 토큰
  const grantType = useSelector((state) => state.user.grantType);
  const accessToken = useSelector((state) => state.user.accessToken);
  const [refreshing, setRefreshing] = useState(false);

  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  // 그 외
  const isFocused = useIsFocused();

  const onRefresh = async () => {
    setRefreshing(true)
    await doPlanInquiry()

    setRefreshing(false)
  };

  const accountName = route.params.accountTitle;
  const accountSeq = route.params.accountSeq;

  const [planInfo, setPlanInfo] = useState(null);
  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  const doPlanInquiry = async () => {
    try {
      const response = await planInProgress(accountSeq, accessToken, grantType);
      if (response.status === 200) {
        setPlanInfo(response.data);
      } else if (response.status === 404) {
        navigation.navigate("SavingPlanCompleteRecipeScreen", {
          accountName: accountName,
          accountSeq: accountSeq,
          planSeq: response.data,
        });
      } else {
      }
    } catch (error) {
    }
  };

  const renderPlans = () => {
    if (!planInfo) return <Text>Loading...</Text>;
    if (planInfo.activePlanList === null) return renderNoPlan();
    if (planInfo.activePlanList.length > 0) return renderActivePlans();
    return null;
  };

  useEffect(() => {
    if (isFocused) {
      doPlanInquiry();
    }
  }, [isFocused]);

  const currentDate = new Date();
  const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return ""; 

    const [dateOnly] = dateTimeStr.split("T"); 

    return dateOnly; 
  };

  return (
    <View style={styles.container}>
      {planInfo ? (
        planInfo.planSeq ? (
          <TouchableOpacity
            style={{ alignSelf: "flex-end", margin: 20, marginBottom: -40 }}
            onPress={() => {
              navigation.navigate("PlanManageScreen", {
                accountTitle: accountName,
                accountSeq: accountSeq,
                planSeq: planInfo.planSeq,
                accountBalance: planInfo.accountBalance,
                endAt: planInfo.endAt,
                startedAt: planInfo.startedAt,
              });
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>관리</Text>
          </TouchableOpacity>
        ) : null
      ) : null}
      <Text style={styles.accountName}>{accountName}</Text>
      <Text style={styles.accountMoney}>
        {planInfo ? formatNumber(planInfo.accountBalance) + "원" : "Loading..."}
      </Text>

      <View style={styles.divider}></View>
      {/* <View style={styles.innerContainer}> */}

      {planInfo && planInfo.state === "READY" && (
        <View style={styles.overlay}>
          <Image
            style={styles.overlayImage}
            source={require("../../assets/images/Hamster/OverlayHamster.png")}
          ></Image>
          <Text style={styles.overlayText}>계획은</Text>

          <Text style={styles.overlayText}>
            {formatDate(planInfo.startedAt)} 에
          </Text>
          <Text style={styles.overlayText}>시작합니다요</Text>
        </View>
      )}
      {/* 무계획 상태 */}
      {planInfo && planInfo.activePlanList === null ? (
        <>
          <Text style={styles.boldMessage}>새로운 계획을 생성하세요.</Text>
          <Text style={styles.message}>당신의 새로운 계획은 무엇인가요?</Text>
          <Image
            style={styles.image}
            source={require("../../assets/images/Hamster/PlanMainHamster.png")}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("PlanCreate1Screen", {
                accountSeq: accountSeq,
              });
            }}
          >
            <Text style={styles.buttonText}>계획 생성하기</Text>
          </TouchableOpacity>
        </>
      ) : planInfo &&
        planInfo.activePlanList &&
        planInfo.activePlanList.length > 0 ? (
        <>
          {/* status active 상태 */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.planContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.headerContainer}>
              <Text style={styles.endDate}>
                {formatDate(planInfo.endAt)} 종료 예정
              </Text>
              <TouchableOpacity
                style={styles.mailIconWrapper}
                onPress={() => {
                  navigation.navigate("PlanNotClassifyScreen", {
                    accountName: accountName,
                    planSeq: planInfo.planSeq,
                  });
                }}
              >
                <Image
                  style={styles.mailImage}
                  source={require("../../assets/images/mail-icon.png")}
                />
                {planInfo.unclassified > 0 && (
                  <View style={styles.notificationBubble}>
                    <Text style={styles.notificationText}>
                      {planInfo.unclassified}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryGroupButton}>
                <Text>카테고리 그룹</Text>
              </TouchableOpacity>
            </View>
            {planInfo.activePlanList.map((category, index) => {
              const percentage = Math.floor(
                100 - (category.currentBalance / category.goalAmount) * 100
              );
              let textColor;
              if (percentage >= 50) {
                textColor = "#5F9DF7";
              } else if (percentage >= 20) {
                textColor = "#89D770";
              } else if (percentage >= 0) {
                textColor = "#FEDE16";
              } else {
                textColor = "#ED4343";
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.categoryBox}
                  onPress={() => {
                    navigation.navigate("PlanCategoryScreen", {
                      planDetailSeq: category.planDetailSeq,
                    });
                  }}
                >
                  <View style={styles.categoryTop}>
                    <Text style={styles.categoryName}>{category.title}</Text>
                    <Text style={styles.currentMoney}>
                      {formatNumber(
                        category.goalAmount - category.currentBalance
                      )}
                      원
                    </Text>
                  </View>
                  <Text style={styles.categoryGroupName}>
                    {category.groupTitle}
                  </Text>
                  <View style={styles.rowContainer}>
                    <ProgressBar
                      current={category.currentBalance}
                      target={category.goalAmount}
                    />
                    <Text style={[styles.percentageText, { color: textColor }]}>
                      {percentage}%
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      ) : null}

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
    padding: 16,
  },
  planContainer: {
    // flex: 1,
    width: "90%",
    marginBottom: 80,
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#d1d1d1",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 30,
    marginTop: -30,
  },
  accountName: {
    fontSize: 18,
    marginBottom: 8,
    marginTop: 100,
  },
  accountMoney: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 100,
  },
  boldMessage: {
    fontSize: 22,
    fontWeight: "bold",

    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: 180,
    height: 200,
    marginBottom: 40,
    marginTop: 40,
  },
  mailIconWrapper: {
    position: "relative",
    width: 40,
    height: 40,
  },
  mailImage: {
    width: 40,
    height: 40,
  },
  notificationBubble: {
    position: "absolute",
    right: -5,
    top: 0,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FF965C",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: -20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  endDate: {
    color: "#777777",
  },
  categoryGroupButton: {
    backgroundColor: "#F2F5F8",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryBox: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    padding: 16,
    width: "100%",
    marginBottom: 10,

    elevation: 5,
    backgroundColor: "white",
    marginBottom: 20,
  },
  categoryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryName: {
    color: "#858585",
    fontWeight: "bold",
    fontSize: 18,
  },
  currentMoney: {
    color: "#858585",
    fontWeight: "bold",
    fontSize: 18,
  },
  categoryGroupName: {
    color: "#7B7B7B",
    fontSize: 12,
  },
  progressBarContainer: {
    height: 17,
    borderRadius: 8.5,
    backgroundColor: "#d1d1d1",
    marginTop: 30,
    flexDirection: "row",
    width: "85%",
  },
  progressBar: {
    height: 17,
    borderRadius: 8.5,
    backgroundColor: "blue",
  },
  progressBarText: {
    position: "absolute",
    right: 5,
    color: "white",
    fontWeight: "bold",
  },
  percentageText: {
    textAlign: "right",
    fontSize: 15,
    marginTop: 27,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlayImage: {
    height: 200,
    width: 200,
  },
  overlayText: {
    fontSize: 25,
    marginTop: 10,
  },
});
