import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import HeaderScreen from "../Header/HeaderScreen";
import {accountOwnerInquiry} from "../../apis/accountapi"
import { useSelector } from "react-redux";
import {accountRecentTransfer, accountTransactionDetail} from "../../apis/accountapi"
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";

const { height, width } = Dimensions.get("window");

export default function TransferScreen({ navigation, route }) {
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  const accessToken = useSelector((state) => state.user.accessToken)
  const [accountNumber, setAccountNumber] = useState(route.params.accountNumber)
  // const [accountInfo, setAccountInfo] = useState(route.params.accountNumber)
  const [accountInfo, setAccountInfo] = useState(null)
  // console.log(account)

  const [modalVisible, setModalVisible] = useState(false);
  // const translateY = useRef(new Animated.Value(height)).current;
  const [receiverAccount, setReceiverAccount] = useState("");

  const [receiverBank, setReceiverBank] = useState("포도은행");
  const [availableAmount, setAvailableAmount] = useState(0); // 출금 가능 금액 state 추가
  const [recentWithdrawAccount, setRecentWithdrawAccount] = useState([])

  // 제작 키보드 관련 내용
  const removeLast = () => {
    setReceiverAccount((prevAccount) => prevAccount.slice(0, -1));
  };

  const appendAccount = (num) => {
    // if (password.length < 4) {
    setReceiverAccount((prevAccount) => prevAccount + num);
    // }
  };

  const handleKeyPress = (key) => {
    if (key === "←") {
      setReceiverAccount((prev) => prev.slice(0, -1));
    } else {
      setReceiverAccount((prev) => prev + key);
    }
  };

  // const openModal = () => {
  //   setModalVisible(true);
  //   Animated.timing(translateY, {
  //     toValue: height * 0.4,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // const closeModal = () => {
  //   Animated.timing(translateY, {
  //     toValue: height,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start(() => {
  //     setModalVisible(false);
  //   });
  // };
  // 계좌 번호 형식 맞추는 함수
  const settingAccountNumber = (accountNumber) =>{
    return `${accountNumber.slice(0,4)}-${accountNumber.slice(4,6)}-${accountNumber.slice(6)}`
  }

  const getAccountTransactionDetail = async()=>{
    const response = await accountTransactionDetail(accountNumber, accessToken)
    if(response.status===200){
      console.log('계좌 상세 조회 성공')
      setAccountInfo(response.data)
      setAvailableAmount((Math.floor(response.data.balance)).toLocaleString())
    }else if(response.status===400){
      console.log('계좌 상세 조회 실패')
      // Alert.alert('계좌 조회 실패', '해당 계좌 상세 조회에 실패했습니다.')
    }else if(response.status===401){
      console.log('권한 없음으로 계좌 상세 조회 실패')
      // Alert.alert('계좌 조회 실패', '권한이 없어 해당 계좌 상세 조회에 실패했습니다.')
    }else if(response.status===404){
      console.log('일치 계좌 없음으로 계좌 상세 조회 실패')
      // Alert.alert('계좌 조회 실패', '계좌가 없어 해당 계좌 상세 조회에 실패했습니다.')
    }else{
      console.log('오류 발생: 계좌 상세 조회 실패')
      // Alert.alert('계좌 조회 실패', '오류 발생으로 계좌 상세 조회 실패했습니다.')
    }
  }

  // 계좌 소유주 존재 여부 확인
  const checkAccountOwnerInquiry = async () => {
    if(receiverAccount === accountNumber){
      Alert.alert('동일 계좌', '송금 계좌와 수금 계좌는 동일할 수 없습니다.')
      setReceiverAccount("")
    }else if(!availableAmount){
      Alert.alert('계좌 잔액 부족', '보낼 수 있는 잔액이 없어 게좌 이체가 불가능합니다.')
    }else{
      const response = await accountOwnerInquiry(receiverAccount, accessToken)
      if(response.status===200){
        console.log('계좌 소유주 조회 성공')
        navigation.navigate("TransferAmountScreen", {
          receiverName: response.data,
          receiverBank: receiverBank,
          receiverAccount: receiverAccount,
          accountInfo: accountInfo,
        });
      }else if(response.status===400){
        console.log('계좌 소유주 조회 실패')
        Alert.alert('계좌 조회 실패', '해당 계좌 유무 조회에 실패했습니다.')
      }else if(response.status===401){
        console.log('권한 없음으로 계좌 소유주 조회 실패')
        Alert.alert('계좌 조회 실패', '권한이 없어 해당 계좌 유무 조회에 실패했습니다.')
      }else if(response.status===404){
        console.log('일치 계좌 없음으로 계좌 소유주 조회 실패')
        Alert.alert('계좌 조회 실패', '계좌가 없어 해당 계좌 유무 조회에 실패했습니다.')
      }else{
        console.log('오류 발생: 계좌 소유주 조회 실패')
        Alert.alert('계좌 조회 실패', '오류 발생으로 계좌 유무 조회 실패했습니다.')
      }
    }

    }

  // 최근 송금 계좌 조회
  const getAccountRecentTransfer = async ()=>{
    const response = await accountRecentTransfer(accountNumber, accessToken)
    if(response.status===200){
      console.log('최근 송금 계좌 조회 성공')
      setRecentWithdrawAccount(response.data)
      console.log(response.data)
    }else if(response.status===400){
      console.log('최근 송금 계좌 조회 실패')
    }else if(response.status===401){
      console.log('권한없음으로 최근 송금 계좌 조회 실패')
    }else if(response.status===403){
      console.log('계좌 소유주 불일치로 최근 송금 계좌 조회 실패')
    }else if(response.status===404){
      console.log('계좌없음으로 최근 송금 계좌 조회 실패')
    }else{
      console.log('오류발생: 최근 송금 계좌 조회 실패')
    }
  }

  useEffect(()=>{
    getAccountTransactionDetail()
    getAccountRecentTransfer()
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <HeaderScreen navigation={navigation} title="계좌이체(1/3)"></HeaderScreen>
      </View>
      <View style={{flexDirection:"row"}}>
        <Image
          source={require("../../assets/images/normal_podo.png")}
          style={styles.bankLogo}
        />
        <Text style={styles.leftAlignLabel}>포도은행</Text>
      </View>
      {/* <Text style={styles.boldLeftAlignLabel}>1235-4568-4532</Text> */}
      <Text style={styles.boldLeftAlignLabel}>{settingAccountNumber(accountNumber)}</Text>
      <Text style={styles.leftAlignLabel}>
        출금가능금액 {availableAmount}원
      </Text>

      <Text style={styles.receiverLabel}>받는분</Text>

      <Text style={styles.bankLabel}>{receiverBank}</Text>
      <View style={styles.line} />

      <TouchableOpacity
        style={styles.row}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.backGrayText, { color: receiverAccount ? 'black' : 'gray'}]}>{receiverAccount?receiverAccount:"계좌번호"}</Text>
      </TouchableOpacity>

      {/* 최근보낸 계좌 부분 */}
      <View style={styles.line} />
      <Text style={styles.centerLabel}>최근 보낸 계좌</Text>
      <View style={styles.line} />
      {recentWithdrawAccount.map((account, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            // setReceiverBank(account.bankName);
            setReceiverBank("포도은행");
            setReceiverAccount(account.accountNumber);
          }}
        >
          <View style={styles.accountItem}>
            <Image source={require("../../assets/images/normal_podo.png")} style={styles.profileImage} />
            <Text style={styles.accountName}>{account.accountName}</Text>
          </View>
          <View style={styles.accountItem}>
            {/* <Text style={styles.accountDetail}>{account.bankName}</Text> */}
            <Text style={styles.accountDetail}>포도은행</Text>
            <Text style={styles.accountNumber}>{account.accountNumber}</Text>
          </View>
          <View style={styles.line} />
        </TouchableOpacity>
      ))}
      {/* {recentAccounts.map((account, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setReceiverBank(account.bankName);
            setReceiverAccount(account.accountNumber);
          }}
        >
          <View style={styles.accountItem}>
            <Image source={account.profileImage} style={styles.profileImage} />
            <Text style={styles.accountName}>{account.name}</Text>
          </View>
          <View style={styles.accountItem}>
            <Text style={styles.accountDetail}>{account.bankName}</Text>
            <Text style={styles.accountNumber}>{account.accountNumber}</Text>
          </View>
          <View style={styles.line} />
        </TouchableOpacity>
      ))} */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false), setReceiverAccount("")
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.passwordLabelText}>계좌번호</Text>
              <TouchableOpacity onPress={() => {setModalVisible(false), setReceiverAccount("")}}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.passwordInput}
              placeholder="계좌번호 입력"
              value={receiverAccount}
              onChangeText={setReceiverAccount}
              keyboardType="number-pad"
              showSoftInputOnFocus={false}
              // editable={false}
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
                          appendAccount(num);
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
                checkAccountOwnerInquiry()
              }}
            >
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    paddingLeft: 30,
    paddingRight: 30,
  },
  headerContainer: {
    marginLeft: -10,
    marginRight: -10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    height: "70%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: "space-between",
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  passwordLabelText: {
    fontSize: 15,
    // fontWeight: "bold",
  },
  passwordInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#8F1414",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  profileImage: {
    width: 16,
    height: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  leftAlignLabel: {
    fontSize: 16,
    color: "#5A5A5A",
    textAlign: "left",
  },
  boldLeftAlignLabel: {
    fontSize: 16,
    textAlign: "left",
    fontWeight: "bold",
  },
  receiverLabel: {
    fontSize: 16,
    marginTop: 30,
  },
  backButton: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bankLabel: {
    fontSize: 16,
    textAlign: "left",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    fontSize: 16,
    borderColor: "transparent",
    borderBottomColor: "grey",
    borderWidth: 1,
    marginBottom: 10,
  },
  backGrayText: {
    color: "grey",
    height: 40,
    fontSize: 16,
  },
  line: {
    height: 1,
    backgroundColor: "grey",
    marginBottom: 20,
  },
  centerLabel: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
    marginBottom: 20,
  },

  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  accountName: {
    fontSize: 18,
    marginBottom: 5,
  },
  accountDetail: {
    fontSize: 16,
    marginRight: 10,
    marginLeft: 25,
    color: "gray",
  },
  accountNumber: {
    fontSize: 16,
    color: "gray",
  },
  closeButtonText: {
    fontSize: 24,
  },
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
    color: "#8F1414",
  },
  numText: {
    fontSize: 40,
  },
  confirmButton: {
    backgroundColor: "#842DC480",
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
  bankLogo: {
    width: 20,
    height: 20,
  },
});
