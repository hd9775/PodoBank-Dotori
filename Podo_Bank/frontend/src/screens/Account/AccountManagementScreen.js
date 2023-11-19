import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import * as Clipboard from 'expo-clipboard';
// import Clipboard from '@react-native-clipboard/clipboard';

import { Ionicons, Feather } from "@expo/vector-icons";
import HeaderComponent from "../Header/HeaderScreen";
import {accountPasswordChange} from "../../apis/accountapi"
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

export default function AccountManagementScreen({ navigation, route }) {
  const accessToken = useSelector((state) => state.user.accessToken)
  const [account, setAccount] = useState(route.params.account)
  const [nickname, setNickname] = useState(route.params.nickname)
  console.log(account)

  // 비밀번호 숫자 4자리 맞는지 확인
  const validatePassword = (password) => {
    const regex = /^\d{4}$/;
    return regex.test(password);
  };

  const copyAccountNumber = async () => {
    try {
      await Clipboard.setStringAsync(account.accountNumber);
      console.log("계좌번호가 클립보드에 복사되었습니다.");
    } catch (error) {
      // 복사 실패 시 에러를 처리할 수 있습니다.
      console.error("계좌번호 복사 실패:", error);
    }
  }
  
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [thirdModalVisible, setThirdModalVisible] = useState(false);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const removeLast = () => {
    setPassword((prevPassword) => prevPassword.slice(0, -1));
  };

  const appendAmount = (num) => {
    if (password.length < 4) {
      setPassword((prevPassword) => prevPassword + num);
    }
  };

  const newRemoveLast = () => {
    setNewPassword((prevPassword) => prevPassword.slice(0, -1));
  };

  const newAppendAmount = (num) => {
    if (newPassword.length < 4) {
      setNewPassword((prevPassword) => prevPassword + num);
    }
  };

  const confirmRemoveLast = () => {
    setConfirmPassword((prevPassword) => prevPassword.slice(0, -1));
  };

  const confirmAppendAmount = (num) => {
    if (confirmPassword.length < 4) {
      setConfirmPassword((prevPassword) => prevPassword + num);
    }
  };

  const settingAccountNumber = (accountNumber) =>{
    return `${accountNumber.slice(0,4)}-${accountNumber.slice(4,6)}-${accountNumber.slice(6)}`
  }

  // 날짜를 "YYYY.MM.DD" 형식으로 변환하는 함수
  const formDateTransaction = (dateString) =>{
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    // return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
    return `${year}.${month}.${day}`;
  }


  const handleFirstPwModal = () =>{
    if (validatePassword(password)){
      setModalVisible(false);
      setSecondModalVisible(true);
    }else{
      Alert.alert("비밀번호 양식 오류", '비밀번호는 4자리 숫자입니다.')
    }
  }
  const handleSecondPwModal = () =>{
    const isValidatePassword = validatePassword(newPassword)
    switch (isValidatePassword) {
      case !isValidatePassword:
        Alert.alert("비밀번호 양식 오류", '비밀번호는 4자리 숫자입니다.')  
        break;
      case password === newPassword:
        Alert.alert("비밀번호 동일", '기존 비밀번호와 동일할 수 없습니다.')  
        break;
    
      default:
        setSecondModalVisible(false);
        setThirdModalVisible(true);
        break;
    }
  }
  
  const handleThirdPwModal = () =>{
    const isValidatePassword = validatePassword(confirmPassword)
    switch (isValidatePassword) {
      case !isValidatePassword:
        Alert.alert("비밀번호 양식 오류", '비밀번호는 4자리 숫자입니다.')  
        break;
      case newPassword !== confirmPassword:
        Alert.alert("비밀번호 미일치", '비밀번호가 일치하지 않습니다.')  
        setConfirmPassword("")
        break;
      case password === confirmPassword:
        Alert.alert("비밀번호 동일", '기존 비밀번호와 동일할 수 없습니다.')  
        break;
    
      default:
        // setThirdModalVisible(false);
        handleAccountPasswordChange()
        break;
    }
  }

  const handleAccountPasswordChange = async() => {
    const pwChangeInfo = {
      accountNumber:account.accountNumber,
      oldPassword:password,
      newPassword: confirmPassword
    }
    console.log(pwChangeInfo)
    const response =  await accountPasswordChange(pwChangeInfo, accessToken)
    if(response.status === 200){
      console.log('계좌 비밀번호 변경 성공')
      setThirdModalVisible(false);
      setPassword("")
      setNewPassword("")
      setConfirmPassword("")
      Alert.alert('비밀번호 변경 성공', '해당 계좌의 비밀번호가 변경 완료되었습니다.')
    }else if(response.status === 400){
      console.log('계좌 비밀번호 변경 실패')
    }else if(response.status === 401){
      console.log('권한 없음으로 계좌 비밀번호 변경 실패')
    }else if(response.status === 403){
      console.log('계좌 소유주 불일치로 계좌 비밀번호 변경 실패')
    }else if(response.status === 429){
      console.log('계좌 비밀번호 형식 오류로 계좌 비밀번호 변경 실패')
      Alert.alert('현재 계좌의 비밀번호를 다시 확인해주세요.')
    }else{
      console.log('오류발생: 계좌 비밀번호 변경 실패')
    }
  }

  const goToAccountWithdrawalScreen = () =>{
    const thisBalance =Math.floor(account.balance)
    console.log(typeof(thisBalance))
    if(thisBalance){
      Alert.alert('계좌 잔액 존재',`현재 ${settingAccountNumber(account.accountNumber)} 계좌에 잔액 보유 중으로 해지할 수 없습니다.${'\n'}${'\n'}잔액을 0원으로 만든 후 진행해주세요.`)
    }else{
      navigation.navigate("AccountWithdrawalScreen", {account:account})
    }
  }
  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderComponent title="거래내역조회" navigation={navigation} />

      <Text style={styles.bankName}>포도은행 - {nickname}</Text>
      <View style={styles.accountRow}>
        <Text style={styles.boldText}>{settingAccountNumber(account.accountNumber)}</Text>
        <TouchableOpacity
          onPress={()=>{copyAccountNumber()}}
          style={{ marginLeft: 10 }}
        >
          <Feather name="copy" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.frontText}>
        <View style={styles.row}>
          <Text style={styles.grayText}>잔액</Text>
          {account.balance?(<Text>{(Math.floor(account.balance)).toLocaleString()}원</Text>):(<Text>0원</Text>)}
        </View>

        <View style={styles.row}>
          <Text style={styles.grayText}>출금가능금액</Text>
          {account.balance?(<Text>{(Math.floor(account.balance)).toLocaleString()}원</Text>):(<Text>0원</Text>)}
        </View>

        <View style={styles.row}>
          <Text style={styles.grayText}>개설일</Text>
          {/* <Text>2017.08.04</Text> */}
          {account.createAt?(<Text>{formDateTransaction(account.createAt)}</Text>):(<Text>0000.00.00</Text>)}
        </View>
      </View>

      <View style={styles.separator} />

      <Text style={styles.management}>관리하기</Text>

      <TouchableOpacity
        style={styles.row}
        onPress={()=>{
          Alert.alert('', '차후 기능을 추가할 예정입니다. 기대해주세요❤')
        }}
      >
        <Text style={styles.backGrayText}>입출금 알림(Push)</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity 
        style={styles.row}
        onPress={()=>{
          Alert.alert('', '차후 기능을 추가할 예정입니다. 기대해주세요❤')
        }}
      >
        <Text style={styles.backGrayText}>자동이체</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>0건</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity
        style={styles.row}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.backGrayText}>계좌 비밀번호 변경</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.separator} />

      <TouchableOpacity
        style={styles.row}
        onPress={()=>{
          navigation.navigate("AccountResetPasswordOneScreen", {accountNumber:account.accountNumber});
        }}
      >
        <Text style={styles.backGrayText}>계좌 비밀번호 초기화</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.separator} />

      {/* <TouchableOpacity
        style={styles.row}
        // onPress={""}
      >
        <Text style={styles.backGrayText}>계좌 오류 해제</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={()=>{
          goToAccountWithdrawalScreen()
          // navigation.navigate("AccountWithdrawalScreen", {account:account})
        }}
      >
        <Text style={styles.deleteAccountText}>
          계좌를 해지하시려면 여기를 눌러주세요.
        </Text>
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false), setPassword(""), setNewPassword(""), setConfirmPassword("")
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.passwordLabelText}>현재 비밀번호</Text>
              <TouchableOpacity onPress={() => {setModalVisible(false), setPassword(""), setNewPassword(""), setConfirmPassword("")}}>
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
                handleFirstPwModal()
                // validatePasswovalidatePassword(password)
                // setModalVisible(false);
                // setSecondModalVisible(true);
              }}
            >
              <Text style={styles.confirmButtonText}>다음</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={secondModalVisible}
        onRequestClose={() => {
          setSecondModalVisible(false), setPassword(""), setNewPassword(""), setConfirmPassword("")
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.passwordLabelText}>변경 비밀번호</Text>
              <TouchableOpacity onPress={() => {setSecondModalVisible(false), setPassword(""), setNewPassword(""), setConfirmPassword("")}}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.passwordInput}
              placeholder="비밀번호(4자리) 입력"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={setNewPassword}
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
                          newRemoveLast();
                        } else if (num !== "") {
                          newAppendAmount(num);
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
                handleSecondPwModal()
                // setSecondModalVisible(false);
                // setThirdModalVisible(true);
              }}
            >
              <Text style={styles.confirmButtonText}>다음</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={thirdModalVisible}
        onRequestClose={() => {
          setThirdModalVisible(false), setPassword(""), setNewPassword(""), setConfirmPassword("")
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.passwordLabelText}>변경 비밀번호 확인</Text>
              <TouchableOpacity onPress={() => {setThirdModalVisible(false), setPassword(""), setNewPassword(""), setConfirmPassword("")}}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.passwordInput}
              placeholder="비밀번호(4자리) 입력"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
                          confirmRemoveLast();
                        } else if (num !== "") {
                          confirmAppendAmount(num);
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
                handleThirdPwModal()
                // setThirdModalVisible(false);
                // handleAccountPasswordChange()
              }}
            >
              <Text style={styles.confirmButtonText}>변경</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  frontText: {
    marginBottom: 30,
  },
  bankName: {
    textAlign: "left",
    fontSize: 16,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  grayText: {
    color: "gray",
  },
  backGrayText: {
    color: "gray",
    fontSize: 20,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    marginBottom: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  separator: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  management: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 15,
    marginTop: 15,
  },
  deleteAccountText: {
    color: "gray",
    fontSize: 12,
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
});