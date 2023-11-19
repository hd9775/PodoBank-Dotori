import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Alert,
} from "react-native";
import HeaderComponent from "../Components/HeaderScreen";
import { useDispatch, useSelector } from "react-redux";
import { userBirthdateChange} from "../../apis/userapi"

export default function EditBirthDateScreen({ navigation, route }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외
  const currentBirthDateRef = useRef(null)
  const changeBirthDateRef = useRef(null)

  const [currentBirthDate, setCurrentBirthDate] = useState(route.params.birthDate)
  const [changeBirthDate, setChangeBirthDate] = useState("")
  const [isBirthDateValid, setIsBirthDateValid] = useState(false)
  const [changeBirthDateMessage, setChangeBirthDateMessage] = useState("")
  const [responseMessage, setResponseMessage] = useState("")
  

  const validateBirthDate = (text) => {
    if (!/^\d{8}$/.test(text)) {
      return false; 
    }
    const year = parseInt(text.substr(0, 4));
    const month = parseInt(text.substr(4, 2)) - 1;
    const day = parseInt(text.substr(6, 2));  
    const date = new Date(year, month, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    );
  };

  const handleUserBirthdateChangeCheck = (text) => {
    setChangeBirthDate(text)
    if(validateBirthDate(text)){
      setIsBirthDateValid(true)
      setChangeBirthDateMessage("생년월일 작성 완료")
      if(responseMessage.length>0){
        setResponseMessage("")
      }
    }else{
      setIsBirthDateValid(false)
      setChangeBirthDateMessage("정확한 날짜를 입력해주세요.")
    }
  }

  const handleUserBirthdateChange = async () =>{
    if(isBirthDateValid === true){
      doUserBirthdateChange()
    }else{
      setResponseMessage('생년월일 양식을 확인해주세요.')
    }
  }

  const formattedBirthDate  = (date) =>{
    const year = changeBirthDate.slice(0, 4);
    const month = changeBirthDate.slice(4, 6);
    const day = changeBirthDate.slice(6, 8);
    return `${year}-${month}-${day}`
  }

  const doUserBirthdateChange = async () =>{
    const data = formattedBirthDate(changeBirthDate)
    try{
      const response = await userBirthdateChange(data, accessToken, grantType)
      if(response.status === 200){
        setIsBirthDateValid(true)
        setResponseMessage("생년월일 변경 성공")
        Alert.alert('','생년월일이 변경되었습니다.')
        navigation.navigate("MyPageScreen")
      }else{
        setResponseMessage("오류 발생 : 생년월일 변경 실패")
        setIsBirthDateValid(false)
      }
    }catch(error){
      setIsBirthDateValid(false)
    }
  }

  useEffect(()=>{
    changeBirthDateRef.current.focus()
  },[])

  return (
    <View style={styles.container}>
      <HeaderComponent title="생년월일 변경" navigation={navigation} cancelNavi="MyPageScreen"/>

      <View style={styles.iconContainer}>
        <Image
          style={styles.lockIcon}
          source={require("../../assets/icon/birthday.png")}
        />
      </View>

      <View style={styles.passwordInput}>
        <Text style={styles.passwordPlaceholder}>*</Text>
        <Text style={styles.passwordPlaceholder}>*</Text>
        <Text style={styles.passwordPlaceholder}>*</Text>
        <Text style={styles.passwordPlaceholder}>*</Text>
      </View>

      <View style={styles.passwordInfoContainer}>
        <Text style={styles.passwordChangeInfoText}>
          생년월일을 변경해주세요.
        </Text>
        <Text style={styles.passwordInfoText}>
          기존 생년월일을 확인하고, {"\n"}변경할 생년월일을 입력해주세요.
        </Text>
      </View>

      <TextInput
        style={[styles.inputBox, {}]}
        placeholder={"기존 생년월일 : " + currentBirthDate}
        placeholderTextColor="black"
        returnKeyType="next"
        keyboardType="number-pad"
        ref={currentBirthDateRef}
        onChangeText={(text)=>{
          handlePasswordCurrentCheck(text)
        }}
        onSubmitEditing={()=>{
          changeBirthDateRef.current.focus()
        }}
        editable={false}
      />
      <Text style={[styles.pwMessage, {}]}></Text>

      <TextInput
        style={styles.inputBox}
        placeholder="변경할 생년월일 (숫자만 입력)"
        returnKeyType="done"
        keyboardType="number-pad"
        ref={changeBirthDateRef}
        value={changeBirthDate}
        onChangeText={(text)=>{
          handleUserBirthdateChangeCheck(text)
        }}
        maxLength={8}
        onSubmitEditing={()=>{
          handleUserBirthdateChange()
        }}
        onFocus={()=>{
          if(!changeBirthDate){
            
          }
        }}
      />
      <Text
        style={[styles.pwMessage, {
          color: (isBirthDateValid) ? "blue" : "red",
        }]}
      >
        {changeBirthDateMessage}
      </Text>

      <View style={{}}>
        <Text style={{
          textAlign:'center',
          color: (isBirthDateValid) ? "blue" : "red",
        }}>{responseMessage}</Text>
      </View>
      

      <TouchableOpacity
        style={[styles.changePasswordButton, {backgroundColor:isBirthDateValid?"#FF965C":'grey'}]}
        onPress={() => {
          handleUserBirthdateChange()
        }}
        disabled={!isBirthDateValid}
      >
        <Text style={styles.changePasswordButtonText}>생년월일 변경</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
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
  iconContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  lockIcon: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  passwordPlaceholder: {
    fontSize: 24,
    borderBottomWidth: 1,
    width: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginLeft: 10, 
    marginTop: 10,
    marginBottom: 30,
  },
  passwordChangeText: {
    fontSize: 24,
    flex: 1, 
    textAlign: "center",
  },
  passwordInfoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  passwordChangeInfoText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  passwordInfoText: {
    fontSize: 14,
    textAlign: 'center',
    color: "#7B7B7B",
  },
  inputBox: {
    borderWidth: 1,
    backgroundColor: "#F5F3F3",
    borderColor: "#BAC0CA",
    borderRadius: 10,
    padding: 6,
    fontSize: 12,
    paddingLeft: 12,
    marginHorizontal: 20,
    width: "90%",
    alignSelf: "center",
  },
  changePasswordButton: {
    backgroundColor: "#FF965C", 
    borderRadius: 8, 
    alignItems: "center",
    justifyContent: "center",
    height: 40, 
    marginTop: 16, 
    width: "90%",
    alignSelf: "center",
  },
  changePasswordButtonText: {
    color: "white", 
    fontWeight: "bold", 
    fontSize: 15,
  },
  pwMessage:{
    marginTop: 0,
    marginBottom: 10,
    fontSize: 12,
    marginHorizontal: 20
  }
});
