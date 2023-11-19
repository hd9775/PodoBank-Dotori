import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import HeaderComponent from "../Header/HeaderScreen";
import { accountCreate, } from '../../apis/accountapi'
import { useDispatch, useSelector } from "react-redux";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";

export default function AccountRestrictionScreen({ navigation, route }) {
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  const [createInfo, setCreateInfo] = useState(route.params.createInfo)
  const [isChecked, setChecked] = useState(false);
  const accessToken = useSelector((state) => state.user.accessToken)
  const dispatch = useDispatch()

  const handleIsSuccess = () => {
    if(isChecked){
      handleAccountCreate()
    }else{
      Alert.alert('미동의','계좌를 개설하시려면 동의서를 확인하고 동의를 눌러주시기 바랍니다.')
    }
  }

  const handleAccountCreate = async () =>{
    console.log(createInfo)
    const response = await accountCreate(createInfo, accessToken)
    console.log(response.data)
    if(response.status===200){
      navigation.reset({
        index: 0,
        // routes: [{ name: 'OpenAccountCompleteScreen', params: { name: userInfo.name },}],
        routes: [{ name: 'OpenAccountCompleteScreen', params: { accountInfo: response.data },}],
      });
      console.log('bad400 계좌 생성에 성공했습니다..')
    }else if(response.status===400){
      console.log('bad400 계좌 생성에 실패했습니다.')
    }else if(response.status===401){
      console.log('bad401 권환이 없어 계좌 생성에 실패했습니다.')
    }else if(response.status===429){
      console.log('bad429 계좌 비밀번호 형식오류로 계좌 생성에 실패했습니다.')
    }else{
      console.log('오류발생: 계좌 생성에 실패했습니다.')
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <HeaderComponent navigation={navigation} title="계좌개설" />

      <View style={styles.box}>
        <Text style={styles.boldText}>통장 양도금지 확인</Text>
        <View style={styles.divider} />
        <Text>
          통장, 현금카드를 타인에게 양도하는 경우 손해 배상책임을 부담할 수
          있고, 전자금융거래법에 의해 처벌받을 수 있습니다. 또한 입출금이
          자유로운 예금 약관에 따라 계좌개설 등의 금융거래가 제한될 수 있습니다.
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.boldText}>통장 양도금지 확인</Text>
        <View style={styles.divider} />
        <Text>
          금융사고 방지를 위해 싸피뱅크 입출금통장은{" "}
          <Text style={styles.blueText}>금융거래 한도계좌</Text>로 개설됩니다.
          이후 고객님의 싸피뱅크 거래내역 등을 통해 금융거래 목적이 확인되면,
          일반계좌로 전환되어 한도가 상향됩니다.
        </Text>
        <View style={styles.innerBox}>
          <View style={styles.highlightedRow}>
            <Text style={styles.highlightText}>금융거래 한도계좌</Text>
            <Text style={styles.normalText}>(1일 최대한도)</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.row}>
            <Text>포도은행앱 일체</Text>
            <Text>200만원</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text>ATM 이체 및 출금</Text>
            <Text>이체 100만원/출금 100만원</Text>
          </View>
        </View>
        <View style={styles.innerBox}>
          <View style={styles.highlightedRow}>
            <Text style={styles.highlightText}>
              금융거래 한도계좌(미성년자)
            </Text>
            <Text style={styles.normalText}>(1일 최대한도)</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.row}>
            <Text>싸피뱅크앱 이체, ATM 이체 및 출금</Text>
            <Text>통합 100만원</Text>
          </View>
        </View>
        <View style={styles.innerBox}>
          <View style={styles.highlightedRow}>
            <Text style={styles.highlightText}>일반계좌</Text>
            <Text style={styles.normalText}>(1일 최대한도)</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.row}>
            <Text>포도은행앱 일체</Text>
            <Text>5억원(OTP기준)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text>ATM 이체 및 출금</Text>
            <Text>이체 3,000만원/출금 600만원</Text>
          </View>
        </View>
      </View>
      <View style={styles.checkContainer}>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => setChecked(!isChecked)}
        >
          <Text style={isChecked ? styles.checkIcon : null}>
            {" "}
            {isChecked ? "✔" : ""}{" "}
          </Text>
        </TouchableOpacity>
        <Text style={styles.confirmText}>
          {/* 위 안내에 대해 확인하고 이체합니다. */}
          위 안내에 대해 확인하고 개설합니다.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => {
          // navigation.navigate("OpenAccountCompleteScreen")
          handleIsSuccess()
        }}
      >
        <Text style={styles.applyText}>신청하기</Text>
      </TouchableOpacity>
      {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  box: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    // marginTop: 10,
    // marginBottom: 10,
  },
  blueText: {
    color: "blue",
  },
  innerBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  highlightedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0", // 회색 배경색
    padding: 10,
  },
  checkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkIcon: {
    fontSize: 18, // 폰트 크기는 원하는대로 조절 가능
    color: "black", // 체크 표시 색상
  },
  confirmText: {
    flex: 1,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: "#842DC480",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  applyText: {
    color: "#fff",
    fontWeight: "bold",
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
});
