import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import HeaderComponent from "../Header/HeaderScreen";
import { AntDesign } from "@expo/vector-icons";
import {accountTypeInquiry} from "../../apis/accountapi"
import { useSelector } from "react-redux";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";

const { height, width } = Dimensions.get("window");


export default function AccountConfigurationScreen({ navigation }) {
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  const [createInfo, setCreateInfo] = useState({
    accountCategoryId:null,
    password:"",
    accountType:"",
  })

  const accessToken = useSelector((state) => state.user.accessToken)
  const [choiceAccountCategory, setChoiceAccountCategory] = useState(null)
  const [accountTypes, setAccountTypes] = useState([])
  const [selectIndex, setSelectIndex] = useState(null)

  
  const handleAccountTypeInquiry = async () =>{
    const response = await accountTypeInquiry(accessToken)
    if(response.status === 200){
      console.log('계좌 분류 조회에 성공 했습니다.')
      setAccountTypes(response.data)
    }else if(response.status === 400){
      console.log('계좌 분류 조회에 실패했습니다.')
    }else if(response.status === 401){
      console.log('권한 없음으로 계좌 분류 조회에 실패했습니다.')
    }else{
      console.log('오류발생: 계좌 분류 조회 실패')
    }
  }

  const selectAccountTypeOption = (option) => {
    setChoiceAccountCategory({accountCategoryId: option.accountCategoryId, accountName:option.accountName})
    console.log(option)
    setCreateInfo((prev) => ({ ...prev, 
      accountCategoryId: option.accountCategoryId
    }))
  };


  useEffect(()=>{
    handleAccountTypeInquiry()
  }, [])

  return (
    <View style={styles.container}>
      <HeaderComponent navigation={navigation} title="계좌개설" />
      <View style={styles.purpleBox}>
        <Text style={styles.blackText}>포도은행 계좌 분류</Text>
      </View>

      {/* <TouchableOpacity
        style={styles.whiteBox}
        onPress={() => {}} // 여기서 focus
      >
        <Text style={styles.blackText}>통장 비밀번호 만들기</Text>
      </TouchableOpacity> */}
      <View style={{marginBottom:10}}>
        {choiceAccountCategory
        ?(<Text style={{textAlign:'center'}}>선택 분류: {choiceAccountCategory.accountName}</Text>)
        :(<Text style={{textAlign:'center'}}>만드실 통장의 분류를 선택해 주세요.</Text>)
        }
      </View>
      <View
        // style={styles.dropdown}
      >
        {accountTypes.map((option, index) => (
          <TouchableOpacity
            key={index}
            // style={styles.whiteBox}
            style={selectIndex===index?styles.dropdownSelected:styles.dropdown}
            onPress={() => {selectAccountTypeOption(option), setSelectIndex(index)}}
          >
            <Text style={{fontWeight:'bold', fontSize:20}}>{option.accountName}</Text>
            <Text style={{color:'grey'}}>년 {option.interestRate}% 이율</Text>
            <Text style={{color:'grey'}}>{option.accountDescription}</Text>
          </TouchableOpacity>
        ))}
        <View
          // style={styles.whiteBox}
          style={[styles.dropdown]}
          onPress={() => {selectAccountTypeOption(option)}}
        >
          <Text style={{fontWeight:'bold', fontSize:20}}>차후 추가 예정</Text>
          <Text style={{color:'grey'}}>년 0.0% 이율</Text>
          <Text style={{color:'grey'}}>차후 추가 예정될 상품</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.confirmButtonNext}
        onPress={() => {
          switch (true) {
            case (!choiceAccountCategory):
              Alert.alert('계좌 분류 미선택', '생성할 계좌의 분류를 선택해주세요.');
              break;
            default:
              console.log(createInfo)
              navigation.navigate("AccountConfigurationScreen", {
                createInfo: createInfo,
              })
          }
        }}
      >
        <Text style={styles.confirmText}>다음</Text>
      </TouchableOpacity>
      {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  container1:{
    flex: 0.9,
  },
  container2:{
    flex: 0.1,
    justifyContent: 'flex-end',
  },
  purpleBox: {
    backgroundColor: "#8B0FD750",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    borderRadius: 5,
  },
  // blackText: {
  //   color: "white",
  //   fontSize: 20,
  //   textAlign: "center",
  // },
  checkIcon: {
    fontSize: 18,
    color: "black",
    marginTop: -5,
    marginBottom: -5,
  },
  whiteBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 50,
  },
  blackText: {
    fontSize: 18,
  },
  grayText: {
    fontSize: 18,
    color: "gray",
    // textAlign: "left",
  },
  passwordDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "gray",
    margin: 2,
  },
  filledDot: {
    backgroundColor: "black",
  },
  passwordInput: {
    borderColor: "black",
    borderWidth: 1,
    width: 90,
    textAlign: "center",
    fontSize: 18,
  },
  passwordDotsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  innerRadio: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "black",
  },
  confirmButtonNext: {
    backgroundColor: "#842DC480",
    padding: 15,
    // alignSelf: "stretch",
    alignItems: "center",
    // borderTopLeftRadius: 5, // 위쪽 왼쪽 모서리만 둥글게
    // borderTopRightRadius: 5, // 위쪽 오른쪽 모서리만 둥글게
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  confirmText: {
    color: "white",
    fontSize: 20,
  },

  // modal창 css
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    height: "70%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: "space-between",
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  passwordLabelText: {
    fontSize: 15,
    // fontWeight: "bold",
  },
  closeButtonText: {
    fontSize: 24,
  },
  passwordInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#8F1414",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  numPad: {
    flex: 1,
    justifyContent: "center",
  },
  numRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  numButton: {
    width: width / 3 - 40,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#e0e0e0",
    borderRadius: 5,
    color: "#8F1414",
  },
  numText: {
    fontSize: 40,
  },
  confirmButton: {
    backgroundColor: "#842DC480",
    padding: 15,
    borderRadius: 5,
    alignSelf: "stretch",
    alignItems: "center",
    marginLeft: -30,
    marginRight: -30,
    marginBottom: -20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
  },
  //드랍다운 스타일
  dropdown: {
    backgroundColor: "white",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    zIndex: 1, // 다른 요소 위에 나타나도록 조절
    padding: 10,
  },
  dropdownSelected: {
    backgroundColor: "white",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    zIndex: 1, // 다른 요소 위에 나타나도록 조절
    padding: 10,
    borderColor: 'black',
  },
  dropdownOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  whiteBoxDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderColor: "#ddd",
    borderWidth: 1,
  },
});
