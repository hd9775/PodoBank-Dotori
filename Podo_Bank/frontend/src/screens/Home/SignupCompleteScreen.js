import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import HeaderComponent from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";
import { useSelector } from "react-redux";

export default function SignupCompleteScreen({ navigation, route }) {
  const userName = route.params.name;
  // const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  return (
    <View style={styles.container}>
      {/* <View style={styles.halfContainer}> */}
      <View style={styles.halfContainer}>
        {/* Header */}
        <HeaderComponent
          title="회원가입"
          navigation={navigation}
        ></HeaderComponent>
        <View style={styles.showUserBoldText1}>
          <Image 
            source={require('../../assets/images/podo_bank_text.png')}
            style={{ height: "40%", resizeMode: 'contain', alignSelf:'center' }}
          />
          <Text style={[styles.showUserBoldText2]}>
            {userName}님, 회원가입을 축하합니다!
          </Text>
          <TouchableOpacity
            style={[styles.customButton]}
            onPress={() => {
              navigation.navigate("LoginScreen");
            }}
          >
            <Text style={styles.buttonText}>시작하기</Text>
          </TouchableOpacity>
        </View>

        
      </View>
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
  halfContainer: {
    flex: 1,
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
    marginTop: 10,
    // marginRight: 30,
    // marginLeft: 30,
    width:"100%",
    borderRadius: 5,
  },
  tinyCenterLinkText: {
    textAlign: "center",
    margin: 10,
  },
  showUserBoldText1: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  showUserBoldText2: {
    fontWeight: "bold",
    fontSize: 20,
    // marginTop: 30,
    // marginBottom: 30,
    marginVertical: 10,
    // marginRight: 30,
    // marginLeft: 30,
    textAlign: "center",
    lineHeight: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
