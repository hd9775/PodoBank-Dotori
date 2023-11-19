import React, { useState } from "react";
import { Alert } from "react-native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import {userOpenRandomBox} from "../../apis/userapi"

export default function RandomBox1Screen({ navigation, route }) {
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)

  const [coin, setCoin] = useState(route.params.coin);
  const [selectedCoin, setSelectedCoin] = useState(0);
  
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;


  const handleCoinSelect = (coinValue) => {
    setSelectedCoin(coinValue);
  };

  const handleOpen = () => {
    if(!selectedCoin){
      Alert.alert('','사용할 코인 갯수를 선택해 주세요.')
    }else if(coin < selectedCoin){
      Alert.alert('',`소지한 코인보다 많은 랜덤박스를 열 수는 없습니다.${'\n'}${'\n'}현재 코인 갯수${coin}`)
    }else{
      doUserOpenRandomBox()
    }
  };

  const doUserOpenRandomBox = async () => {
    try{
      const response = await userOpenRandomBox(selectedCoin, accessToken, grantType)
      if(response.status === 200){
        navigation.reset({
          index: 0,
          routes: [{ name: "RandomBox2Screen", params: {prizeAmount: response.data,} }],
        })
      }else{
      }
    }
    catch(error){
    }
  }

  
  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <View style={styles.container}>
        <View style={{flex:0.2, justifyContent:'flex-end', alignItems:'flex-end'}}>
          <Text style={styles.coinText}>{coin}개</Text>
          <Image
            source={require("../../assets/images/cloud.png")}
            style={[styles.coinImage, {top:windowHeight*0.11}]}
          />
        </View>

        <View style={{flex:0.2, justifyContent:'center'}}>
          <Text style={styles.headerText}>꽝 없는 랜덤박스</Text>
          <Text style={styles.infoText}>
            코인 1개, 2개, 3개로 랜덤박스를 뽑을 수 있어요.
          </Text>
          <Text style={styles.infoText}>
            코인을 많이 줄수록 더 좋은 상품이 나온답니다.
          </Text>

        </View>
        <View style={[styles.imagesContainer, {flex:0.2}]}>
          <TouchableOpacity onPress={() => handleCoinSelect(1)}>
            <Image
              source={require("../../assets/images/coin1.png")}
              style={[styles.image, {width:windowWidth*0.5/3, height: windowWidth*0.5/3}, selectedCoin !== 1 && styles.dimImage]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCoinSelect(2)}>
            <Image
              source={require("../../assets/images/coin2.png")}
              style={[styles.image, {width:windowWidth*0.5/3, height: windowWidth*0.5/3}, selectedCoin !== 2 && styles.dimImage]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCoinSelect(3)}>
            <Image
              source={require("../../assets/images/coin3.png")}
              style={[styles.image, {width:windowWidth*0.5/3, height: windowWidth*0.5/3}, selectedCoin !== 3 && styles.dimImage]}
            />
          </TouchableOpacity>
        </View>

        <View style={{flex:0.3}}>
          <TouchableOpacity style={[styles.button]} 
            onPress={() => {
              handleOpen()
            }}
          >
            <Text style={styles.buttonText}>랜덤받스 받기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: "center",
    width: "80%",
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    marginVertical: 10,
    color: "#757575",
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:'center',
  },
  image: {
    width: 80,
    height: 80,
    marginHorizontal: 10,
  },
  dimImage: {
    opacity: 0.5,
  },
  button: {
    backgroundColor: "#FF965B",
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  coinText:{
    margin:20,
    marginRight:30,
    fontSize:18, 
    fontWeight:'bold'
  },
  coinImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    right: 0,
  },
});