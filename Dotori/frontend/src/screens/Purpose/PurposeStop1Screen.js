import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity,Modal, Alert } from "react-native";
import FooterScreen from "../Components/FooterScreen";
import { useDispatch, useSelector } from "react-redux";
import { userWithdrawDotori } from "../../apis/userapi"
import { purposeQuit } from "../../apis/purposeapi"
import {inputgrantType, inputAccessToken, inputRefreshToken} from "../../redux/slices/auth/user"

export default function WithDraw1Screen({ navigation, route }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외
  const [purposeQuitModalVisible, setPurposeQuitModalVisible] = useState(false);
  const [purposeSeq] = useState(route.params.purposeSeq)
  const [purposeDetailData] = useState(route.params.purposeDetailData)

  const handlePurposeQuit = () => {
    setPurposeQuitModalVisible(true)
  }


  const doPurposeQuit = async () => {
    try{
      const response = await purposeQuit(purposeSeq, accessToken, grantType)
      if(response.status === 200){
        navigation.reset({
          index: 0,
          routes: [{ name: 'PurposeScreen' }],
        });
      }else{
      }
    }catch(error){
    }
  }


  const cancelPurposeQuitDotori = () => {
    navigation.navigate("PurposeScreen")
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
        <Text style={styles.text}>목표가 필요 없어진 거예요?</Text>
      </View>

      <Text style={styles.text}>정말로{"\n"}목표 : "{purposeDetailData.purposeTitle}" 를</Text>
      <Text style={{ fontSize: 18 }}>
        <Text style={{ color: "#FF965C" }}>중단</Text>할까요?
      </Text>
      <View style={{margin:25}}></View>

      <TouchableOpacity style={[styles.button1, {backgroundColor:'lightgray'}]}
        onPress={() =>{
          handlePurposeQuit()
        }}
      >
        <Text style={styles.buttonText}>그래, 진행시켜!</Text>
      </TouchableOpacity>
      <View style={{margin: 10}}></View>
      <TouchableOpacity style={styles.button2}
        onPress={() =>{
          cancelPurposeQuitDotori()
        }}
      >
        <Text style={styles.buttonText}>아니요, 잘못 눌렀어요.</Text>
      </TouchableOpacity>

      <View style={styles.centeredView}>
        <Modal
          animationType="none"
          transparent={true}
          visible={purposeQuitModalVisible}
          onRequestClose={() => {
            setPurposeQuitModalVisible(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>마지막 확인입니다.{"\n"}묙표를 중단 하시겠습니까?</Text>
              <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setPurposeQuitModalVisible(false)
                    doPurposeQuit()
                  }}>
                  <Text style={styles.textStyle}>예</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setPurposeQuitModalVisible(false)
                    cancelPurposeQuitDotori()
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
    textAlign:'center',
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
