import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";

import HeaderComponent from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";
import {
  userWithdrawal,
} from '../../apis/userapi'
import { useSelector, useDispatch } from 'react-redux';
import { inputAccessToken, inputRefreshToken } from '../../redux/slices/auth/user'

export default function WithdrawalScreen({ navigation, route }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [clickWithdrawalBtn, setIsClickWithdrawalBtn] = useState(false);              // 회원탈퇴 성공여부
  const [registeredMessage, setRegisteredMessage] = useState(""); // 회원탈퇴 버튼 클릭시 메시지
  const [userWithdrawalModalVisible, setUserWithdrawalModalVisible] = useState(false); // 회원탈퇴 마지막 모달창
  const accessToken = useSelector((state) => state.user.accessToken)
  const refreshToken = useSelector((state) => state.user.refreshToken)
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  const totalBalance = useSelector((state)=> state.account.totalBalance)  // 총 잔액
  const dispatch = useDispatch();

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (validatePassword(text)) {
      // setPasswordMessage("완벽합니당");
      setIsPasswordValid(true);
    } else {
      // setPasswordMessage("양식을 맞춰주세요!");
      setIsPasswordValid(false);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (text === password && isPasswordValid) {
      // setConfirmPasswordMessage("완벽합니당");
      setConfirmPasswordMessage("");
      setIsConfirmPasswordValid(true);
    } else {
      setConfirmPasswordMessage("비밀번호가 일치하지 않습니다");
      setIsConfirmPasswordValid(false);
    }
  };

  // 회원탈퇴
  const handleUserWithdrawal = async()=>{
    setIsClickWithdrawalBtn(true)
    console.log('되냐?', clickWithdrawalBtn)
    const response = await userWithdrawal(accessToken,confirmPassword)
    console.log('안되냐?', clickWithdrawalBtn)
    if(response.status==200){
      console.log('회원탈퇴 성공')
      // user Token null값으로 변경
      dispatch(inputAccessToken(null))
      dispatch(inputRefreshToken(null))
      setRegisteredMessage('회원 탈퇴가 완료되었습니다.')
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen', params: {},}],
      });
    }else if(response.status===400){
      console.log('회원탈퇴 실패')
      setRegisteredMessage('회원 탈퇴에 실패하셨습니다.')
    }else if(response.status===401){
      console.log('인증 실패')
      setRegisteredMessage('인증 실패')
    }else if(response.status===403){
      console.log('토큰 없음')
      setRegisteredMessage('토큰 없음')
    }else if(response.status===404){
      console.log('존재하지 않는 회원')
      setRegisteredMessage('존재하지 않는 회원입니다.')
    }else{
      console.log('오류발생 회원탈퇴 실패')
      setRegisteredMessage('진행 중 오류가 발생했습니다.')
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderComponent
        navigation={navigation}
        title="회원탈퇴"
      ></HeaderComponent>

      {/* 본인 인증 안내 */}
      <Text style={styles.boldText}>비밀번호를 입력해주세요</Text>

      <View style={styles.inputContainer}>
        <View style={styles.textRow}>
          <Text style={styles.inputText}>비밀번호</Text>
          {/* <Text style={styles.descriptionText}>
            영문, 숫자, 특수문자가 모두 들어간 8~16글자
          </Text> */}
        </View>

        <TextInput
          style={styles.input}
          onChangeText={handlePasswordChange}
          secureTextEntry={true}
          placeholder="비밀번호를 입력해 주세요."
        />
      </View>
      <Text
        style={{
          color: isPasswordValid ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {passwordMessage}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>비밀번호 확인</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleConfirmPasswordChange}
          secureTextEntry={true}
          placeholder="비밀번호를 한번 더 입력해 주세요."
        />
      </View>
      
      <Text
        style={{
          color: isConfirmPasswordValid ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {confirmPasswordMessage}
      </Text>
      <View>
        <Text
          style={{
            // color: clickWithdrawalBtn ? "blue" : "red",
            color: "red",
            alignSelf: 'center',
          }}
        >
          {registeredMessage}
        </Text>
      </View>
      

      <TouchableOpacity
        style={[
          styles.customButton,
          !(isPasswordValid && isConfirmPasswordValid) && {
            backgroundColor: "grey",
          },
        ]}
        // back에 회원가입 정보 보내야함
        onPress={() =>{
          setUserWithdrawalModalVisible(true)
        }}
        disabled={!(isPasswordValid && isConfirmPasswordValid)}
      >
        <Text style={styles.linkText}>회원 탈퇴</Text>
      </TouchableOpacity>
      {/* 회원탈퇴 마지막 확인창 */}
      <View style={styles.centeredView}>
        <Modal
          animationType="none"//slide, fade가 있음
          transparent={true}
          visible={userWithdrawalModalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            console.log('Modal has been closed.');
            setUserWithdrawalModalVisible(!userWithdrawalModalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView]}>
              <Text style={styles.modalText}>정말로 탈퇴하시겠습니까?</Text>
              <View style={{
                flexDirection: 'row', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 0,
              }}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose, {flex: 1, marginRight: 5 }]}
                  onPress={() => {
                    {!totalBalance?handleUserWithdrawal():Alert.alert('잔액 보유','잔액이 있어 탈퇴할 수 없습니다.')}
                    setUserWithdrawalModalVisible(!userWithdrawalModalVisible)
                  }}>
                  <Text style={[styles.textStyle,]}>예</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose, {flex: 1, marginLeft: 5 }]}
                  onPress={() => {
                    setUserWithdrawalModalVisible(!userWithdrawalModalVisible)
                  }}>
                  <Text style={[styles.textStyle,]}>아니오</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "white",
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  boldText: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 30,
    marginBottom: 30,
    marginRight: 30,
    marginLeft: 30,
  },
  inputText: {
    marginLeft: 30,
  },
  descriptionText: {
    color: "grey",
    marginLeft: 10,
    fontSize: 12,
  },
  inputContainer: {
    marginTop: 10,
    justifyContent: "flex-start",
  },
  inputRowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifyButton: {
    backgroundColor: "#A175FD",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginLeft: -10,
    height: 50,
    marginTop: -20,
  },
  verifyButtonText: {
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
    marginRight: 30,
    marginLeft: 30,
    marginBottom: 30,
    height: 50,
    textAlignVertical: "center",

    // 그림자 스타일 추가
    elevation: 5,
    backgroundColor: "white",
  },
  customButton: {
    backgroundColor: "#A175FD",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginRight: 30,
    marginLeft: 30,
    borderRadius: 5,
  },
  // 모달 창에 쓰이는 스타일
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
