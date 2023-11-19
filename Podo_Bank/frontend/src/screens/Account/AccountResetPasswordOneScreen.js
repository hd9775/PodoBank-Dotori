import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import HeaderComponent from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";
import {
  userEmailDuplicationCheck,
} from '../../apis/userapi'
import {
  userAccountPwEmailVerificationSend, userAccountPwEmailVerificationCheck
} from '../../apis/accountapi'
import { useSelector } from "react-redux";

export default function AccountResetPasswordOneScreen({ navigation, route }) {
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  const [accountNumber, setAccountNumber] = useState(route.params.accountNumber)
  const [authenEmail, SetAuthenEmail] = useState(false);      // 이메일 인증버튼 활성화하는 변수
  const [emailCode, SetEmailCode] = useState("");   // 8자리의 인증번호
  const [isAuthenEmail, SetIsAuthenEmail] = useState(false);  // E-mail 인증 완료 여부를 나타내는 변수
  const [codeMessage, setCodeMessage] = useState("");         // 이메일 인증번호 시비 여부를 나타내는 메시지
  // 이메일 사용가능여부확인 코드
  const [isValidEmail, setIsValidEmail] = useState("");     // 양식에맞게 이메일 작성
  const [email, setEmail] = useState("");                   // 작성한 E-mail 주소
  const [emailMessage, setEmailMessage] = useState("");     // E-mail 사용가능 여부를 나타내는 메시지
  const [isDuplicated, setIsDuplicated] = useState(false)// E-mail 중복 여부를 나타내는 변수 true일때 사용 가능
  const [userInfo, setUserInfo] = useState({
    accountNumber:accountNumber,
    email: "",
    newPassword: "",
    successCode: "",
  })
  // 이메일 인증 카운트다운
  const [countdown, setCountdown] = useState(0); // 5분 = 300초
  const [startCountdown, setStartCountdown] = useState(false);
  // const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)


  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleEmailChange = (text) => {
    setEmail(text);
    if (validateEmail(text)) {
      setEmailMessage("");
      setIsValidEmail(true);
    } else {
      setEmailMessage("이메일 양식을 맞춰주세요!");
      setIsValidEmail(false);
    }
  };
  const handleUserEmailDuplicationCheck = async()=>{
    const response = await userEmailDuplicationCheck(email)
    if(response.status===200){
      console.log('존재하지 않는 아이디입니다.')
      setEmailMessage('존재하지 않는 아이디입니다.')
      setIsDuplicated(false)
    }
    else if(response.status===409){
      // console.log('중복되니 검사 가능')
      setIsDuplicated(true)
    }
    else if(response.status===422){
      setEmailMessage('아이디 형식이 잘못 되었습니다.')
      setIsDuplicated(false)
    }
    else{
      setEmailMessage('인증 간 오류가 발생했습니다.')
      setIsDuplicated(false)
    }
    return response
  }
  

  // 이메일 전송
  const handleUserAccountPwEmailVerificationSend = async()=>{
    const responseDuplicated = await handleUserEmailDuplicationCheck()
    if(responseDuplicated.status===409){
    // if(isDuplicated===false){
      const response = await userAccountPwEmailVerificationSend(email)
      if(response.status===200){
        console.log('이메일 전송 성공')
        setCountdown(300)
        setStartCountdown(true) // 카운트다운 시작을 알리는 변수
      }else if(response.status===400){
        console.log('이메일 전송 실패')
      }else if(response.status===422){
        console.log('이메일 형식 오류')
      }else if(response.status===429){
        console.log('재전송 대기중')
      }
    }
  }
  // 이메일 인증번호 확인
  const handleUserAccountPwEmailVerificationCheck = async()=>{
    const response = await userAccountPwEmailVerificationCheck(emailCode, email)
    if (response.status===400) {
      setCodeMessage("잘못된 인증번호입니다.");
      SetIsAuthenEmail(false);
    } else if(response.status===200){
      setCodeMessage("인증이 완료되었습니다.");
      console.log(response.data.successCode)
      SetIsAuthenEmail(true);
      setUserInfo((prev) => ({ ...prev, successCode: response.data.successCode }))
    }else{
      setCodeMessage("다시 시도해주세요.");
      SetIsAuthenEmail(false)
    }
  }

  useEffect(() => {
    let intervalId;
    
    if (startCountdown && countdown > 0 && !isAuthenEmail) {
        intervalId = setInterval(() => {
            setCountdown(countdown => countdown - 1)
        }, 1000)
    } else if (startCountdown===true && countdown === 0) {
        clearInterval(intervalId)
        // Alert.alert("인증시간 만료", "이메일 인증시간이 만료되었습니다.")
        setCodeMessage('이메일 인증시간이 만료되었습니다.')
    }

    return () => clearInterval(intervalId); // 컴포넌트 unmount 시 타이머 해제
  }, [startCountdown, countdown])

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderComponent
        navigation={navigation}
        title="계좌 비밀번호 초기화(1/2)"
      ></HeaderComponent>

      {/* 본인 인증 안내 */}
      {/* <Text style={styles.boldText}>계정 정보를 입력해주세요</Text> */}
      <Text style={styles.boldText}>본인 인증을 진행해주세요</Text>

      {/* 아이디-이메일 입력창 */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>아이디</Text>
        <View style={styles.inputRowContainer}>
          <TextInput
            style={[styles.input]}
            onChangeText={(text) =>{
              handleEmailChange(text)
              setUserInfo((prev) => ({ ...prev, email: text }))
            }}
            multiline={true}
            placeholder="본인 ID를 입력해주세요."
            keyboardType="email-address"
            editable={!isAuthenEmail} // 인증이 완료되면 수정불가
          />
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (!isValidEmail || isAuthenEmail) && {backgroundColor: "grey",},
            ]}
            
            onPress={() => {
              SetAuthenEmail(true);
              handleUserAccountPwEmailVerificationSend()
            }}
            disabled={isAuthenEmail}
          >
            <Text style={styles.verifyButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={{
          color: (isValidEmail&&isDuplicated) ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {emailMessage}
      </Text>

      {/* 이메일 인증번호 입력창 */}
      {(authenEmail&&isDuplicated) ? (
        <View style={[styles.inputContainer, { align: "flex-end" }]}>
          {/* <Text style={styles.inputText}>이메일 인증</Text> */}
          <View style={styles.inputRowContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => SetEmailCode(text)}
              placeholder="인증번호를 입력해주세요."
              keyboardType="number-pad" // 숫자로만 받는다는 가정하에 넘버패드로 받음
              maxLength={8}
              editable={!isAuthenEmail}
            />
            <TouchableOpacity
              // 차후 백과의 연동에서 인증번호 일치할때만 제대로 작동
              style={[
                styles.verifyButton,
                (!(emailCode.length == 8)||isAuthenEmail) && {
                  backgroundColor: "grey",
                },
              ]}
              disabled={(!(emailCode.length == 8)) || isAuthenEmail}
              onPress={()=>{
                handleUserAccountPwEmailVerificationCheck()
                // compareAuthenNum()
              }}
            >
              <Text style={styles.verifyButtonText}>인증</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center', // 중앙 정렬을 위해 추가
          marginHorizontal: 30, 
        }}
      >
        <Text
          style={{
            color: isAuthenEmail ? "blue" : "red",
            textAlign:'left',
            // flex: 1,
          }}
        >
          {codeMessage}
        </Text>
        {startCountdown?(
        <Text
          style={{
            textAlign:'right',
            // flex: 1,
          }}
        >
          {`${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? '0' : ''}${countdown % 60}`}
        </Text>)
        :<Text></Text>
        }
      </View>

      <TouchableOpacity
        style={[
          styles.customButton,
          (!isAuthenEmail||(countdown<=0)) && {
            backgroundColor: "grey",
          },
        ]}
        // back에 회원가입 정보 보내야함
        onPress={() =>{
          navigation.navigate("AccountResetPasswordTwoScreen", { userInfo: userInfo })
        }}
        disabled={!isAuthenEmail || (countdown<=0)}
      >
        <Text style={styles.linkText}>다음</Text>
      </TouchableOpacity>
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
    justifyContent: "space-between",
  },
  verifyButton: {
    backgroundColor: "#A175FD",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginLeft: -10,
    height: 50,
    marginRight: 30,
    marginTop: -20,
    justifyContent: "center",
  },
  verifyButtonText: {
    color: "black",
    // marginRight: 20,
  },
  input: {
    flex: 1,
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
    marginTop: 30,
    marginRight: 30,
    marginLeft: 30,
    borderRadius: 5,
  },
});
