// 계좌 정보와 관련된 API들을 모아둠 account, userauth

import axios from 'axios';
const apiAddress ="http://j9d107.p.ssafy.io:9200"

// userauth
// 계좌 이름 설정
// {
//   "accountNumber" : {
//     "type" : "string"
//   },
//   "accountTitle" : {
//     "type" : "string"
//   }
// }
//1원 인증 후 계좌 이름 설정
export const accountNicknameRegist = async (nicknameRegistData, accessToken, grantType) => {
  try {
    const response = await axios.post(apiAddress+`/api/v1/oneCent/account/title`, nicknameRegistData, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('계좌 이름 설정 성공:', response.data);
    return response;
  } catch (error) {
    console.log('계좌 이름 설정 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};

// 1원 인증 전 본인확인 이메일 전송
export const accountEmailSendOneCent = async (id, accessToken, grantType) => {
  try {
    const response = await axios.post(apiAddress+`/api/v1/oneCent/own/check-id?id=${id}`, null, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('1원 인증 전 본인확인 이메일 전송 성공:', response.data);
    return response;
  } catch (error) {
    console.log('1원 인증 전 본인확인 이메일 전송 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
// 1원 인증 전 본인확인 이메일 전송 코드 검사
// {
//   "id" : {
//     "type" : "string"
//   },
//   "code" : {
//     "type" : "string"
//   }
// }

//1원 인증 전 본인확인 이메일 전송 코드 검사 성공 -- id가 바디가 들어감 -- 기존 code에서 id추가 -- 안씀
export const accountEmailCodeVerificationOneCent = async (emailCodeVerificationOneCentData, accessToken, grantType) => {
  try {
    const response = await axios.post(apiAddress+`/api/v1/oneCent/own/check-code?id=${id}`, emailCodeVerificationOneCentData, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('1원 인증 전 본인확인 이메일 전송 코드 검사 성공:', response.data);
    return response;
  } catch (error) {
    console.log('1원 인증 전 본인확인 이메일 전송 코드 검사 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};


// // 계좌 1원 인증 번호 확인
// {
//   "bankSeq" : {
//     "type" : "integer",
//     "format" : "int64"
//   },
//   "accountNumber" : {
//     "type" : "string"
//   },
//   "verificationCode" : {
//     "type" : "string"
//   }
// }
export const accountVerificationsOnecentCheck = async (verificationsOnecentCheckData, accessToken, grantType) => {
  try {
    const response = await axios.post(apiAddress+`/api/v1/oneCent/podoBank/check-code`, verificationsOnecentCheckData, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('계좌 1원 인증 번호 확인 성공:', response.data);
    return response;
  } catch (error) {
    console.log('계좌 1원 인증 번호 확인 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};

// 계좌 1원 인증 전송
// {
//   "bankSeq" : {
//     "type" : "integer",
//     "format" : "int64"
//   },
//   "accountNumber" : {
//     "type" : "string"
//   }
// }
export const accountVerificationsOnecentSend = async (verificationsOnecentSendData, accessToken, grantType) => {
  try {
    const response = await axios.post(apiAddress+`/api/v1/oneCent/podoBank/check-account`, verificationsOnecentSendData, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('계좌 1원 인증 전송 성공:', response.data);
    return response;
  } catch (error) {
    console.log('계좌 1원 인증 전송 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};

//Bank
// 모든 은행 정보 불러오기
export const accountWholeBank = async (accessToken, grantType) => {
  try {
    const response = await axios.get(apiAddress+`/api/v1/bank`, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('모든 은행 정보 불러오기 성공:', response.data);
    return response;
  } catch (error) {
    console.log('모든 은행 정보 불러오기 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};

//Account
// 전체 계좌 조회하기
export const accountWholeInquiry = async (accessToken, grantType) => {
  try {
    const response = await axios.get(apiAddress+`/api/v1/account`, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('전체 계좌 조회하기 성공:', response.data);
    return response;
  } catch (error) {
    console.log('전체 계좌 조회하기 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};

// 연동 계좌 삭제하기
export const accountDelete = async (accountSeq, accessToken, grantType) => {
  try{
    const response = await axios.post(apiAddress+`/api/v1/account/delete?accountSeq=${accountSeq}`, null, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('연동 계좌 삭제하기 성공:', response.data)
    return response
  }catch(error){
    console.log('연동 계좌 삭제하기 실패', error)
    const response = error.response
    return response
  }
}

// 계좌 1개 조회
export const accountOneInquiry = async (planSeq, accessToken, grantType) => {
  try{
    const response = await axios.get(apiAddress+`/api/v1/account/one?planSeq=${planSeq}`, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('계좌 1개 조회 성공:', response.data)
    return response
  }catch(error){
    console.log('계좌 1개 조회 실패', error)
    const response = error.response
    return response
  }
}