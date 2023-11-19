import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import FooterScreen from "../Components/FooterScreen";
import { userDotoriValueCheck } from "../../apis/userapi";

export default function RewardScreen({ navigation }) {
  const grantType = useSelector((state) => state.user.grantType);
  const accessToken = useSelector((state) => state.user.accessToken);

  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const [dotoriCount, setDotoriCount] = useState(null);

  const [coinCount, setCoinCount] = useState(null);

  const doUserDotoriValueCheck = async () => {
    try {
      const response = await userDotoriValueCheck(accessToken, grantType);
      if (response.status === 200) {
        setDotoriCount(response.data.dotori);
        setCoinCount(response.data.coin);
      } else {
      }
    } catch (error) {}
  };

  const currentDotoriEffect = (index) => {
    if (dotoriCount !== index) {
      return null;
    }
    switch (index) {
      case 0:
        return null;
      case 1:
        return styles.firstDotoriSpecialImage;
      case 2:
        return styles.secondDotoriSpecialImage;
      case 3:
        return styles.thirdDotoriSpecialImage;
      case 4:
        return styles.fourthDotoriSpecialImage;
      case 5:
        return styles.fifthDotoriSpecialImage;
      case 6:
        return styles.sixthDotoriSpecialImage;
      case 7:
        return styles.seventhDotoriSpecialImage;
      case 8:
        return styles.eighthDotoriSpecialImage;
      case 9:
        return styles.ninthDotoriSpecialImage;
      default:
        return null;
    }
  };
  const getOpacity = (index) => {
    return dotoriCount >= index ? 1 : 0.5;
  };

  useEffect(() => {
    if (isFocused) {
      doUserDotoriValueCheck();
    }
  }, [isFocused]);

  useEffect(() => {
    if (coinCount >= 1) {
      const blink = Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);

      Animated.loop(blink).start();
    } else {
      opacityAnim.setValue(1);
    }
  }, [coinCount]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/RewardImage.jpg")}
        style={styles.imageBackground}
      >
        <View style={styles.borderBox}>
          {dotoriCount !== null && (
            <Text style={styles.dotoriText}>{`${dotoriCount}개`}</Text>
          )}
        </View>
        <Image
          source={require("../../assets/images/Curve_dotted_Line.png")}
          style={styles.dashedImage}
        />
        <Image
          source={require("../../assets/images/Hamster/RunningHamster.png")}
          style={styles.bottomLeftImage}
        />
        <TouchableOpacity
          style={styles.topRightImage}
          onPress={() =>
            navigation.navigate("RandomBox1Screen", {
              coin: coinCount,
            })
          }
        >
          <Animated.Image
            source={require("../../assets/images/Hamster/WinnerHamster.png")}
            style={[{ width: 100, height: 100, opacity: opacityAnim }]}
          />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/acorn.png")}
          style={[styles.firstDotoriImage, { opacity: getOpacity(1) }]}
        />
        <Image
          source={require("../../assets/images/acorn.png")}
          style={[styles.secondDotoriImage, { opacity: getOpacity(2) }]}
        />
        <Image
          source={require("../../assets/images/acorn.png")}
          style={[styles.thirdDotoriImage, { opacity: getOpacity(3) }]}
        />
        <Image
          source={require("../../assets/images/acorn.png")}
          style={[styles.fourthDotoriImage, { opacity: getOpacity(4) }]}
        />
        <Image
          source={require("../../assets/images/acorn.png")}
          style={[styles.fifthDotoriImage, { opacity: getOpacity(5) }]}
        />
        <Image
          source={require("../../assets/images/acorn.png")}
          style={[styles.sixthDotoriImage, { opacity: getOpacity(6) }]}
        />
        <Image
          source={require("../../assets/images/acorn.png")}
          style={[styles.seventhDotoriImage, { opacity: getOpacity(7) }]}
        />
        <Image
          source={require("../../assets/images/acorn.png")}
          style={[styles.eighthDotoriImage, { opacity: getOpacity(8) }]}
        />
        <Image
          source={require("../../assets/images/acorn.png")}
          style={[styles.ninthDotoriImage, { opacity: getOpacity(9) }]}
        />
        <Image
          source={require("../../assets/images/acorn.png")}
          style={styles.blockDotoriLeftImage}
        />
        <Image
          source={require("../../assets/images/acorn.png")}
          style={styles.blockDotoriRightImage}
        />
        <Image
          source={require("../../assets/images/currentDotoriEffect.png")}
          style={currentDotoriEffect(dotoriCount)}
        />
      </ImageBackground>
      <FooterScreen navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageBackground: {
    width: "100%",
    marginBottom: -150,
    marginTop: -200,

    height: Dimensions.get("window").height - 10, // FooterScreen의 높이만큼 감소. 50은 예시값이며, 실제 FooterScreen의 높이에 맞게 조정해야 합니다.
  },
  borderBox: {
    position: "absolute",
    top: 80,
    left: 40,
    borderColor: "#9E6613",
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "white",
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").height * 0.06,
  },
  dotoriText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  dashedImage: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.8,
    marginTop: 90,
    marginLeft: 40,
  },
  bottomLeftImage: {
    position: "absolute",
    bottom: 50,
    left: 10,
    width: 120,
    height: 120,
  },
  topRightImage: {
    position: "absolute",
    top: 70,
    right: 20,
    width: 100,
    height: 100,
  },
  firstDotoriImage: {
    position: "absolute",
    bottom: 70,
    left: 140,
    width: 50,
    height: 50,
    transform: [{ rotate: "30deg" }],
  },
  firstDotoriSpecialImage: {
    position: "absolute",
    bottom: 50,
    left: 115,
    width: 100,
    height: 100,
  },
  secondDotoriImage: {
    position: "absolute",
    bottom: 95,
    left: 245,
    width: 40,
    height: 40,
  },
  secondDotoriSpecialImage: {
    position: "absolute",
    bottom: 70,
    left: 220,
    width: 100,
    height: 100,
  },
  thirdDotoriImage: {
    position: "absolute",
    bottom: 150,
    right: 50,
    width: 50,
    height: 50,
    transform: [{ rotate: "-15deg" }],
  },
  thirdDotoriSpecialImage: {
    position: "absolute",
    bottom: 130,
    right: 25,
    width: 100,
    height: 100,
  },
  fourthDotoriImage: {
    position: "absolute",
    bottom: 240,
    right: 40,
    width: 50,
    height: 50,
    transform: [{ rotate: "190deg" }],
  },
  fourthDotoriSpecialImage: {
    position: "absolute",
    bottom: 220,
    right: 15,
    width: 100,
    height: 100,
  },
  fifthDotoriSpecialImage: {
    position: "absolute",
    bottom: 305,
    right: 95,
    width: 100,
    height: 100,
  },
  fifthDotoriImage: {
    position: "absolute",
    bottom: 330,
    right: 120,
    width: 50,
    height: 50,
  },
  sixthDotoriImage: {
    position: "absolute",
    bottom: 370,
    left: 140,
    width: 40,
    height: 40,
    transform: [{ rotate: "-15deg" }],
  },
  sixthDotoriSpecialImage: {
    position: "absolute",
    bottom: 345,
    left: 115,
    width: 100,
    height: 100,
  },
  seventhDotoriImage: {
    position: "absolute",
    top: 300,
    left: 60,
    width: 45,
    height: 45,
    transform: [{ rotate: "30deg" }],
  },
  seventhDotoriSpecialImage: {
    position: "absolute",
    top: 275,
    left: 35,
    width: 100,
    height: 100,
  },
  eighthDotoriImage: {
    position: "absolute",
    top: 170,
    left: 80,
    width: 50,
    height: 50,
    transform: [{ rotate: "-60deg" }],
  },
  eighthDotoriSpecialImage: {
    position: "absolute",
    top: 140,
    left: 60,
    width: 100,
    height: 100,
  },
  ninthDotoriImage: {
    position: "absolute",
    top: 130,
    left: 200,
    width: 40,
    height: 40,
  },
  ninthDotoriSpecialImage: {
    position: "absolute",
    top: 100,
    left: 170,
    width: 100,
    height: 100,
  },
  blockDotoriLeftImage: {
    position: "absolute",
    top: 95,
    left: 30,
    width: 35,
    height: 35,
    transform: [{ rotate: "-15deg" }],
  },
  blockDotoriRightImage: {
    position: "absolute",
    top: 70,
    left: 140,
    width: 35,
    height: 35,
    transform: [{ rotate: "15deg" }],
  },
});
