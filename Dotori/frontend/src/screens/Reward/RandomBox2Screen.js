import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { Audio } from 'expo-av';
import { useIsFocused } from "@react-navigation/native";


export default function RandomBox2Screen({ navigation, route }) {
  const [prizeAmount, setPrizeAmount] = useState(route.params.prizeAmount)
  const [sound1, setSound1] = useState();

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const isFocused = useIsFocused();

  const playSound1 = async() => {
    const { sound } = await Audio.Sound.createAsync( require('../../assets/dodoong.mp3')
    );
    setSound1(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound1
      ? () => {
        sound1.unloadAsync();
        }
      : undefined;
  }, [sound1]);


  useEffect(()=>{
    if(isFocused){
      playSound1()
    }
  }, [isFocused])
  
  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <View style={{flex:0.15}}></View>

      <View style={styles.container}>
        <View style={{}}>
          <Text style={{fontWeight:"bold", fontSize:26}}>RANDOM BOX</Text>
        </View>
        <TouchableOpacity
          onPress={()=>{
            navigation.navigate("RandomBoxLoadingScreen", {prizeAmount:prizeAmount})
          }}
        >
          <Image
            source={require("../../assets/images/questionMark.png")}
            style={[styles.questionMark, {right:windowWidth*0.03, top:-windowHeight*0.03, width:80, height:80, transform: [{ rotate: '25deg' }] }]}
          />
          <Image
            source={require("../../assets/images/Hamster/giftHamster1.png")}
            style={{width:windowWidth*0.7, height:windowWidth*0.7}}
          />
        </TouchableOpacity>
        <View>
          <Text style={{fontSize:24}}>
            상자를 눌러주세요
          </Text>
        </View>
      </View>
      
      <View style={{flex:0.2}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.6,
    alignSelf: "center",
    alignItems:'center',
    justifyContent: "space-evenly",
    width: "80%"
  },
  questionMark:{
    position:'absolute',
  }
});