import React from "react";
import {
  Modal,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function InputModal({
  modalVisible,
  closeModal,
  accountInput,
  handleKeyPress,
  navigation,
  receiverBank,
}) {
  const translateY = new Animated.Value(height);

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <Animated.View
        style={{
          transform: [{ translateY: translateY }],
          height: "60%",
          width: "100%",
          backgroundColor: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        {/* ... 기존의 Modal 안의 내용 ... */}
      </Animated.View>
    </Modal>
  );
}
