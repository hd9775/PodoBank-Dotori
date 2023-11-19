import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import HeaderComponent from "../Components/HeaderScreen";
import { useDispatch, useSelector } from "react-redux";
import {userLogout, userInfoInquiry} from "../../apis/userapi"
import {inputgrantType, inputAccessToken, inputRefreshToken} from "../../redux/slices/auth/user"
import { useIsFocused } from "@react-navigation/native";

export default function MyPageScreen({ navigation }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외
  const [userInfo, setUserInfo] = useState(null)
  const isFocused = useIsFocused();
  const [userWithdrawModalVisible, setUserWithdrawModalVisible] = useState(false);


  const doLogout = async () =>{
    try{
      const response = await userLogout(refreshToken, accessToken, grantType)
      if(response.status === 200){
        try {
          dispatch(inputgrantType(null))
          dispatch(inputAccessToken(null))
          dispatch(inputRefreshToken(null))
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          });
        } catch(error) {
        }
      }else if(response.status===403){
      }else{
      }
    }catch(error){
    }
  }

  const handleLogout = () => {
    doLogout()
  }

  const hanldeuserWithdrawDotori = async () =>{
    setUserWithdrawModalVisible(true)
  }

  const changeFormPhoneNumber = (phoneNumber) => {
    const firstNumber = phoneNumber.slice(0,3)
    const middleNumber = phoneNumber.slice(3,7)
    const lastNumber = phoneNumber.slice(7)
    return `${firstNumber}-${middleNumber}-${lastNumber}`
  }

  const doUserInfoInquiry = async () => {
    try {
      const response = await userInfoInquiry(accessToken, grantType);
      if(response.status===200){
        setUserInfo(response.data);
      }else{
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    if(isFocused){
      doUserInfoInquiry();
    }
  }, [isFocused]);


  return (
    <View style={styles.container}>
      <HeaderComponent title="마이페이지" navigation={navigation} cancelNavi={"MainPageScreen"}></HeaderComponent>

      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={require("../../assets/images/Hamster/MainHamster.png")}
        />
      </View>

      <View style={styles.separator}></View>

      <View style={styles.basicContainer}>
        <Text style={styles.boldText}>기본 정보</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>이름</Text>
          <Text style={styles.infoText}>{userInfo?userInfo.userName:'박새로이'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>이메일</Text>
          <Text style={styles.infoText}>{userInfo?userInfo.id:"dotori123@dotori.com"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>생년월일</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{userInfo?userInfo.birthDate:"1999-12-12"} </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditBirthDateScreen", {birthDate: userInfo.birthDate})}
            >
              <Image
                style={styles.editIcon}
                source={require("../../assets/icon/pencil.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>핸드폰 번호</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{userInfo?changeFormPhoneNumber(userInfo.phoneNumber):"010-1234-1234"} </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditPhoneNumberScreen", {phoneNumber: userInfo.phoneNumber})}
            >
              <Image
                style={styles.editIcon}
                source={require("../../assets/icon/pencil.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.separator}></View>

      <View style={styles.basicContainer}>
        <TouchableOpacity
          style={styles.featureItem}
          onPress={() => {
            navigation.navigate("PasswordChangeScreen")
          }}
        >
          <Text style={styles.infoText}>비밀번호 변경</Text>
          <FontAwesome
            name="angle-right"
            style={{ fontSize: 30 }}
          ></FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.featureItem}
          onPress={() => navigation.navigate("CategoryScreen")}
        >
          <Text style={styles.infoText}>카테고리 보기</Text>
          <FontAwesome
            name="angle-right"
            style={{ fontSize: 30 }}
          ></FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.featureItem}
          onPress={() => navigation.navigate("ReceipeSelectScreen")}
        >
          <Text style={styles.infoText}>명세서 보기</Text>
          <FontAwesome
            name="angle-right"
            style={{ fontSize: 30 }}
          ></FontAwesome>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={()=>{
            handleLogout()
          }}
        >
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
        <Text style={styles.separatorText}> </Text>
        <TouchableOpacity style={styles.withdrawButton}
          onPress={()=>{
            hanldeuserWithdrawDotori()
          }}
        >
          <Text style={styles.withdrawText}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.centeredView}>
        <Modal
          animationType="none"
          transparent={true}
          visible={userWithdrawModalVisible}
          onRequestClose={() => {
            setUserWithdrawModalVisible(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>회원탈퇴를 진행 하시겠습니까?</Text>
              <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setUserWithdrawModalVisible(false)
                    navigation.navigate("WithDraw1Screen", {userInfo : userInfo})
                  }}>
                  <Text style={styles.textStyle}>예</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setUserWithdrawModalVisible(false)
                  }}>
                  <Text style={styles.textStyle}>아니오</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  basicContainer: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 15,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  myPageText: {
    fontSize: 24,
    flex: 1,
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 16,
  },
  separator: {
    height: 5,
    backgroundColor: "#F2EFEF",
    marginVertical: 16,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 20,

    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  editIcon: {
    width: 15,
    height: 15,
  },
  featureItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
  logoutButton: {
    borderBottomWidth: 1,
    borderBottomColor: "#3D3D3D",
    paddingBottom: 2,
  },
  logoutText: {
    fontSize: 10,
  },
  separatorText: {
    marginHorizontal: 20,
  },
  withdrawButton: {
    borderBottomWidth: 1,
    borderBottomColor: "#FF3737",
    paddingBottom: 2,
  },
  withdrawText: {
    fontSize: 10,
    color: "#FF3737",
  },
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
    flex:1,
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#FF965C',
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
