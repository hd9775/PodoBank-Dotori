import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";

export default function RandomBoxLoadingScreen({ navigation, route }) {
  const [prizeAmount, setPrizeAmount] = useState(route.params.prizeAmount)
  const [money1, setMoney1] = useState(0)
  const [money2, setMoney2] = useState(0)
  const [money3, setMoney3] = useState(0)
  const [isQuit, setIsQuit] = useState(false)

  const isFocused = useIsFocused();

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const goRandomBox3Screen = () => {
    setIsQuit(true)
    navigation.navigate("RandomBox3Screen", {prizeAmount:prizeAmount})
  }

  function randomNum() {
    return Math.floor(Math.random() * (10 - 0) + 0)
  }

  const formatNumber = (num) => {
    if (num < 10) {
      return `00${num}`;
    } else if (num < 100) {
      return `0${num}`;
    } else {
      return num.toString();
    }
  }

  useEffect(()=>{
    if(isFocused){
      setIsQuit(false)
      const timer = setInterval(() => {
        setMoney1(randomNum())
        setMoney2(randomNum())
        setMoney3(randomNum())
      }, 10);
      const timeout = setTimeout(() => {
        goRandomBox3Screen()
      }, 3000);
      return () => {
        clearInterval(timer)
        clearTimeout(timeout)
      }
    }
  }, [isFocused])

  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <View style={{flex:0.3}}>

      </View>

      <View style={styles.container}>
        <View>
          <Image
            source={require("../../assets/images/loadingGift.gif")}
            style={{width:windowWidth*0.7, height:windowWidth*0.7}}
          />
        </View>
        <View>
          <Text style={{textAlign:'center', fontSize:24, fontWeight:'bold', padding:10}}>얼마가 당첨될까요?</Text>
          <Text style={{textAlign:'center', fontSize:20, padding:10} }>
            { isQuit
              ?`${formatNumber(prizeAmount)}원`
              :`${money1}${money2}${money3}원`
            }
          </Text>
        </View>
      </View>
        
        <View style={{flex:0.2}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
    alignSelf: "center",
    alignItems:'center',
    justifyContent: "space-evenly",
    width: "80%"
  },
  questionMark:{
    position:'absolute',
  },
  button: {
    backgroundColor: "#FF965C",
    borderRadius: 8,
    width: "100%",
    padding: 10,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
});