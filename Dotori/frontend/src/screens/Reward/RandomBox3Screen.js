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

export default function RandomBox3Screen({ navigation, route }) {
  const [prizeAmount, setPrizeAmount] = useState(route.params.prizeAmount)
  const [openSound, setOpenSound] = useState();

  const isFocused = useIsFocused();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const playopenSound = async() => {
    const { sound } = await Audio.Sound.createAsync( require('../../assets/bbak.mp3')
    );
    setOpenSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return openSound
      ? () => {
        openSound.unloadAsync();
        }
      : undefined;
  }, [openSound]);

  useEffect(()=>{
    if(isFocused){
      playopenSound()
    }
  }, [isFocused])
  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <View style={{flex:0.15}}></View>

      <View style={styles.container}>
        <View>
          <Image
            source={require("../../assets/images/Hamster/giftHamster2.png")}
            style={{width:windowWidth*0.7, height:windowWidth*0.7}}
          />
        </View>
        <View>
          <Text style={{fontSize:40, fontWeight:"bold"}}>{prizeAmount}원</Text>
          <Text style={{textAlign:'center'}}>축하합니다!</Text>
        </View>
      </View>
      <View style={{width: "80%", alignSelf: "center", alignItems:'center',}}>
        <TouchableOpacity
            style={[
              styles.button,
            ]}
            onPress={() => {
              navigation.navigate("RandomBox4Screen",{prizeAmount:prizeAmount})
            }}
          >
            <Text style={styles.buttonText}>저축하기</Text>
          </TouchableOpacity>
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