import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from 'react-redux';
import { inputAccessToken, inputRefreshToken, setAccessTokenExpiration } from '../../redux/slices/auth/user'

import {userLogin} from '../../apis/userapi'

export default function LoginScreen({ navigation }) {
  const accessToken = useSelector((state) => state.user.accessToken)
  const refreshToken = useSelector((state) => state.user.refreshToken)
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSucceed, setIsSucceed] = useState(false)
  const [loginMessage, setLoginMessage] = useState("")

  const handleLoginSuccess = () => {
    // 로그인 성공 시 처리
    setEmail("")
    setPassword("")
    setLoginMessage("")
    dispatch(setAccessTokenExpiration(600)) // accessToken 만료 시간 10분으로 설정
    // navigation.navigate("HomeScreen");
    // 로그인 하면 이 화면은 못오게 하기 위해 HomeScreen을 첫 화면으로 설정
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    });
  };

  const handleLoginFailure = (statusCode) => {
    // 로그인 실패 시 처리
    if(statusCode===400){
      setLoginMessage("아이디 또는 비밀번호를 다시 확인해주세요.");
    }else{
      setLoginMessage("오류가 발생했습니다. 잠시 후 시도해주세요.");
    }
  };

  const handleUserLogin = async () => {
    if (!email || !password) {
      setLoginMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    const response = await userLogin(email, password);
    if (response.status === 200) {
      console.log("로그인 성공");
      console.log(response.data)
      dispatch(inputAccessToken(response.data.accessToken))
      dispatch(inputRefreshToken(response.data.refreshToken))
      handleLoginSuccess();
    } else {
      console.log("로그인 실패");
      handleLoginFailure(response.status);
    }
  };


  // 로그인 상태 확인 및 처리
  useEffect(() => {
    // accessToken과 refreshToken이 이미 존재하는 경우에는 HomeScreen으로 넘어감
    console.log({'accessToken':accessToken, 'refreshToken':refreshToken})
    if (accessToken && refreshToken) {
      handleLoginSuccess();
    } else {
      dispatch(inputAccessToken(null));
      dispatch(inputRefreshToken(null));
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/podo_bank_name.png")}
          style={styles.logoImage}
        />
        {/* 로고 이미지 로드 */}
      </View>

      {/* 로그인 실패 메시지 */}
      <View>
      {loginMessage ? (
        <Text style={styles.errorText}>{loginMessage}</Text>
      ) : <Text></Text>}
      </View>
      {/* ID, PW 입력창 */}
      <View style={styles.inputContainer}>
        <AntDesign name="user" size={20} style={styles.iconStyle} />
        <TextInput
          placeholder="아이디"
          style={styles.input}
          onChangeText={(text)=>{
            setEmail(text)
          }}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name="lock" size={20} style={styles.iconStyle} />
        <TextInput
          placeholder="비밀번호"
          style={styles.input}
          secureTextEntry={true}
          onChangeText={(text)=>{
            setPassword(text)
          }}
        />
      </View>

      {/* 로그인 버튼 */}
      {/* 로그인 back 연동해야함 */}
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => {
          handleUserLogin()
        }}
      >
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      {/* 회원가입 */}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("FindIDScreen")}>
          <Text style={styles.linkText}>아이디 찾기</Text>
        </TouchableOpacity>
        <Text style={styles.separator}> | </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ResetPasswordOneScreen")}
        >
          <Text style={styles.linkText}>비밀번호 초기화</Text>
        </TouchableOpacity>
        <Text style={styles.separator}> | </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SignupIdentityVerificationScreen")
          }
        >
          <Text style={styles.linkText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  logoImage: {
    width: 300,
    height: 300,
    resizeMode: "contain", // 'cover'나 'contain' 중 하나를 선택하여 이미지의 크기 조절 방식을 선택
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  logoContainer: {
    alignItems: "center",
    // marginBottom: 80,
    marginBottom: 65,
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
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 10,
    marginRight: 30,
    marginBottom: 10,
    marginLeft: 30,
    borderRadius: 5,
  },
  iconStyle: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "center",
  },
  separator: {
    marginHorizontal: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },

});
