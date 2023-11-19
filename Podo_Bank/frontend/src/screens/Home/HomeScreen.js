import React,{useEffect, useState} from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { AntDesign, Octicons  } from "@expo/vector-icons"; // AntDesign과 Entypo 아이콘 라이브러리 추가
import FooterScreen from "../Header/FooterScreen";
import HeaderComponent from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";
import { useDispatch, useSelector } from "react-redux";
import { userInformationInquiry, } from '../../apis/userapi'
import { accountListInquiry, } from '../../apis/accountapi'
import { setUserInfo } from '../../redux/slices/auth/user'
import { changeTotalBalance } from '../../redux/slices/accounts/account'

export default function HomeScreen({ navigation }) {
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  const accessToken = useSelector((state) => state.user.accessToken)
  const userInfo = useSelector((state) => state.user.userInfo)
  const [accountList, setAccountList] = useState([])
  const [totalBalance, setTotalBalance] = useState(0)
  // const totalBalanceRedux = useSelector((state)=> state.account.totalBalance)

  const dispatch = useDispatch()
  //대표계좌 axios로 가져와야함

  //들어올 때 axios로 유저 정보 받아야함
  const hanldeUserInformationInquiry = async() =>{
    const response = await userInformationInquiry(accessToken)
    if(response.status===200){
      dispatch(setUserInfo(response.data))
    }else if(response.status===400){
      console.log('bad400 회원정보를 받아올 수 없습니다.')
    }else if(response.status===401){
      console.log('bad401 회원정보를 받아올 수 없습니다.')
    }else if(response.status===403){
      console.log('bad403 회원정보를 받아올 수 없습니다.')
    }else{
      console.log('오류발생: 회원정보를 받아올 수 없습니다.')
    }
  }

  // 계좌 목록 불러오는 함수
  const handleAccountListInquiry = async()=>{
    const response = await accountListInquiry(accessToken)
    if(response.status===200){
      console.log('계좌 목록을 받아왔습니다.')
      setAccountList(response.data)
    }else if(response.status===400){
      console.log('bad400 조회실패로 계좌 목록을 받아올 수 없습니다.')
    }else if(response.status===401){
      console.log('bad401 권한 없음으로 계좌 목록을 받아올 수 없습니다.')
    }else{
      console.log('오류발생: 계좌 목록을 받아올 수 없습니다.')
    }
  }

  // 계좌 상세페이지로 이동하기
  const gotoAccountDetail = (account) => {
    navigation.navigate("AccountDetailScreen", {account:account});
  }

  // 계좌 번호 형식 맞추는 함수
  const settingAccountNumber = (accountNumber) =>{
    return `${accountNumber.slice(0,4)}-${accountNumber.slice(4,6)}-${accountNumber.slice(6)}`
  }

  // 페이지가 로드될 때 hanldeUserInformationInquiry() 함수 실행
  useEffect(() => {
    hanldeUserInformationInquiry()
    handleAccountListInquiry()
  }, []);

  useEffect(()=>{
    const tmpTotalBalance = accountList.reduce((acc, account) => {
      const balance = parseFloat(account.balance); // 문자열로 된 balance 값을 숫자로 변환
      return acc + balance;
    }, 0); // 초기값 0으로 설정

    setTotalBalance(tmpTotalBalance)
    dispatch(changeTotalBalance(tmpTotalBalance))
  }, [accountList])

  return (
    <View style={styles.container}>
      {/* <HeaderComponent
        title="홈"
        navigation={navigation}
        showHome={false}
      /> */}
      <View style={{ justifyContent: 'center', alignItems: 'center', 
        // marginVertical: 20, 
        flex:0.12,
      }}>
        <Image
          source={require("../../assets/images/podo_bank_name.png")}
          style={{ height: 25, resizeMode: 'contain' }}
        />
      </View>
      
      {/* 사용자 이름 */}
      <View style={{flex:0.15,}}>
        <View style={[styles.nameContainer,]}>
          {userInfo?
              (<Text style={styles.userNameBold}>{userInfo.name}</Text>)
              :(<Text style={styles.userNameBold}>회원</Text>)
            }
          <Text style={styles.userName}>님</Text>
        </View>
        <Text style={styles.totalBalanceBold}>총액 {totalBalance.toLocaleString()}원</Text>
      </View>
      
      {/* 보유 계좌 목록 */}
      <ScrollView
        style={[styles.scrollViewContainer,{flex:0.85}]}
        showsVerticalScrollIndicator={false}
      >
        {accountList.map((account, index) => (
          <View key={index} style={styles.accountBox}>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={() => {
                gotoAccountDetail(account)
              }}
            >
              <View style={styles.bankInfo}>
                <View style={styles.bankLogoContainer}>
                  <Image
                    source={require("../../assets/images/logo_podo.png")}
                    style={styles.bankLogo}
                  />
                </View>
                <Text style={styles.bankName}>포도은행 통장</Text>
              </View>
              <Text style={styles.accountNumber}>{settingAccountNumber(account.accountNumber)}</Text>
              <Text style={styles.balance}>{(Math.floor(account.balance)).toLocaleString()}원</Text>
            </TouchableOpacity>
            
            {/* 계좌 이체 버튼 */}
            <TouchableOpacity
              style={styles.transferButton}
              // onPress={() => navigation.navigate("TransferScreen", {account:account})}
              onPress={() => navigation.navigate("TransferScreen", {accountNumber:account.accountNumber})}
            >
              <Text style={styles.buttonText}>이체</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {/* 계좌 추가 버튼 */}
        <TouchableOpacity
          style={styles.addAccountBox}
          onPress={() => {
            navigation.navigate("AccountWhatMakeScreen");
          }}
        >
          <AntDesign name="pluscircleo" size={25} color="black" />
        </TouchableOpacity>

        {/* 설정 버튼 */}
        <TouchableOpacity style={styles.settingsContainer}
          onPress={()=>{
            Alert.alert('', '차후 기능을 추가할 예정입니다. 기대해주세요❤')
          }}
        >
          <Octicons name="gear" size={16} color="black" />
          <Text style={styles.settingsText}>  대표계좌 설정</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={{flex:0.1,}}>
        {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
        <FooterScreen navigation={navigation} />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "flex-start",
  //   paddingHorizontal: 20,
  //   // paddingTop: 100,
  //   paddingTop: 50,
  //   backgroundColor: "white",
  // },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingBottom: 0,
    
  },
  accountNumber: {
    fontSize: 15,
    marginLeft: 25,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  scrollViewContainer: {
    flexGrow: 1,
    width: "100%", // ScrollView의 가로 너비를 화면 가로 너비로 설정
  },  
  balance: {
    fontSize: 25,
    marginTop: 20,
    marginBottom: 30,
    // marginLeft: 25,
    // marginRight: 25,
    // alignSelf: "flex-start",
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    // fontWeight: "bold",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 0,
  },
  userNameBold: {
    fontSize: 24,
    fontWeight: "bold",
  },
  totalBalanceBold: {
    fontSize: 20,
    fontWeight: "500",
    alignSelf:'flex-end'
  },
  userName: {
    fontSize: 24,
  },
  // accountBox: {
  //   width: "100%",
  //   borderRadius: 10,
  //   padding: 20,
  //   backgroundColor: "white",
  //   marginBottom: 20,
  //   borderColor: "#757575",
  //   borderWidth: 1,
  //   // 그림자 스타일 추가
  //   elevation: 10,
  //   backgroundColor: "white",
  // },
  accountBox: {
    // width: "100%",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "white",
    marginBottom: 20,
    borderColor: "#757575",
    borderWidth: 1,
    // 그림자 스타일 추가
    elevation: 10,
    backgroundColor: "white",
  },
  bankInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bankLogoContainer: {
    width: 30, // 여기서 사이즈는 예시입니다. 원하는 사이즈로 조절해주세요.
    height: 30, // 여기서 사이즈는 예시입니다. 원하는 사이즈로 조절해주세요.
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  bankLogo: {
    width: 25,
    height: 25,
  },
  bankName: {
    fontSize: 16,
    // fontWeight: "bold",
  },
  transferButton: {
    marginTop: 20,
    backgroundColor: "#8B0FD750",
    padding: 10,
    borderRadius: 3,
    alignItems: "center",
    // marginLeft: 25,
    // marginRight: 25,
  },
  addAccountBox: {
    width: "100%",
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
    borderColor: "#757575",
    borderWidth: 1,
    elevation: 10,
    backgroundColor: "white",
  },
  settingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  settingsIcon: {
    marginRight: 10,
  },
  settingsText: {
    fontSize: 16,
  },
});
