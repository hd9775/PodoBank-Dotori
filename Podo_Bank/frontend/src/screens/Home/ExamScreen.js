import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform // 추가
} from "react-native";
import HeaderComponent from "../Header/HeaderScreen";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";

// 링크들을 상수로 정의
// const GOOGLE_PLAY_STORE_LINK = "market://details?id=io.github.Antodo";
// const GOOGLE_PLAY_STORE_WEB_LINK =
//     "https://play.google.com/store/apps/details?id=io.github.Antodo";
const GOOGLE_PLAY_STORE_LINK = "market://details?id=io.github.Antodo";
const GOOGLE_PLAY_STORE_WEB_LINK =
    "https://play.google.com/store/apps/details?id=com.starbucks.co&pcampaignid=web_share";
const APPLE_APP_STORE_LINK =
    "itms-apps://itunes.apple.com/us/app/id1553604322?mt=8";
const APPLE_APP_STORE_WEB_LINK =
    "https://apps.apple.com/us/app/antodo-%EC%8B%AC%ED%94%8C%ED%95%9C-%EC%86%90%EA%B8%B0-%EC%A0%A4/%EB%A9%B4/id1553604322";

    // 인스타그램 링크
const INSTAGRAM_LINK = "instagram://user?username=coconut_dailyapp";
// 인스타그램이 설치되어 있지 않을 때 웹 링크
const INSTAGRAM_WEB_LINK = "https://www.naver.com/";
const STARBUCKS_LINK = "market://details?id=com.starbucks.co";
// 인스타그램이 설치되어 있지 않을 때 웹 링크
const STARBUCKS_WEB_LINK = "https://www.starbucks.co.kr/index.do";

export default function ExamScreen({ navigation }) {

   const handlePress = useCallback(async (url, alterUrl) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
        await Linking.openURL(url);
    } else {
        await Linking.openURL(alterUrl);
    }
}, []);

// 버튼 클릭 이벤트를 처리하는 함수
  const goToaAotherApp = useCallback(() => {
    if (Platform.OS === 'android') { 
      handlePress(GOOGLE_PLAY_STORE_LINK, GOOGLE_PLAY_STORE_WEB_LINK); 
    } else { 
      handlePress(APPLE_APP_STORE_LINK, APPLE_APP_STORE_WEB_LINK); 
    }
  }, [handlePress]);
  const goToInstaApp = useCallback(() => {
    if (Platform.OS === 'android') { 
      handlePress(INSTAGRAM_LINK, INSTAGRAM_WEB_LINK); 
    } else { 
      handlePress(APPLE_APP_STORE_LINK, APPLE_APP_STORE_WEB_LINK); 
    }
  }, [handlePress]);
  const goToStarbucksApp = useCallback(() => {
    if (Platform.OS === 'android') { 
      handlePress(STARBUCKS_LINK, STARBUCKS_WEB_LINK); 
    } else { 
      handlePress(APPLE_APP_STORE_LINK, APPLE_APP_STORE_WEB_LINK); 
    }
  }, [handlePress]);

  const PHONE_APP_LINK = "tel:"; // 전화 앱을 여는 링크

  const goToPhoneApp = useCallback(() => {
    if (Platform.OS === 'android') { 
      handlePress(PHONE_APP_LINK, STARBUCKS_WEB_LINK); 
    } else { 
      handlePress(APPLE_APP_STORE_LINK, APPLE_APP_STORE_WEB_LINK); 
    }
  }, [handlePress]);
  

 return (
     <View style={styles.container}>
         {/* Header */}
         <HeaderComponent title="앱연결하기" navigation={navigation}></HeaderComponent>

         <TouchableOpacity style={styles.customButton} onPress={goToaAotherApp}>
             <Text style={styles.linkText}>앱 연결하기</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.customButton} onPress={goToInstaApp}>
             <Text style={styles.linkText}>인스타그램 연결하기</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.customButton} onPress={goToStarbucksApp}>
             <Text style={styles.linkText}>스타벅스 연결하기</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.customButton} onPress={goToPhoneApp}>
             <Text style={styles.linkText}>전화앱 연결하기</Text>
         </TouchableOpacity>
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
    marginRight: 30,
    marginLeft: 30,
    borderRadius: 5,
  },
  linkText: {
    color: 'white',
  }
});
