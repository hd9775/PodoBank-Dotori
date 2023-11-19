import React, { useEffect, useRef, useState, } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import {inputgrantType, inputAccessToken, inputRefreshToken} from "../../redux/slices/auth/user"
import {userLogin} from "../../apis/userapi"
import { useDispatch, useSelector } from "react-redux"
import { EvilIcons } from '@expo/vector-icons';
import { planStop } from "../../apis/planapi"
import { accountDelete, accountNicknameRegist, accountOneInquiry } from "../../apis/accountapi"
import { Dimensions } from "react-native";

export default function PlanManageScreen({ navigation, route }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외

  const [editAccountName, setEditAccountName] = useState(false)
  const [planStopModalVisible, setPlanStopModalVisible] = useState(false)
  const [accountDeleteModalVisible, setAccountDeleteModalVisible] = useState(false)

  const [changeAccountName, setChangeAccountName] = useState(route.params.accountTitle)
  const [accountName, setAccountName] = useState(route.params.accountTitle);
  const [accountSeq, setAccountSeq] = useState(route.params.accountSeq);
  const [planSeq, setPlanSeq] = useState(route.params.planSeq);
  const [accountBalance, setAccountBalance] = useState(route.params.accountBalance);
  const [endAt, setEndAt] = useState(route.params.endAt);
  const [startedAt, setStartedAt] = useState(route.params.startedAt);
  const [accountNumber, setAccountNumber] = useState("1111111111111");
  const [bankName, setBankName] = useState('포도은행');  
  
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const doPlanStop = async () => {
    try{
      const response = await planStop(planSeq, accessToken, grantType)
      if(response.status === 200){
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainPageScreen' }],
        });
      }else{
      }
    }catch(error){
    }
  }

  const doAccountDelete = async () => {
    try{
      const response = await accountDelete(accountSeq, accessToken, grantType)
      if(response.status === 200){
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainPageScreen' }],
        });
      }else{
      }
    }catch(error){
    }
  }


  const doAccountOneInquiry = async () => {
    try{
      const response = await accountOneInquiry(planSeq, accessToken, grantType)
      if(response.status === 200){
        setBankName(response.data.bankName)
        setAccountNumber(response.data.accountNumber)
        setAccountBalance(response.data.accountBalance)
      }else{
      }
    }catch(error){
    }
  }

  const handleAccountNameChange = () => {
    doAccountNameChange()
    setEditAccountName(false)

  }
  const doAccountNameChange = async () => {
    const nicknameRegistData = {
      accountNumber:accountNumber,
      accountTitle:changeAccountName,
    }
    try{
      const response = await accountNicknameRegist(nicknameRegistData, accessToken, grantType)
      if(response.status === 200){
        setAccountName(changeAccountName)
      }else{
      }
    }catch(error){
    }
  }


  useEffect(()=>{
    doAccountOneInquiry()
  },[])

  return (
    <View style={styles.container}>
      <View style={{alignSelf:'center', flex:0.1}}>
        <Text style={styles.headerTitle}>계좌 정보</Text>
      </View>

      <View style={[{flexDirection:'row', flex:0.1,}]}>
        { editAccountName
          ?
          <TextInput
            style={[styles.nameChangeInput,{width: windowWidth*0.5,}]}
            value = {changeAccountName}
            returnKeyType="done"
            onSubmitEditing={()=>{
              handleAccountNameChange()
            }}
            onChangeText={(text)=>{
              setChangeAccountName(text)
            }}
          />
          :
          <Text style={styles.subTitle1}>{accountName}</Text>
        }
        { editAccountName
          ? (<TouchableOpacity
              onPress={()=>{
                handleAccountNameChange()
              }}
              >
              <Text style={styles.nameChangeButton}>수정</Text>
            </TouchableOpacity>)
          
          : (<TouchableOpacity
            onPress={()=>{
                setEditAccountName(true)
              }}
            >
              <EvilIcons name="pencil" size={30} color="black" />
            </TouchableOpacity>)
          
        }
      </View>
      <View style={[styles.divideLine,{}]}></View>

      <View style={{flex:0.2, justifyContent:"space-around"}}>
        <Text style={[styles.subTitle2,{}]}>계좌번호</Text>
        <View style={{flexDirection:'row', justifyContent:"space-between"}}>
          <Image
            style={[styles.podoBankImage,{}]}
            source={require("../../assets/images/logo_podo.png")}
          />
          <View style={{justifyContent:"space-between"}}>
            <Text style={[styles.textRight,{}]}>{bankName}</Text>
            <Text style={[styles.textRight,{}]}>{accountNumber.slice(0,4)}-{accountNumber.slice(4,6)}-{accountNumber.slice(6)}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.divideLine,{}]}></View>

      <View style={{flex:0.2, justifyContent:"space-around"}}>
        <Text style={[styles.subTitle2,{}]}>잔액</Text>
        <Text style={[styles.textRight,{}]}>{accountBalance != null ? accountBalance.toLocaleString() : 0}원</Text>
      </View>
      <View style={[styles.divideLine,{}]}></View>

      <View style={{flex:0.2, justifyContent:"space-around", }}>
        <Text style={[styles.subTitle2,{}]}>계획</Text>
        <View style={{}}>
          <View style={[styles.dayText,{}]}>
            <Text style={[styles.normalText,{}]}>시작일</Text>
            <Text style={[styles.normalText,{}]}>{startedAt.slice(0,4)}.{startedAt.slice(5,7)}.{startedAt.slice(8,10)}</Text>
          </View>
          <View style={[styles.dayText,{}]}>
            <Text style={[styles.normalText,{}]}>종료일</Text>
            <Text style={[styles.normalText,{}]}>{endAt.slice(0,4)}.{endAt.slice(5,7)}.{endAt.slice(8,10)}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.planManage,{}]}>
        <TouchableOpacity
          onPress={()=>{
            setPlanStopModalVisible(true)
          }}
          >
          <Text style={[styles.stopText,{}]}>계획 중지하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>{
            setAccountDeleteModalVisible(true)
          }}>
        <Text style={[styles.stopText,{}]}>계좌 삭제하기</Text>
        </TouchableOpacity>
      </View>

      { (planStopModalVisible || accountDeleteModalVisible)
        ?null
        :<View style={styles.centeredView}></View>
      }
      { planStopModalVisible
        ?
        (<View style={styles.centeredView}>
          <Modal
            animationType="none"
            transparent={true}
            visible={planStopModalVisible}
            onRequestClose={() => {
              setPlanStopModalVisible(false);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>현재 계획을 중지하시겠습니까?</Text>
                <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      doPlanStop()
                      setPlanStopModalVisible(false)
                    }}>
                    <Text style={styles.textStyle}>예</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      setPlanStopModalVisible(false)
                    }}>
                    <Text style={styles.textStyle}>아니오</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>)
        : null
      }
      { accountDeleteModalVisible
        ?
        (<View style={[styles.centeredView]}>
          <Modal
            animationType="none"
            transparent={true}
            visible={accountDeleteModalVisible}
            onRequestClose={() => {
              setAccountDeleteModalVisible(false);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>연동된 계좌를 삭제하시겠습니까?</Text>
                <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      doAccountDelete()
                      setAccountDeleteModalVisible(false)
                    }}>
                    <Text style={styles.textStyle}>예</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      setAccountDeleteModalVisible(false)
                    }}>
                    <Text style={styles.textStyle}>아니오</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>)
        : null
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 45,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subTitle1: {
    fontWeight: "bold",
    fontSize: 23,
  },
  textRight:{
    textAlign: "right",
    fontSize:16,
  },
  normalText:{
    fontSize:16,
  },
  podoBankImage: {
    width: 50,
    height: 50,
  },
  subTitle2:{
    fontSize: 20, 
    fontWeight:"bold"
  },
  divideLine:{
    height:5, 
    backgroundColor:"#F5F5F5"
  },
  stopText:{
    fontWeight:'bold', 
    color:'gray',
  },
  planManage:{
    flex:0.2, 
    flexDirection:"row", 
    justifyContent:"space-between", 
    alignItems:"flex-end"
  },
  dayText:{
    flexDirection:"row", 
    justifyContent:"space-between",
    marginVertical:10
  },
  nameChangeButton:{
    height:40, 
    borderWidth:1, 
    color:"white", 
    backgroundColor:"#FF965C", 
    borderColor:'#FF965C', 
    textAlignVertical:'center', 
    marginHorizontal:10, 
    borderRadius: 10, 
    padding: 10
  },
  nameChangeInput:{
    borderWidth:1, 
    borderColor:'black', 
    height:40,  
    padding:10, 
    borderRadius: 10
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    top: '225%',
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
