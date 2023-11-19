import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

export default function RandomBoxCompleteScreen({ navigation, route }) {
  const [prizeAmount, setPrizeAmount] = useState(route.params.prizeAmount)
  const [selectedAccountName, setSelectedAccountName] = useState(route.params.selectedAccountName)

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;


  useEffect(()=>{
    
  }, [])
  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <View style={{flex:0.15}}></View>

      <View style={styles.container}>
        <View>
          <Image
            source={require("../../assets/images/Hamster/financeHamster.png")}
            style={{width:windowWidth*0.7, height:windowWidth*0.7}}
          />
        </View>
        <View>
          <Text style={{fontSize:20, textAlign:'center'}}>{selectedAccountName} 당첨금</Text>
          <Text style={{fontSize:40, fontWeight:"bold", textAlign:'center'}}>{prizeAmount}원</Text>
          <Text style={{fontSize:20, textAlign:'center'}}>을 {selectedAccountName} 계좌로 이체했어요!</Text>
        </View>
      </View>
      <View style={{width: "80%", alignSelf: "center", alignItems:'center',}}>
        <TouchableOpacity
            style={[
              styles.button,
            ]}
            onPress={() => {
              navigation.navigate("MainPageScreen")
            }}
          >
            <Text style={styles.buttonText}>메인페이지로 가기</Text>
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