import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
} from "react-native";

import HeaderScreen from "../Header/HeaderScreen";
import { useSelector } from "react-redux";
import { accountTransfer } from "../../apis/accountapi";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";

const { width } = Dimensions.get("window");

export default function TransferDetailScreen({ navigation, route }) {
  const userTokenRefreshModalVisible = useSelector(
    (state) => state.user.userTokenRefreshModalVisible
  );
  // const { amount, receiverBank, receiverAccount } = route.params;
  const accessToken = useSelector((state) => state.user.accessToken);
  const userInfo = useSelector((state) => state.user.userInfo);
  // console.log(userInfo)
  const [amount, setAmount] = useState(route.params.amount);
  const [receiverName, setReceiverName] = useState(route.params.receiverName);
  const [receiverBank, setReceiverBank] = useState(route.params.receiverBank);
  const [receiverAccount, setReceiverAccount] = useState(
    route.params.receiverAccount
  );
  const [accountInfo, setAccountInfo] = useState(route.params.accountInfo);
  // console.log(accountInfo)

  const [receiverMemo, setReceiverMemo] = useState(userInfo.name);
  const [senderMemo, setSenderMemo] = useState(receiverName);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  // const [receiverName, setReceiverName] = useState("");

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [activeArrow, setActiveArrow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveArrow((prev) => {
        if (prev === 4) return 1; // 4 다음에는 1로 넘어갑니다.
        return (prev + 1) % 5;
      });
    }, 500); // 매 초마다 화살표 위치 변경

    return () => {
      clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌을 중지합니다.
    };
  }, []);

  const removeLast = () => {
    setPassword(password.slice(0, -1));
  };

  const appendAmount = (num) => {
    if (password.length < 4) {
      setPassword(password + num);
    }
  };

  const handleTransfer = () => {
    // 여기서 이체 로직을 처리합니다.
    console.log("Transfer completed!");
  };

  const onNumberPress = (num) => {
    if (password.length < 4) {
      setPassword(password + num);
    }
  };

  const onBackspacePress = () => {
    setPassword(password.slice(0, -1));
  };
  // 통장 표시 메모
  const handleReceiverMemoChange = (text) => {
    if (text.length <= 16) {
      setReceiverMemo(text);
    }
  };
  const handleSenderMemoChange = (text) => {
    if (text.length <= 16) {
      setSenderMemo(text);
    }
  };

  const canAccountTransfer = () => {
    switch (true) {
      case !amount:
        Alert.alert("이체불가", "이체 금액으로 0원을 이체할 수는 없습니다.");
        break;
      default:
        doAccountTransfer();
        break;
    }
  };

  const doAccountTransfer = async () => {
    const transferInfo = {
      senderAccountNumber: accountInfo.accountNumber,
      receiverAccountNumber: receiverAccount,
      password: password,
      amount: amount,
      // senderContent:userInfo.name,  // 이 부분 확인 필요
      // receiverContent:receiverName, // 이 부분 확인 필요
      senderContent: senderMemo, // 이렇게 보내야함
      receiverContent: receiverMemo, // 이렇게 보내야함
    };
    const response = await accountTransfer(transferInfo, accessToken);
    setPassword("");
    if (response.status === 200) {
      console.log("계좌 이체 성공");
      // navigation.navigate("AccountDetailScreen", {
      //   transferAmount: amount,
      //   receiverName: receiverName,
      // });
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "TransferCompleteScreen",
            params: {
              accountInfo: accountInfo,
              transferAmount: amount,
              receiverName: receiverName,
              senderAccountNumber: accountInfo.accountNumber,
              receiverAccountNumber: receiverAccount,
            },
          },
        ],
      });
    } else if (response.status === 400) {
      console.log("계좌 이체 실패");
    } else if (response.status === 401) {
      console.log("권한 없음으로 계좌 이체 실패");
    } else if (response.status === 402) {
      console.log("잔액 부족으로 계좌 이체 실패");
    } else if (response.status === 403) {
      console.log("계좌 소유주 불일치로 계좌 이체 실패");
    } else if (response.status === 423) {
      console.log("계좌 비밀번호 잠김으로 계좌 이체 실패");
      Alert.alert(
        "비밀번호 잠김",
        "계좌 비밀번호 잠김으로 계좌 이체에 실패하셨습니다."
      );
    } else if (response.status === 429) {
      console.log("계좌 비밀번호 형식 오류로 계좌 이체 실패");
      console.log("비밀번호틀림", response.data);
      Alert.alert("비밀번호 미일치", response.data);
    } else {
      console.log("오류 발생: 계좌 이체 실패");
    }
  };

  const pressNextButton = () => {
    if (receiverMemo && senderMemo) {
      setConfirmModalVisible(true);
    } else if (!receiverMemo && !senderMemo) {
      Alert.alert("", "통장 표시가 입력되어야 합니다.");
    } else if (!receiverMemo) {
      Alert.alert("", "받는 분 통장 표시가 입력되어야 합니다.");
    } else if (!senderMemo) {
      Alert.alert("", "내 통장 표시가 입력되어야 합니다.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <HeaderScreen navigation={navigation} title="계좌이체(3/3)" />
        <Text style={[styles.amountValueText, {}]}>
          {amount.toLocaleString()}원
        </Text>

        <Text style={styles.label}>받는분</Text>
        <Text style={styles.accountInfo}>
          {receiverBank} {receiverAccount}
        </Text>
        <View style={styles.separator} />

        <Text style={styles.receiveAccountLabel}>받는 분 통장 표시</Text>
        <TextInput
          style={styles.input}
          placeholder="받는 분 통장 표시"
          // onChangeText={setReceiverMemo}
          onChangeText={handleReceiverMemoChange}
          value={receiverMemo}
          // textAlign="center"
        />
        <View style={styles.separator} />

        <Text style={[styles.label, {}]}>내 통장 표시</Text>
        <TextInput
          style={styles.input}
          placeholder="내 통장 표시"
          onChangeText={handleSenderMemoChange}
          value={senderMemo}
          // textAlign="center"
        />
        <View style={styles.separator} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={confirmModalVisible}
          onRequestClose={() => {
            setConfirmModalVisible(false);
            setPassword("");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalContainer}>
              <View style={styles.closeButtonView}>
                <TouchableOpacity onPress={() => setConfirmModalVisible(false)}>
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.profileArrowsViewHorizontal}>
                <Image
                  source={require("../../assets/images/normal_podo.png")}
                  style={styles.profileImage}
                />

                <View style={styles.arrowsContainer}>
                  {Array(3)
                    .fill(0)
                    .map((_, idx) => {
                      let arrow = "▷";
                      if (activeArrow === 0 && idx === 0) arrow = "▶";
                      if (activeArrow === 1 && idx === 1) arrow = "▶";
                      if (activeArrow === 2 && idx === 2) arrow = "▶";
                      if (activeArrow === 3 && idx !== 2) arrow = "▷";
                      if (activeArrow === 4 && idx === 0) arrow = "▶";

                      return (
                        <Text key={idx} style={styles.arrowText}>
                          {arrow}
                        </Text>
                      );
                    })}
                </View>

                <Image
                  source={require("../../assets/images/normal_podo.png")}
                  style={styles.profileImage}
                />
              </View>

              <Text style={styles.transferText}>{receiverName} 님께</Text>
              <Text style={styles.amountText}>
                <Text style={styles.boldText}>{amount.toLocaleString()}</Text>
                원을 이체합니다.
              </Text>
              {/* <Text style={styles.bankInfoText}>포도은행 1588-4153</Text> */}

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setConfirmModalVisible(false);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.confirmButtonText}>이체</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setPassword("");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalContainer}>
              <View style={styles.passwordHeader}>
                <Text style={styles.passwordLabelText}>계좌비밀번호</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호(4자리) 입력"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                keyboardType="number-pad"
                showSoftInputOnFocus={false}
              />

              <View style={styles.numPad}>
                {[
                  ["1", "2", "3"],
                  ["4", "5", "6"],
                  ["7", "8", "9"],
                  ["", "0", "←"],
                ].map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.numRow}>
                    {row.map((num) => (
                      <TouchableOpacity
                        key={num}
                        style={styles.numButton}
                        onPress={() => {
                          if (num === "←") {
                            removeLast();
                          } else if (num !== "") {
                            appendAmount(num);
                          }
                        }}
                      >
                        <Text style={styles.numText}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setModalVisible(false);
                  // doAccountTransfer()
                  canAccountTransfer();
                  // navigation.navigate("TransferCompleteScreen", {
                  //   transferAmount: transferAmount,
                  //   receiverName: receiverName,
                  // });
                }}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      {/* <View style={styles.bottomContainer}> */}
      <TouchableOpacity
        style={styles.nextButton}
        color="purple"
        onPress={() => {
          pressNextButton();
        }}
      >
        <Text style={styles.confirmText}>다음</Text>
      </TouchableOpacity>
      {/* </View> */}
      {userTokenRefreshModalVisible && (
        <AccessTokenRefreshModalScreen navigation={navigation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  passwordLabelText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  amountValueText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    // marginTop: 100,
    // marginBottom: 50,
  },
  receiveAccountLabel: {
    fontSize: 16,
    marginTop: 70,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  accountInfo: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "grey",
    marginBottom: 20,
    width: width - 40,
  },
  input: {
    height: 40,
    borderColor: "transparent",
    borderBottomColor: "grey",
    // color: "black",
    borderWidth: 1,
    // marginBottom: 20,
    fontSize: 16,
    width: width - 40,
    textAlign: "left",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  // modalView: {
  //   width: "100%",
  //   backgroundColor: "white",
  //   padding: 20,
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  // },
  passwordInput: {
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  // row: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginBottom: 20,
  // },
  numPad: {
    flex: 1,
    justifyContent: "center",
  },
  numRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  numButton: {
    width: width / 3 - 40,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#e0e0e0",
    borderRadius: 5,
  },
  numText: {
    fontSize: 40,
  },
  nextButton: {
    // marginLeft: -30,
    // marginRight: -30,
    width: "100%",
    backgroundColor: "purple",
    padding: 15,
    alignItems: "center",

    borderRadius: 5,
    marginTop: 300,
  },
  confirmText: {
    fontSize: 18,
    color: "white",
  },
  // bottomContainer: {
  //   flex: 1,
  //   justifyContent: "flex-end",
  // },
  // modalTopView: {
  //   flex: 1,
  //   justifyContent: "flex-start",
  //   alignItems: "center",
  //   paddingTop: "10%",
  // },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    height: "60%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    justifyContent: "space-between",
  },
  closeButtonView: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 24,
  },
  profileArrowsViewHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "black",
  },
  arrowsContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
  },
  arrowText: {
    fontSize: 18,
    marginHorizontal: 5,
  },
  transferText: {
    fontSize: 18,
    marginTop: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  amountText: {
    fontSize: 18,
    marginTop: 15,
    textAlign: "center",
  },
  bankInfoText: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 30,
    textAlign: "center",
    color: "grey",
  },
  confirmButton: {
    backgroundColor: "purple",
    padding: 15,
    borderRadius: 5,
    alignSelf: "stretch",
    alignItems: "center",
    marginLeft: -30,
    marginRight: -30,
    marginBottom: -20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
  },
  boldText: {
    fontWeight: "bold",
  },
});
