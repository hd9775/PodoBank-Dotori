import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
} from "react-native";
import HeaderComponent from "../Components/HeaderScreen";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { unclassifiedList, unClassifiedUpdate } from "../../apis/planapi";

export default function PlanNotClassifyScreen({ navigation, route }) {
  // 토큰
  const grantType = useSelector((state) => state.user.grantType);
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [unClassifiedList, setUnClassifiedList] = useState([]);
  const planSeq = route.params.planSeq;

  // 그 외
  const accountName = route.params.accountName;
  
  const [data, setData] = useState([])
  const [updateData, setUpdateData] = useState([]);
  const [categoryMapping, setCategoryMapping] = useState({});

  const doUnClassifiedList = async () => {
    try {
      const response = await unclassifiedList(planSeq, accessToken, grantType);
      if (response.status === 200) {
        setUnClassifiedList(response.data);
        setData(response.data);
      } else {
      }
    } catch (error) {
    }
  };

  const doUnClassifiedUpdate = async () => {
    try {
      const response = await unClassifiedUpdate(
        updateData,
        planSeq,
        accessToken,
        grantType
      );
      if (response.status === 200) {
      } else {
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (isFocused) {
      doUnClassifiedList();
      const mapping = {};
      unClassifiedList.forEach((item) => {
        if (!mapping[item.categoryName]) {
          mapping[item.categoryName] = item.planDetailSeq;
        }
        console.log("mapping", mapping);
      });
      setCategoryMapping(mapping);
      setSelectedCategoryName(unClassifiedList[0]?.categoryName || null);
    }
  }, [isFocused])

  const onCategoryChange = (paymentSeq, newCategory, newPlanDetailSeq) => {
    console.log("categoryMapping", categoryMapping);
    console.log("newCategory", newCategory);
    console.log("newPlanDetailSeq", newPlanDetailSeq);

    const newData = data.map((item) =>
      item.paymentSeq === paymentSeq
        ? {
            ...item,
            categoryName: newCategory,
            planDetailSeq: newPlanDetailSeq,
          }
        : item
    );
    setData(newData);
    console.log("newPlanDetailSeq", newPlanDetailSeq);

    console.log("newData:", newData);

    const updatedUpdateData = [
      ...updateData,
      { planDetailSeq: newPlanDetailSeq, paymentSeq: paymentSeq },
    ];
    setUpdateData(updatedUpdateData);
    console.log("updateData", updateData);
  };

  const uniqueCategories = useMemo(() => {
    return [...new Set(unClassifiedList.map((item) => item.categoryName))];
  }, [unClassifiedList]);

  const formatNumber = (num) =>
    num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

  const handleNextButton = () => {
    doUnClassifiedUpdate();
    navigation.goBack();
  };
  const [selectedCategoryName, setSelectedCategoryName] = useState(
    unClassifiedList[0]?.categoryName || null
  );

  const getCategoryItems = () =>
    data.filter((item) => item.categoryName === selectedCategoryName) || [];

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="미분류 항목"
        cancelNavi="MainPageScreen"
        navigation={navigation}
      ></HeaderComponent>
      <View style={styles.innerContainer}>
        <Text style={styles.accountName}>{accountName}</Text>
        <View style={styles.scrollViewContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {uniqueCategories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategoryName(category)}
                style={
                  selectedCategoryName === category
                    ? styles.selectedGroupName
                    : styles.groupName
                }
              >
                <Text
                  style={
                    selectedCategoryName === category
                      ? styles.selectedGroupText
                      : styles.groupText
                  }
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.divider} />
        <FlatList
          data={getCategoryItems()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemLeftContainer}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDetail}>
                    {item.paymentName}
                  </Text>
                  <CategoryBox
                    item={item}
                    onCategoryChange={onCategoryChange}
                    uniqueCategories={uniqueCategories}
                    categoryMapping={categoryMapping}
                  />
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionAt}>{item.paymentDate}</Text>
                  <Text style={styles.amount}>
                    {formatNumber(item.paymentPrice)}원
                  </Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNextButton}>
        <Text style={styles.buttonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

function CategoryBox({
  item,
  onCategoryChange,
  uniqueCategories,
  categoryMapping,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.categoryBox}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.categoryText}>{item.categoryName}</Text>
      </TouchableOpacity>

      {modalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>카테고리 변경</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseText}>X</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.modalContent}>
                {uniqueCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.modalItem}
                    onPress={() => {
                      const newPlanDetailSeq = categoryMapping[category];
                      setModalVisible(false);
                      onCategoryChange(
                        item.paymentSeq,
                        category,
                        newPlanDetailSeq
                      );
                    }}
                  >
                    <Text style={styles.modalItemText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    maxHeight: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContent: {
    alignItems: "center",
  },
  modalItem: {
    width: "100%",
    backgroundColor: "#727070",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  modalItemText: {
    color: "white",
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  innerContainer: {
    flex: 1,
  },
  accountName: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    fontSize: 24,
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  groupName: {
    padding: 10,
    paddingBottom: 5,
  },

  selectedGroupName: {
    borderBottomWidth: 5,
    borderBottomColor: "#FF965C",
    padding: 10,
    paddingBottom: 5,
  },
  groupText: {
    color: "#727070",
    marginBottom: 10,
  },
  selectedGroupText: {
    color: "#FF965C",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    width: "100%",
    marginVertical: 10,
    marginBottom: 30,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderColor: "#E3E3E3",
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 5,
    marginLeft: 20,

    width: "90%",

    elevation: 5,
    backgroundColor: "white",
  },
  itemLeftContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 10,
    marginRight: 10,
  },
  transactionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  transactionDetail: {
    flex: 1,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryBox: {
    backgroundColor: "#F2F5F8",
    borderRadius: 10,
    padding: 5,
    paddingTop: 6,
    marginBottom: 3,
  },
  transactionAt: {
    color: "#7D7D7D",
    fontSize: 12,
  },
  amount: {
    textAlign: "right",
    fontWeight: "bold",
  },
  categoryText: {
    fontSize: 10,
  },
  button: {
    height: 50,
    backgroundColor: "#FF965C",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
