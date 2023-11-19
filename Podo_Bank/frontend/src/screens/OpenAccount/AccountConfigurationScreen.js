import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import HeaderComponent from "../Header/HeaderScreen";
import { AntDesign } from "@expo/vector-icons";
import {accountTypeInquiry} from "../../apis/accountapi"
import { useSelector } from "react-redux";
import AccessTokenRefreshModalScreen from "../Modal/AccessTokenRefreshModalScreen";

const { height, width } = Dimensions.get("window");


export default function AccountConfigurationScreen({ navigation, route }) {
  const userTokenRefreshModalVisible = useSelector((state) => state.user.userTokenRefreshModalVisible)
  // const [createInfo, setCreateInfo] = useState({
  //   accountType:"",
  //   password:"",
  // })
  const [createInfo, setCreateInfo] = useState(route.params.createInfo)

  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [isPassPW, setIsPassPW] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [checkPasswordModalVisible, setCheckPasswordModalVisible] = useState(false)
  const passwordInputRef = useRef(null);
  const accessToken = useSelector((state) => state.user.accessToken)

  // 드랍다운 용도
  // const [dropdownOptions,setDropdownOptions] = ["입출금 계좌", "적금 계좌", "예금 계좌"];
  const [dropdownOptions,setDropdownOptions] = useState(["급여 및 아르바이트", "생활비 관리", "적금 자동이체", "예금 가입", "대출 신청"])
  const [isAccountTypeDropdownOpen, setIsAccountTypeDropdownOpen] = useState(false)
  const [selectedAccountType, setSelectedAccountType] = useState(null)

  const isNextButtonEnabled = () => {
    return (
      password.length === 4 &&
      selectedOption1 === "no" &&
      selectedOption2 === "no"
    );
  };
  const removeLast = () => {
    setPassword((prevPassword) => prevPassword.slice(0, -1));
  };
  const appendPassword = (num) => {
    if (password.length < 4) {
      setPassword((prevPassword) => prevPassword + num);
    }
  };
  const removeLast2 = () => {
    setCheckPassword((prevCheckPassword) => prevCheckPassword.slice(0, -1));
  };
  const appendCheckPassword = (num) => {
    if (checkPassword.length < 4) {
      setCheckPassword((prevCheckPassword) => prevCheckPassword + num);
    }
  };

  //드랍다운 용도
  const toggleDropdown = () => {
    console.log(isAccountTypeDropdownOpen)
    setIsAccountTypeDropdownOpen(!isAccountTypeDropdownOpen);
  };
  const selectAccountTypeOption = (option) => {
    setSelectedAccountType(option);
    setIsAccountTypeDropdownOpen(false);
    console.log(option)
    setCreateInfo((prev) => ({ ...prev, 
      accountType: option
    }))
  };
  // const selectAccountTypeOption = (option) => {
  //   setSelectedAccountType(option);
  //   setIsAccountTypeDropdownOpen(false);
  //   let selectAccountType
  //   switch (option) {
  //     case "입출금 계좌":
  //       selectAccountType = "DEPOSIT_ACCOUNT";
  //       break;
  //     case "적금 계좌":
  //       selectAccountType = "SAVING_ACCOUNT";
  //       break;
  //     case "예금 계좌":
  //       selectAccountType = "CHECKING_ACCOUNT";
  //       break;
  //     default:
  //       selectAccountType = ""; // 옵션이 매칭되지 않을 경우 기본값 설정
  //   }
  //   setCreateInfo((prev) => ({ ...prev, 
  //     accountType: selectAccountType
  //   }))
  // };

  return (
    <View style={styles.container}>
      <HeaderComponent navigation={navigation} title="계좌개설" />
      <View style={styles.purpleBox}>
        <Text style={styles.blackText}>포도은행 입출금통장</Text>
      </View>
      <TouchableOpacity
        style={styles.whiteBox}
        // onPress={() => {passwordInputRef.current.focus(); setModalVisible(true);}} // 여기서 focus
        onPress={() => {setModalVisible(true); setPassword("")}} // 여기서 focus
      >
        <Text style={styles.blackText}>통장 비밀번호 만들기</Text>
        <View style={styles.passwordDotsContainer}>
          {[...Array(4)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.passwordDot,
                index < password.length ? styles.filledDot : {}, // 입력된 길이에 따른 스타일 적용
              ]}
            />
          ))}
        </View>
        {/* <TextInput
          ref={passwordInputRef} // 참조 설정
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0,
            width: "100%",
            height: "100%",
          }} // 완전히 투명하게 설정
          value={password}
          onChangeText={setPassword}
          maxLength={4}
          keyboardType="numeric"
          secureTextEntry={true}
        /> */}
      </TouchableOpacity>
      <Text
        style={{
          color: "red",
          color: isPassPW ? "blue" : "red",
          // marginLeft: 30
          alignSelf: "flex-end",
          marginTop: -35,
          marginBottom: 15,
        }}
      >
        {passwordMessage}
      </Text>
      <Text style={{ marginBottom: 30, fontSize: 12 }}>
        고객님의 자산을 안전하게 보호하고 전화 금융사기의 피해를 예방하고자
        금융거래목적에 대해 질문드립니다.
      </Text>
      <Text style={{ marginBottom: 15 }}>
        어떤 용도로 통장을 사용하실 건가요?
      </Text>


      {/* <TouchableOpacity style={styles.whiteBox}>
        <Text>계좌사용용도</Text>
        <AntDesign name="down" size={20}></AntDesign>
      </TouchableOpacity> */}
      {!isAccountTypeDropdownOpen&& (<TouchableOpacity 
        style={styles.whiteBox} 
        onPress={toggleDropdown}
      >
        {selectedAccountType
          ?(<Text>{selectedAccountType}</Text>)
          :(<Text>계좌사용용도</Text>)
        }
        <AntDesign name={isAccountTypeDropdownOpen ? "up" : "down"} size={20} />
      </TouchableOpacity>)}
      {isAccountTypeDropdownOpen && (
        <View style={{marginBottom: 15}}>
          <TouchableOpacity 
            style={styles.whiteBoxDropdown} 
            onPress={toggleDropdown}
          >
          {selectedAccountType
            ?(<Text>{selectedAccountType}</Text>)
            :(<Text>계좌사용용도</Text>)
          }
          <AntDesign name={isAccountTypeDropdownOpen ? "up" : "down"} size={20} />
          </TouchableOpacity>
          <View style={styles.dropdown}>
            {dropdownOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownOption}
                onPress={() => {selectAccountTypeOption(option)}}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <Text style={{ marginBottom: 20 }}>
        타인으로부터 통장대여 요청을 받은 사실이 있나요?
      </Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSelectedOption1("yes")}
        >
          <Text style={selectedOption1 === "yes" ? styles.checkIcon : null}>
            {selectedOption1 === "yes" ? "✔" : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedOption1("yes")}>
          <Text>예</Text>
        </TouchableOpacity>
        <View style={{ marginRight: 160 }} />
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSelectedOption1("no")}
        >
          <Text style={selectedOption1 === "no" ? styles.checkIcon : null}>
            {selectedOption1 === "no" ? "✔" : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedOption1("no")}>
          <Text>아니오</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginBottom: 20 }}>
        타인으로부터 신용점수 상향, 대출 등의 목적으로 통장개설을 요청받은
        사실이 있나요?
      </Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSelectedOption2("yes")}
        >
          <Text style={selectedOption2 === "yes" ? styles.checkIcon : null}>
            {selectedOption2 === "yes" ? "✔" : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedOption2("yes")}>
          <Text>예</Text>
        </TouchableOpacity>
        <View style={{ marginRight: 160 }} />
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSelectedOption2("no")}
        >
          <Text style={selectedOption2 === "no" ? styles.checkIcon : null}>
            {selectedOption2 === "no" ? "✔" : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedOption2("no")}>
          <Text>아니오</Text>
        </TouchableOpacity>
      </View>

      {/* 제작 키보드 */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
          setPassword("")
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.passwordLabelText}>비밀번호</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.passwordInput, {color:'black'}]}
              placeholder="비밀번호 입력"
              value={password}
              onChangeText={setPassword}
              editable={false}  // textInput이 가진 keyboard열기 방지
              maxLength={4}
              secureTextEntry={true}
            />

            <View style={styles.numPad}>
              {[
                ["1", "2", "3"],
                ["4", "5", "6"],
                ["7", "8", "9"],
                ["", "0", "←"],
              ].map((row, rowIndex) => (
                <View key={rowIndex} style={styles.numRow}>
                  {row.map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={styles.numButton}
                      onPress={() => {
                        if (num === "←") {
                          removeLast();
                        } else if (num !== "") {
                          appendPassword(num);
                        }
                      }}
                    >
                      <Text style={styles.numText}>{num}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                setModalVisible(false);
                setCheckPasswordModalVisible(true)
                setCheckPassword("");
              }}
            >
              <Text style={styles.confirmButtonText}>다음</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 제작 키보드 비밀번호 확인용 */}
      <Modal animationType="slide" transparent={true} visible={checkPasswordModalVisible}
        onRequestClose={() => {
          setCheckPasswordModalVisible(false)
          setPassword("")
          setCheckPassword("")
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.passwordLabelText}>비밀번호 확인</Text>
              <TouchableOpacity onPress={() => setCheckPasswordModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.passwordInput, {color:'black'}]}
              placeholder="비밀번호 입력"
              value={checkPassword}
              onChangeText={setCheckPassword}
              editable={false}  // textInput이 가진 keyboard열기 방지
              maxLength={4}
              secureTextEntry={true}
            />

            <View style={styles.numPad}>
              {[
                ["1", "2", "3"],
                ["4", "5", "6"],
                ["7", "8", "9"],
                ["", "0", "←"],
              ].map((row, rowIndex) => (
                <View key={rowIndex} style={styles.numRow}>
                  {row.map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={styles.numButton}
                      onPress={() => {
                        if (num === "←") {
                          removeLast2();
                        } else if (num !== "") {
                          appendCheckPassword(num);
                        }
                      }}
                    >
                      <Text style={styles.numText}>{num}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                if(password != checkPassword){
                  setCheckPasswordModalVisible(true);
                  setIsPassPW(false)
                  setPasswordMessage("비밀번호 불일치")
                  Alert.alert('비밀번호 불일치', '비밀번호가 일치하지 않습니다. 비밀번호를 다시 설정해주세요.');
                }else{
                  setCheckPasswordModalVisible(false);
                  setIsPassPW(true)
                  setCreateInfo((prev) => ({ ...prev, 
                    password: checkPassword
                  }))
                  setPasswordMessage("비밀번호 입력 완료")
                }
              }}
            >
              <Text style={styles.confirmButtonText}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.confirmButtonNext}
        onPress={() => {
          switch (true) {
            case (!password || !checkPassword):
              Alert.alert('비밀번호 확인 필요', '비밀번호를 입력해주세요');
              break;
            case (password !== checkPassword):
              Alert.alert('비밀번호 불일치', '비밀번호가 일치하지 않습니다. 다시 확인해주세요');
              break;
            case (!selectedAccountType):
              Alert.alert('계좌 사용 용도 미입력', '계좌 사용 용도를 선택하지 않았습니다. 다시 확인해주세요.');
              break;
            case (!selectedOption1):
              Alert.alert('통장대여 요청 응답 필요', '통장대여 요청에 대한 응답을 해주세요');
              break;
            case (selectedOption1==="yes"):
              Alert.alert('통장대여는 불법', '통장대여 불법입니다. 필요시 가까운 경찰서에 방문하세요.');
              break;
            case (!selectedOption2):
              Alert.alert('통장개설 요청 확인 필요', '타인으로부터의 통장 개설 요청 사실을 확인해주세요');
              break;
            case (selectedOption2==="yes"):
              Alert.alert('통장개설 거부', '통장개설 관련 요청을 받은 사실이 있다면, 필요시 가까운 경찰서에 방문하세요.');
              break;
            default:
              console.log(createInfo)
              navigation.navigate("AccountRestrictionScreen", {
                createInfo: createInfo,
              })
          }
        }}
      >
        <Text style={styles.confirmText}>다음</Text>
      </TouchableOpacity>
      {userTokenRefreshModalVisible && <AccessTokenRefreshModalScreen navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  container1:{
    flex: 0.9,
  },
  container2:{
    flex: 0.1,
    justifyContent: 'flex-end',
  },
  purpleBox: {
    backgroundColor: "#8B0FD750",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    borderRadius: 5,
  },
  // blackText: {
  //   color: "white",
  //   fontSize: 20,
  //   textAlign: "center",
  // },
  checkIcon: {
    fontSize: 18,
    color: "black",
    marginTop: -5,
    marginBottom: -5,
  },
  whiteBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 50,
  },
  blackText: {
    fontSize: 18,
  },
  grayText: {
    fontSize: 18,
    color: "gray",
    // textAlign: "left",
  },
  passwordDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "gray",
    margin: 2,
  },
  filledDot: {
    backgroundColor: "black",
  },
  passwordInput: {
    borderColor: "black",
    borderWidth: 1,
    width: 90,
    textAlign: "center",
    fontSize: 18,
  },
  passwordDotsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  innerRadio: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "black",
  },
  confirmButtonNext: {
    backgroundColor: "#842DC480",
    padding: 15,
    // alignSelf: "stretch",
    alignItems: "center",
    // borderTopLeftRadius: 5, // 위쪽 왼쪽 모서리만 둥글게
    // borderTopRightRadius: 5, // 위쪽 오른쪽 모서리만 둥글게
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  confirmText: {
    color: "white",
    fontSize: 20,
  },

  // modal창 css
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    height: "70%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: "space-between",
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  passwordLabelText: {
    fontSize: 15,
    // fontWeight: "bold",
  },
  closeButtonText: {
    fontSize: 24,
  },
  passwordInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#8F1414",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  numPad: {
    flex: 1,
    justifyContent: "center",
  },
  numRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  numButton: {
    width: width / 3 - 40,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#e0e0e0",
    borderRadius: 5,
    color: "#8F1414",
  },
  numText: {
    fontSize: 40,
  },
  confirmButton: {
    backgroundColor: "#842DC480",
    padding: 15,
    borderRadius: 5,
    alignSelf: "stretch",
    alignItems: "center",
    marginLeft: -30,
    marginRight: -30,
    marginBottom: -20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
  },
  //드랍다운 스타일
  dropdown: {
    backgroundColor: "white",
    borderColor: "#ddd",
    borderWidth: 1,
    // position: "absolute",
    // top: 80, // Dropdown이 나타날 위치 조절
    // left: 20, // Dropdown이 나타날 위치 조절
    // width: 200, // Dropdown의 너비 조절
    zIndex: 1, // 다른 요소 위에 나타나도록 조절
  },
  dropdownOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  whiteBoxDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderColor: "#ddd",
    borderWidth: 1,
  },
});
