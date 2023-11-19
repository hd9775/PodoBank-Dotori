import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import HeaderComponent from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";
import { useSelector } from "react-redux";

export default function AccountResetPasswordSucceessScreen({ navigation, route }) {
  const [email] = useState(route.params.email)
  const [accountNumber] = useState(route.params.accountNumber)
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)

  // 계좌 번호 형식 맞추는 함수
  const settingAccountNumber = (accountNumber) =>{
    return `${accountNumber.slice(0,4)}-${accountNumber.slice(4,6)}-${accountNumber.slice(6)}`
  }

  return (
    <View style={styles.container}>
      <View style={styles.halfContainer}>
        {/* Header */}
        <HeaderComponent
          title="계좌 비밀번호 초기화"
          navigation={navigation}
        ></HeaderComponent>

        <View style={styles.showUserBoldText1}>
          <Image 
            source={require('../../assets/images/all-account.png')}
            style={{ height: "20%", resizeMode: 'contain', alignSelf:'center' }}
          />
          <Text style={[styles.showUserBoldText2]}>
            {email}님의{'\n'}"{settingAccountNumber(accountNumber)}" 계좌의{'\n'}비밀번호가 초기화되었습니다.
          </Text>
          <TouchableOpacity
            style={[
              styles.customButton,
            ]}
            onPress={() =>{
              navigation.navigate("HomeScreen")
            }}
            >
            <Text style={styles.buttonText}>메인 페이지로</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={{flex:0.2}}>
        </View> */}
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
  halfContainer: {
    flex: 0.8,
    backgroundColor: "white",
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
  inputContainer: {
    marginTop: 10,
    justifyContent: "flex-start",
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
    elevation: 5,
    backgroundColor: "white",
  },
  customButton: {
    backgroundColor: "#A175FD",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 10,
    marginRight: 30,
    marginLeft: 30,
    borderRadius: 5,
    width:"100%"
  },
  tinyCenterLinkText:{
    textAlign: 'center',
    margin: 10
  },
  showUserBoldText1:{
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  showUserBoldText2:{
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 30,
    marginBottom: 30,
    marginRight: 30,
    marginLeft: 30,
    textAlign: 'center',
    lineHeight: 40
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
