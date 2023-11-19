import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal,Pressable,Alert } from "react-native";
import HeaderComponent from "../Header/HeaderScreen";
import FooterScreen from "../Header/FooterScreen";
import {
  userInformationInquiry, userLogout, userWithdrawal
} from '../../apis/userapi'
import { FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from 'react-redux';
import { inputAccessToken, inputRefreshToken, setIsnotReissuanceToken, setAccessTokenExpiration, setUserInfo } from '../../redux/slices/auth/user'
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";

export default function MyPageScreen({ navigation }) {
  // const [userInfo, setUserInfo] = useState(null)
  const userInfo = useSelector((state) => state.user.userInfo)
  const [userWithdrawalModalVisible, setUserWithdrawalModalVisible] = useState(false)
  const accessToken = useSelector((state) => state.user.accessToken)
  const refreshToken = useSelector((state) => state.user.refreshToken)
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  const totalBalance = useSelector((state)=> state.account.totalBalance)

  const dispatch = useDispatch();

  // //들어올 때 axios로 정보 받아야함
  // const hanldeUserInformationInquiry = async() =>{
  //   console.log('mypage',accessToken)
  //   const response = await userInformationInquiry(accessToken)
  //   if(response.status===200){
  //     console.log('good')
  //     setUserInfo(response.data)
  //   }else if(response.status===400){
  //     console.log('bad400 회원정보를 받아올 수 없습니다.')
  //   }else if(response.status===401){
  //     console.log('bad401 회원정보를 받아올 수 없습니다.')
  //   }else if(response.status===403){
  //     console.log('bad403 회원정보를 받아올 수 없습니다.')
  //   }else{
  //     console.log('오류발생: 회원정보')
  //   }
  // }

  const handleUserLogout = async() => {
    const response = await userLogout(accessToken)
    console.log('리스폰스',response.data)
    if(response.status===200){
      console.log('logout 성공')
      dispatch(inputAccessToken(null))
      dispatch(inputRefreshToken(null))
      dispatch(setAccessTokenExpiration(0))
      dispatch(setUserInfo(null))
      // navigation.navigate("LoginScreen");
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    }else if(response.status===400){
      console.log('logout 실패')
    }else if(response.status===401){
      console.log('logout 인증실패 실패')
    }else if(response.status===403){
      console.log('토큰없음')
    }else{
      console.log('오류발생 로그아웃 실패')
    }
  }

  // 페이지가 로드될 때 hanldeUserInformationInquiry() 함수 실행
  // useEffect(() => {
  //   hanldeUserInformationInquiry();
  // }, []);

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="마이페이지"
        navigation={navigation}
        showHome={true}
      />

      
      {/* 유저 정보 */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.boldText}>기본정보</Text>
        <View style={styles.infoRow}>
          <Text>이름</Text>
          {userInfo?
            (<Text>{userInfo.name}</Text>)
            :(<Text>박포도</Text>)
          }
          
        </View>
        <View style={styles.infoRow}>
          <Text>이메일</Text>
          {userInfo?
            (<Text>{userInfo.email}</Text>)
            :(<Text>abc1234@naver.com</Text>)
          }
          
        </View>
        <View style={styles.infoRow}>
          <Text>생년월일</Text>
          {userInfo?
            (<Text>{userInfo.birthdate}</Text>)
            :(<Text>1999.12.12</Text>)
          }
        </View>
        <View style={styles.infoRow}>
          <Text>핸드폰번호</Text>
          {userInfo?
            (<Text>{userInfo.phoneNumber}</Text>)
            :(<Text>010-1234-1234</Text>)
          }
        </View>
      </View>

      <View style={styles.divider} />

      {/* 비밀번호 변경 및 로그아웃 */}
      <TouchableOpacity
        style={styles.actionRow}
        onPress={()=>{
          navigation.navigate('ChangePasswordScreen', {userEmail:userInfo.email})
        }}
      >
        <Text>비밀번호 변경</Text>
        <FontAwesome name="angle-right" style={{ fontSize: 20 }}></FontAwesome>
      </TouchableOpacity>
      <TouchableOpacity
        //accessToken지우자
        style={styles.logoutButton}
        onPress={() => {
          handleUserLogout()
          // navigation.navigate("LoginScreen");
        }}
      >
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>

      

      <TouchableOpacity
        onPress={()=>{
          setUserWithdrawalModalVisible(true)
        }}
      >
        <Text style={styles.grayText}>
          포도은행을 탈퇴하시려면 여기를 눌러주세요
        </Text>
      </TouchableOpacity>
      {/* 회원탈퇴 모달창 */}
      <Modal
        animationType="none"//slide, fade가 있음
        transparent={true}
        visible={userWithdrawalModalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
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
                  setUserWithdrawalModalVisible(!userWithdrawalModalVisible)
                  navigation.navigate("WithdrawalScreen")
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
      
      <View style={styles.footer}>
        <FooterScreen navigation={navigation} />
      </View>
      {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingBottom: 0,
  },

  boldText: {
    fontWeight: "bold",
    marginBottom: 30,
    fontSize: 25,
  },
  userInfoContainer: {
    marginBottom: 20,
    marginTop: 50,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  divider: {
    height: 5,
    backgroundColor: "#D9D9D9",
    marginBottom: 20,
    marginLeft: -20,
    marginRight: -20,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logoutButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#842DC480",
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 40,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
  },
  grayText: {
    color: "gray",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  footer: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 'auto',
  },
  // 모달부분
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
    color:'red'
  },
});
