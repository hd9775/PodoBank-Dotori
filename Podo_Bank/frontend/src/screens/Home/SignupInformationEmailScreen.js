import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import HeaderComponent from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";
import {
  userEmailVerificationCheck, userEmailVerificationSend, userEmailDuplicationCheck
} from '../../apis/userapi'
import { useSelector } from "react-redux";

export default function SignupInformationEmailScreen({ navigation, route }) {
  const [userInfo, setUserInfo] = useState(route.params.userInfo);  // 회원가입하면서 router를 통해 가져오고 있는 userInfo
  const [authenEmail, SetAuthenEmail] = useState(false);      // 이메일 인증버튼 활성화하는 변수
  const [emailCode, SetEmailCode] = useState("");   // 8자리의 인증번호
  const [isAuthenEmail, SetIsAuthenEmail] = useState(false);  // E-mail 인증 완료 여부를 나타내는 변수
  const [codeMessage, setCodeMessage] = useState("");         // 이메일 인증번호 시비 여부를 나타내는 메시지
  // 이메일 사용가능여부확인 코드
  const [isValidEmail, setIsValidEmail] = useState("");     // 양식에맞게 이메일 작성
  const [isCorrectEmail, setIsCorrectEmail] = useState(""); // 사용가능한 이메일여부 확인
  const [email, setEmail] = useState("");                   // 작성한 E-mail 주소
  const [emailMessage, setEmailMessage] = useState("");     // E-mail 사용가능 여부를 나타내는 메시지
  // 이메일 인증 카운트 다운
  const [countdown, setCountdown] = useState(0); // 5분 = 300초\
  const [startCountdown, setStartCountdown] = useState(false);

  // const [emailDuplicatedCheck, setEmailDuplicatedCheck] = useState(null)  // 이메일 중복확인 결과
  // const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleEmailChange = (text) => {
    setEmail(text);
    if (validateEmail(text)) {
      setEmailMessage("사용 가능한 이메일입니다.");
      setIsValidEmail(true);
      // setEmailDuplicatedCheck(null); // 초기화: 이메일 양식이 올바르므로 중복 확인을 다시 해야 함
      // setIsCorrectEmail(null);
    } else {
      setEmailMessage("이메일 양식을 맞춰주세요!");
      setIsValidEmail(false);
      // setEmailDuplicatedCheck(null); // 초기화: 이메일 양식이 올바르지 않으므로 중복 확인을 다시 해야 함
      // setIsCorrectEmail(null);
    }
  };
  
  const hanldeUserEmailDuplicationCheck = async (text) => {
    if (validateEmail(text)) {
      const response = await userEmailDuplicationCheck(text);
      if (response.status === 200) {
        setEmailMessage("사용 가능한 이메일입니다.");
        // setEmailDuplicatedCheck(true);
        setIsCorrectEmail(true);
      } else if (response.status === 409) {
        setEmailMessage("이미 사용 중인 이메일입니다.");
        // setEmailDuplicatedCheck(false);
        setIsCorrectEmail(false);
      } else if (response.status === 422){
        setEmailMessage("이메일 양식을 맞춰주세요!");
        // setEmailDuplicatedCheck(null);
        setIsCorrectEmail(false);
      } else {
        setEmailMessage("서버 오류로 중복 확인에 실패했습니다.");
        // setEmailDuplicatedCheck(null);
        setIsCorrectEmail(null);
      }
    } else {
      setEmailMessage("이메일 양식을 맞춰주세요!");
      // setEmailDuplicatedCheck(null);
      setIsCorrectEmail(null);
    }
  };

  // 이메일 전송
  const handleUserEmailVerificationSend = async()=>{
    const response = await userEmailVerificationSend(email)
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
  // 이메일 인증번호 확인
  const handleUserEmailVerificationCheck = async()=>{
    const response = await userEmailVerificationCheck(emailCode, email, "REGISTER")
    if (response.status===400) {
      setCodeMessage("잘못된 인증번호입니다.");
      SetIsAuthenEmail(false);
    } else if(response.status===200){
      setCodeMessage("인증이 완료되었습니다.");
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
        title="회원가입(2/3)"
      ></HeaderComponent>

      {/* 본인 인증 안내 */}
      {/* <Text style={styles.boldText}>계정 정보를 입력해주세요</Text> */}
      <Text style={styles.boldText}>이메일을 입력해주세요</Text>

      {/* 이메일 입력창 */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>이메일</Text>
        <View style={styles.inputRowContainer}>
          <TextInput
            style={[styles.input]}
            onChangeText={(text) =>{
              handleEmailChange(text)
              {hanldeUserEmailDuplicationCheck(text) && isValidEmail}
              setUserInfo((prev) => ({ ...prev, email: text }))
            }}
            multiline={true}
            placeholder="ID로 사용할 이메일을 입력해주세요."
            keyboardType="email-address"
            editable={!isAuthenEmail} // 인증이 완료되면 수정불가
          />
          <TouchableOpacity
            style={[
              styles.verifyButton,
              // (isAuthenEmail||!isValidEmail) && {backgroundColor: "grey",},
              (!isCorrectEmail || isAuthenEmail) && {backgroundColor: "grey",},
            ]}
            
            onPress={() => {
              SetAuthenEmail(true);
              handleUserEmailVerificationSend()
            }}
            // disabled={!isValidEmail || isAuthenEmail ||!isCorrectEmail}
            disabled={!isCorrectEmail || isAuthenEmail}
          >
            <Text style={styles.verifyButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={{
          color: (isCorrectEmail && isValidEmail) ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {emailMessage}
      </Text>

      {/* 이메일 인증번호 입력창 */}
      {authenEmail ? (
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
                (!(userInfo.email && emailCode.length == 8)||isAuthenEmail) && {
                  backgroundColor: "grey",
                },
              ]}
              disabled={(!(userInfo.email && emailCode.length == 8)) || isAuthenEmail}
              onPress={()=>{
                handleUserEmailVerificationCheck()
                // compareAuthenNum()
              }}
            >
              <Text style={styles.verifyButtonText}>인증</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {/* <Text
        style={{
          color: isAuthenEmail ? "blue" : "red",
          marginLeft: 30,
          marginTop: -30,
        }}
      >
        {codeMessage}
      </Text> */}

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
          !isAuthenEmail && {
            backgroundColor: "grey",
          },
        ]}
        // back에 회원가입 정보 보내야함
        onPress={() =>
          navigation.navigate("SignupInformationScreen", { userInfo: userInfo })
        }
        disabled={!isAuthenEmail}
      >
        <Text style={styles.linkText}>다음</Text>
      </TouchableOpacity>
      {/* {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />} */}
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
