// 유저 정보와 관련된 API들을 모아둠 users

import axios from "axios";
const apiAddress = "http://j9d107.p.ssafy.io:9200";

//USERS
// 사용자 데이터 가져오기
export const userInfoInquiry = async (accessToken, grantType) => {
  try {
    const response = await axios.get(apiAddress + `/api/v1/user`, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log("사용자 데이터 가져오기 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 데이터 가져오기 실패:", error);
    const response = error.response;
    return response;
  }
};

// 사용자 생년월일 변경
export const userBirthdateChange = async (
  birthDate,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.patch(
      apiAddress + `/api/v1/user/birthDate`,
      { birthDate: birthDate },
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("사용자 생년월일 변경 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 생년월일 변경 실패:", error);
    const response = error.response;
    return response;
  }
};

// 사용자 로그아웃
export const userLogout = async (refreshToken, accessToken, grantType) => {
  try {
    const response = await axios.patch(apiAddress + `/api/v1/user/logout`, null, {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("사용자 로그아웃 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 로그아웃 실패:", error);
    const response = error.response;
    return response;
  }
};

// 사용자 비밀번호 변경
// 데이터 양식
// {
//   "beforePassword" : {
//     "type" : "string"
//   },
//   "afterPassword" : {
//     "type" : "string"
//   }
// }
//비밀번호 변경
export const userPasswordChange = async (
  pwChangeData,
  accessToken,
  grantType
) => {
  console.log(pwChangeData);
  try {
    const response = await axios.patch(
      apiAddress + `/api/v1/user/password`,
      pwChangeData,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("사용자 비밀번호 변경 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 비밀번호 변경 실패:", error);
    const response = error.response;
    return response;
  }
};

// 사용자 휴대전화 번호 변경
export const userCellPhoneNumberChange = async (
  phoneNumber,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.patch(
      apiAddress + `/api/v1/user/phoneNumber`,
      { phoneNumber: phoneNumber },
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("사용자 휴대전화 번호 변경 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 휴대전화 번호 변경 실패:", error);
    const response = error.response;
    return response;
  }
};

// 사용자 탈퇴하기
export const userWithdrawDotori = async (refreshToken, accessToken, grantType) => {
  try {
    const response = await axios.patch(apiAddress + `/api/v1/user/retire`, null, {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("사용자 탈퇴하기 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 탈퇴하기 실패:", error);
    const response = error.response;
    return response;
  }
};

// 사용자 이메일 인증코드 검증
export const userEmailCodeVerificate = async (email, emailVerificationCode) => {
  try {
    const response = await axios.post(
      apiAddress + `/api/v1/auth/email/check-code`,
      { id: email, code: emailVerificationCode }
    );
    console.log("사용자 이메일 인증코드 검증 성공:", response);
    return response;
  } catch (error) {
    console.log("사용자 이메일 인증코드 검증 실패:", error);
    const response = error.response;
    return response;
  }
};

// 사용자 이메일 인증코드 전송
export const userSendEmail = async (email) => {
  try {
    const response = await axios.post(
      apiAddress + `/api/v1/auth/email/check-id?id=${email}`
    );
    console.log("사용자 이메일 인증코드 전송 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 이메일 인증코드 전송 실패:", error);
    const response = error.response;
    return response;
  }
};

// 사용자 토큰 갱신 -- 보류
export const userTokenRefresh = async (
  refreshToken,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.post(
      apiAddress + `/api/v1/auth/new-token`,
      { refreshToken: refreshToken },
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("사용자 토큰 갱신 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 토큰 갱신 실패:", error);
    const response = error.response;
    return response;
  }
};

// 사용자 로그인
export const userLogin = async (loginData) => {
  try {
    const response = await axios.post(
      apiAddress + `/api/v1/auth/signin`,
      loginData
    );
    console.log("사용자 로그인 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 로그인 실패:", error);
    const response = error.response;
    return response;
  }
};

// 사용자 회원가입
export const userSignup = async (signupData) => {
  console.log(signupData);
  try {
    const response = await axios.post(
      apiAddress + `/api/v1/auth/signup`,
      signupData
    );
    console.log("사용자 회원가입 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 회원가입 실패:", error);
    const response = error.response;
    return response;
  }
};

// reward
// 사용자 현재 도토리 갯수 조회
export const userDotoriValueCheck = async (accessToken, grantType) => {
  try {
    const response = await axios.get(apiAddress + `/api/v1/reward`, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log("사용자 현재 도토리 갯수 조회 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 현재 도토리 갯수 조회 실패:", error);
    const response = error.response;
    return response;
  }
};

// reward
// 사용자 랜덤박스 개봉
export const userOpenRandomBox = async (coin, accessToken, grantType) => {
  try {
    const response = await axios.post(apiAddress + `/api/v1/reward/randombox/${coin}`, null, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log("사용자 랜덤박스 개봉 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 랜덤박스 개봉 실패:", error);
    const response = error.response;
    return response;
  }
};

// 사용자 리워드 이체
export const userKeepReward = async (data, accessToken, grantType) => {
  try {
    const response = await axios.post(apiAddress + `/api/v1/reward/randombox`, data, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log("사용자 리워드 이체 성공:", response.data);
    return response;
  } catch (error) {
    console.log("사용자 리워드 이체 실패:", error);
    const response = error.response;
    return response;
  }
};