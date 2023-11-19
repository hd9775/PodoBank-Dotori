import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import HeaderComponent from "../Components/HeaderScreen";
import { useDispatch, useSelector } from "react-redux";
import { planSpecificationList } from "../../apis/planapi"

export default function ReceipeSelectScreen({ navigation }) {
  // 토큰
  const grantType =  useSelector((state)=>state.user.grantType)
  const accessToken =  useSelector((state)=>state.user.accessToken)
  const refreshToken =  useSelector((state)=>state.user.refreshToken)
  const dispatch = useDispatch()
  // 그 외
  
  const [specificationList, setSpecificationList] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [selectedReceipe, setSelectedReceipe] = useState(null)

  const handleViewReceipe = () => {
    if(selectedAccount && (selectedReceipe != null)){
      navigation.navigate("ReceipeScreen", {
        selectedAccount,
        selectedReceipe,
      });
    }else{
      Alert.alert('','확인할 수 있는 명세서가 없습니다.')
    }
  };

  const changeDayForm = (changingDay) =>{
    const year = changingDay.slice(0,4)
    const month = changingDay.slice(5,7)
    const day = changingDay.slice(8,10)
    return `${year}.${month}.${day}`
  }

  const doPlanSpecificationList = async () =>{
    try{
      const response = await planSpecificationList(accessToken, grantType)
      if(response.status === 200){
        setSpecificationList(response.data)
        if(response.data.length > 0){
          setSelectedAccount(response.data[0].accountTitle)
          setSelectedReceipe(response.data[0].planSeq)
        }
      }else{
      }
    }catch(error){
    }
  }

  useEffect(()=>{
    doPlanSpecificationList()
  }, [])

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="명세서 보기"
        navigation={navigation}
        cancelNavi="MyPageScreen"
      ></HeaderComponent>

      <View style={styles.container}>
        <Text style={styles.descriptionText}>
          명세서의 기간을 선택해 주세요
        </Text>


        {specificationList.length>0
          ?
            (
            <View style={styles.pickerContainer}>
              <View style={styles.pickerItem}>
                <View style={{ alignItems: "center", borderBottomWidth: 1 }}>
                  <Text style={styles.dropdownLabel}>계좌 이름</Text>
                </View>
                <Picker
                  style={styles.dropdownPicker}
                  selectedValue={selectedAccount}
                  onValueChange={(itemValue) => setSelectedAccount(itemValue)}
                  itemStyle={{ textAlign: "center" }}
                >
                  {specificationList
                    .filter((receipe, index, self) =>
                      index === self.findIndex((r) => r.accountTitle === receipe.accountTitle)
                    )
                    .map((uniqueReceipe, index) => (
                      <Picker.Item
                        key={index}
                        label={uniqueReceipe.accountTitle}
                        value={uniqueReceipe.accountTitle}
                      />
                    ))}
                </Picker>
              </View>
              <View style={styles.pickerItem}>
                <View style={{ alignItems: "center", borderBottomWidth: 1 }}>
                  <Text style={styles.dropdownLabel}>기간</Text>
                </View>
                <Picker
                  style={styles.dropdownPicker}
                  selectedValue={selectedReceipe}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedReceipe(itemValue);
                  }}
                  itemStyle={{ textAlign: "center" }}
                >
                  {specificationList.map((receipe, index) => {
                    if(receipe.accountTitle === selectedAccount){
                      return (
                        <Picker.Item
                          key={index}
                          label={`${changeDayForm(receipe.startAt)} ~ ${changeDayForm(receipe.endAt)}`}
                          value={receipe.planSeq}
                        />
                      )
                    }
                  })}
                </Picker>
              </View>
            </View>)
          : 
            (
              <View style={styles.pickerContainer}>
                <View style={styles.pickerItem}>
                  <View style={{ alignItems: "center", borderBottomWidth: 1 }}>
                    <Text style={styles.dropdownLabel}>계좌 이름</Text>
                  </View>
                  <Picker
                    style={styles.dropdownPicker}
                    selectedValue={selectedAccount}
                    onValueChange={()=>{}}
                    itemStyle={{ textAlign: "center" }}
                  >
                        <Picker.Item
                          label="해당없음"
                          value=""
                        />
                  </Picker>
                </View>
                <View style={styles.pickerItem}>
                  <View style={{ alignItems: "center", borderBottomWidth: 1 }}>
                    <Text style={styles.dropdownLabel}>기간</Text>
                  </View>
                  <Picker
                    style={styles.dropdownPicker}
                    selectedValue={selectedReceipe}
                    onValueChange={()=>{}}
                    itemStyle={{ textAlign: "center" }}
                  >
                    
                    <Picker.Item
                      label="해당없음"
                      value=""
                    />
                  </Picker>
                </View>
              </View>)
        }
        <TouchableOpacity
          style={styles.viewReceipeButton}
          onPress={handleViewReceipe}
        >
          <Text style={styles.viewReceipeButtonText}>명세서 보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 15,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  selectReceipeText: {
    fontSize: 24,
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    justifyContent: "center",
  },
  descriptionText: {
    fontSize: 20,
    textAlign: "left",
    fontWeight: "bold",
    marginTop: -100,
    marginBottom: 60,
    marginLeft: "5%",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: "5%",
  },
  pickerItem: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
  dropdownLabel: {
    fontSize: 16,
  },
  dropdownPicker: {
    height: 40,
    borderWidth: 1,
    borderColor: "#7B7B7B",
    borderRadius: 8,
  },
  viewReceipeButton: {
    width: "100%",
    backgroundColor: "#FF965C",
    borderRadius: 8,
    padding: 8,
    alignSelf: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  viewReceipeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
