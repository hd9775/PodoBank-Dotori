import React, { useEffect, useState, } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native"
import { Audio } from 'expo-av';
import FooterScreen from "../Components/FooterScreen"
import HeaderComponent from "../Components/HeaderScreen";
import { useDispatch, useSelector } from "react-redux"
import { purposeGetList } from "../../apis/purposeapi"
import { useIsFocused } from "@react-navigation/native"
import { EvilIcons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons';
import { planSaving } from "../../apis/planapi"

export default function SavingMoneyScreen({ navigation, route }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외
  const [sound, setSound] = useState();
  const isFocused = useIsFocused()

  const [currentTotalSavings, setcurrentTotalSavings] = useState(0)
  const [purposeList, setPurposeList] = useState([])

  const [accountName, setAccountName] = useState(route.params.accountName)
  const [accountSeq, setAccountSeq] = useState(route.params.accountSeq)
  const [planSeq, setPlanSeq] = useState(route.params.planSeq)
  const [totalSavings, setTotalSavings] = useState(route.params.totalSavings)
  const [currentAccountAmount, setCurrentAccountAmount] = useState(route.params.currentAccountAmount)
  const [addSavings, setAddSavings] = useState(null)
  const [selectItem, setSelectItem] = useState(null)
  const [editAmount, setEditAmount] = useState("");


  const playSound = async() => {
    const { sound } = await Audio.Sound.createAsync( require('../../assets/insertCoin.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  const getRandomBorderColor = () => {
    const colors = ["#1DA9F8", "#30D71F", "#FF77E1"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const doPurposeGetList = async () => {
    try{
      const response = await purposeGetList(accessToken, grantType)
      if(response.status === 200){
        const modifiedPurposeList = response.data.purposeList.map((item) => ({
          ...item,
          savingAmount: 0, // 기본값으로 0을 설정
        }));
  
        setPurposeList(modifiedPurposeList);
        setcurrentTotalSavings(response.data.currentTotalSavings)
      }else{
      }
    }catch(error){
    }

  }

  const handlePlanSaving = () => {
    const allSaving = purposeList.reduce((total, item) => total + item.savingAmount, 0)
    if(currentAccountAmount >= allSaving){
      doPlanSaving()
    }else{
      Alert.alert("","현재 계좌 보유액보다 많은 금액을 저축할 수 없습니다.")
    }
  }
  const doPlanSaving = async () => {
    const purposeSavingList = purposeList.map((purpose) => ({
      purposeSeq: purpose.purposeSeq,
      savingAmount: purpose.savingAmount,
    }))
    
    const savingData = {
      planSeq:planSeq,
      purposeSavingList:purposeSavingList,
      totalSaving:purposeList.reduce((total, item) => total + item.savingAmount, 0)
    }

    try{
      const response = await planSaving(savingData, accessToken, grantType)
      if(response.status === 200){
        navigation.reset({
          index: 0,
          routes: [{ name: 'SavingCompleteScreen' }],
        });
        playSound()
      }else{
      }
    }catch(error){
    }

  }

  const handleInputSavingValue = () => {
    if(editAmount){
      const updatedPurposeList = purposeList.map((purpose) => ({
        ...purpose,
        savingAmount: purpose.purposeSeq === selectItem ? parseInt(editAmount, 10) : purpose.savingAmount,
      }));
      setPurposeList(updatedPurposeList);
    }
  
    setSelectItem(null);
    setEditAmount("")
  }


  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(()=>{
    const allSaving = purposeList.reduce((total, item) => total + item.savingAmount, 0)
    totalSavings
    if(allSaving > totalSavings){
      setAddSavings(allSaving - totalSavings)
    }else{
      setAddSavings(null)
    }
  },[purposeList])

  useEffect(() => {
    if(isFocused){
      doPurposeGetList()
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="저축하기"
        navigation={navigation}
        cancelNavi="MainPageScreen"
      ></HeaderComponent>

      {/* 최신순 & 저축액 */}
      <View style={styles.dateAmountContainer}>
        <View>
          <View style={{flexDirection:"row"}}>
            <Text style={styles.latest}>저축하기</Text>
            <Image
              style={styles.savingImage}
              source={require("../../assets/images/sproutIcon.png")}
            />
          </View>
          <Text style={styles.currentSavings}>저축을 통해 도토리를 모을 수 있어요!</Text>
        </View>
      </View>

      <View>
        <View style={styles.savingAccount}>
          <Text style={styles.savingAccountText}>절약 금액</Text>
          <Text style={styles.savingAccountText}>{totalSavings.toLocaleString()}원</Text>
        </View>

        <View style={styles.savingAccount}>
          <Text style={styles.savingAccountText}>추가 저축액</Text>
          <Text style={styles.savingAccountText}>{addSavings!=null ? addSavings.toLocaleString():0}원</Text>
        </View>
      </View>


      <View style={styles.divider}></View>

      <FlatList
        data={purposeList}
        renderItem={({ item, index }) => {
          const borderColor = getRandomBorderColor();
          return (
            <View style={[styles.targetContainer, { borderColor }]}
              key={index}
            >
              <Text style={styles.targetName}>{item.title}</Text>
              <View style={styles.rightAlignContainer}>
                {item.purposeSeq != selectItem
                  ?
                    (<TouchableOpacity style={{flexDirection:"row"}}
                      onPress={()=>{
                        setSelectItem(item.purposeSeq)
                      }}
                    >  
                      <Text style={styles.currentAmount}>
                        {item.savingAmount.toLocaleString()}원
                      </Text>
                      <EvilIcons name="pencil" size={24} color="black" />
                    </TouchableOpacity>)
                  :
                    <View style={{flexDirection:"row"}}>
                      <TextInput
                        style={{borderWidth:1, borderColor:'black', width:100, marginRight:10}}
                        keyboardType="number-pad"
                        placeholder="예) 150000"
                        value={editAmount}
                        onChangeText={(text) => setEditAmount(text)}
                        onSubmitEditing={()=>{
                          handleInputSavingValue()
                        }}
                      />
                      <TouchableOpacity
                        style={{alignSelf:"center"}}
                        onPress={() => {
                          handleInputSavingValue()
                        }}
                      >
                        <AntDesign name="checkcircleo" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                }
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.purposeSeq}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("PurposeCreate1Screen")}
          >
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        }
      />
      <View style={{marginVertical:50, alignSelf:'center'}}>
        <Text style={{fontSize:16, textAlign:'center'}}>총 저축액</Text>
        <Text style={{fontSize:24, textAlign:'center'}}>
          {purposeList.reduce((total, item) => total + item.savingAmount, 0).toLocaleString()}원
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.button, {backgroundColor:"#FF965C"}]}
        onPress={() => {
          console.log(purposeList)
          handlePlanSaving()
        }}
      >
        <Text style={styles.buttonText}>저축하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  topImage: {
    alignSelf: "center",
    marginTop: 20,
    resizeMode: "contain",
    width: 70,
    height: 70,
  },
  savingImage: {
    alignSelf: "center",
    resizeMode: "contain",
    width: 50,
    height: 50,
  },
  dateAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  latest: {
    // 여기에 텍스트 스타일 추가...
    // backgroundColor: "#EFF3F6",
    fontWeight: "bold",
    borderRadius: 10,
    fontSize: 30,
    paddingHorizontal: 10,
    alignSelf:'flex-end'
  },
  amount: {
    // 여기에 텍스트 스타일 추가...
    fontSize: 20,
  },
  currentSavings: {
    color: "#9D9D9D",
    padding: 10,
    marginBottom: 20,
    // textAlign: "right",
  },
  middleImageContainer: {
    position: "absolute", // Set position to absolute
    alignSelf: "center",
    zIndex: 1, // Make sure the image is on top of the divider
    top: "20%", // Adjust this to position the image correctly over the divider
  },
  middleImage: {
    // 여기에 이미지 스타일 추가...
    width: 100,
    height: 110,
  },
  divider: {
    marginVertical: 15, // Height of the middleImage divided by 2, adjust this value as needed
    height: 10,
    backgroundColor: "#FFF2DE", // or any color you'd like
  },
  targetContainer: {
    borderRadius: 15,
    borderColor: "#A6A6A6",
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 15,
    marginTop: 20,
    flexDirection: "column",

    elevation: 5,
    backgroundColor: "white",
  },

  targetName: {
    marginBottom: 10,
    fontSize: 20,
    flex: 1,
  },

  rightAlignContainer: {
    alignItems: "flex-end",
    // justifyContent:"flex-end",
    flex: 1,
  },

  currentAmount: {
    fontSize: 16,
    // marginBottom: 10,
  },

  targetAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  targetAmountText: {
    fontSize: 12,
    flex: 1,
  },

  targetAmount: {
    fontSize: 12,
    textAlign: "right",
    flex: 1,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderColor: "#A6A6A6",
    borderWidth: 1,
    marginHorizontal: 15,
    height: 70,
    marginTop: 20,
    borderStyle: "dashed", // 점선 테두리 추가
  },
  addText: {
    color: "#A6A6A6",
    fontSize: 24,
  },
  savingAccount:{
    flexDirection:"row", 
    alignSelf:"center", 
    width:"60%", 
    justifyContent:"space-between",
    margin: 10,
  },
  savingAccountText:{
    fontSize:16, 
  },
  button: {
    height: 40,
    backgroundColor: "#FF965C",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
