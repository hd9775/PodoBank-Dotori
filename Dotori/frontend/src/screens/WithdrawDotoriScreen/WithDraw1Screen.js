import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity,Modal, Alert } from "react-native";
import FooterScreen from "../Components/FooterScreen";
import { useDispatch, useSelector } from "react-redux";
import { userWithdrawDotori } from "../../apis/userapi"
import {inputgrantType, inputAccessToken, inputRefreshToken} from "../../redux/slices/auth/user"

export default function WithDraw1Screen({ navigation, route }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외
  const [userInfo, setUserInfo] = useState(route.params.userInfo)
  const [userWithdrawModalVisible, setUserWithdrawModalVisible] = useState(false);

  const handleUserWithdrawDotori = () => {
    setUserWithdrawModalVisible(true)
  }

  const doUserWithdrawDotori = async () => {
    try{
      const response = await userWithdrawDotori(refreshToken, accessToken, grantType)
      if(response.status === 200){
        dispatch(inputgrantType(null))
        dispatch(inputAccessToken(null))
        dispatch(inputRefreshToken(null))
        Alert.alert('', `${userInfo.userName}님 탈퇴가 완료되었습니다.`, [
          {
            text: '확인',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              });
            },
          },
        ]);
      }else{
      }
    }catch(error){
    }
  }

  const cancelUserWithdrawDotori = () => {
    navigation.navigate("MyPageScreen")
  }

  useEffect(() => {

  }, [])

  return (
    <View style={styles.container}>
      <Image
        style={[styles.image]}
        source={require("../../assets/images/Hamster/WatchHamster.png")}
      />

      <View style={styles.box}>
        <Text style={styles.text}>{userInfo.userName}님 가실거에요?</Text>
      </View>

      <Text style={styles.text}>{userInfo.userName}님</Text>
      <Text style={styles.text}>정말로</Text>
      <Text style={{ fontSize: 18 }}>
        <Text style={{ color: "#FF965C" }}>탈퇴</Text>하실건가요?
      </Text>
      <View style={{margin:25}}></View>

      <TouchableOpacity style={[styles.button1, {backgroundColor:'lightgray'}]}
        onPress={() =>{
          handleUserWithdrawDotori()
        }}
      >
        <Text style={styles.buttonText}>네, 탈퇴할 거에요.</Text>
      </TouchableOpacity>
      <View style={{margin: 10}}></View>
      <TouchableOpacity style={styles.button2}
        onPress={() =>{
          cancelUserWithdrawDotori()
        }}
      >
        <Text style={styles.buttonText}>아니요, 잘못 눌렀어요.</Text>
      </TouchableOpacity>

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
              <Text style={styles.modalText}>마지막 확인입니다.{"\n"}회원탈퇴를 진행 하시겠습니까?</Text>
              <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setUserWithdrawModalVisible(false)
                    doUserWithdrawDotori()
                  }}>
                  <Text style={styles.textStyle}>예</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setUserWithdrawModalVisible(false)
                    cancelUserWithdrawDotori()
                  }}>
                  <Text style={styles.textStyle}>아니오</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

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
    paddingBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 180,
  },
  box: {
    width: "60%",
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    elevation: 4,
    padding: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    height: 55,
  },
  leftImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    color: "#000000",
  },
  button1: {
    backgroundColor: "#FF965C",
    borderRadius: 8,
    width: "80%",
    height: 40,
  },
  button2: {
    backgroundColor: "#FF965C",
    borderRadius: 8,
    width: "80%",
    height: 40,
  },
  buttonText: {
    fontSize: 15,
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: "center",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: -20,
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
