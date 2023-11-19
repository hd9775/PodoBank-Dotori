// 목표 정보와 관련된 API들을 모아둠 purposes, 

import axios from 'axios';
const apiAddress ="http://j9d107.p.ssafy.io:9200"

// Purpose
// 목표 상세 조회
export const purposeDetail = async (purposeSeq, accessToken, grantType) => {
  console.log(purposeSeq)
  try {
    const response = await axios.get(apiAddress+`/api/v1/purpose/${purposeSeq}`, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('목표 상세 조회 성공:', response.data);
    return response;
  } catch (error) {
    console.log('목표 상세 조회 실패:', error);
    const response = error.response
    return response
  }
};

// 목표 중단하기
export const purposeQuit = async (purposeSeq, accessToken, grantType) => {
  try {
    const response = await axios.patch(apiAddress+`/api/v1/purpose/terminate/${purposeSeq}`, null, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('목표 중단하기 성공:', response.data);
    return response;
  } catch (error) {
    console.log('목표 중단하기 실패:', error);
    const response = error.response
    return response
  }
};

// 목표 진행 현황 조회
export const purposeStatusInquiry = async (purposeSeq, accessToken, grantType) => {
  try {
    const response = await axios.get(apiAddress+`/api/v1/purpose/terminate/${purposeSeq}`, null, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('목표 진행 현황 조회 성공:', response.data);
    return response;
  } catch (error) {
    console.log('목표 진행 현황 조회 실패:', error);
    const response = error.response
    return response
  }
};

// 목표 등록
// {
//   "purposeTitle" : {
//     "type" : "string"
//   },
//   "goalAmount" : {
//     "type" : "number"
//   },
//   "startedAt" : {
//     "type" : "string",
//     "format" : "date-time"
//   },
//   "endAt" : {
//     "type" : "string",
//     "format" : "date-time"
//   }
// }
export const purposeNewRegister = async (newRegisterData, accessToken, grantType) => {
  console.log(newRegisterData)
  try {
    const response = await axios.post(apiAddress+`/api/v1/purpose`, newRegisterData, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('목표 등록 성공:', response.data);
    return response;
  } catch (error) {
    console.log('목표 등록 실패:', error);
    const response = error.response
    return response
  }
};

// 전체 목표 조회
export const purposeGetList = async (accessToken, grantType) => {
  try {
    const response = await axios.get(apiAddress+`/api/v1/purpose`, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('전체 목표 조회 성공:', response.data);
    return response;
  } catch (error) {
    console.log('전체 목표 조회 실패:', error);
    const response = error.response
    return response
  }
};

// 목표 완료 후 저축하기
export const purposeEndSaving = async (endSavingData, accessToken, grantType) => {
  try {
    const response = await axios.patch(apiAddress+`/api/v1/purpose/finished`, endSavingData, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log('목표 완료 후 저축하기 성공:', response.data);
    return response;
  } catch (error) {
    console.log('목표 완료 후 저축하기 실패:', error);
    const response = error.response
    return response
  }
};