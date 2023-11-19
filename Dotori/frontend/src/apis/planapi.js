// 계획 정보와 관련된 API들을 모아둠 plan, chatgpt, category, categoryGroup, categorydata

import axios from "axios";
const apiAddress = "http://j9d107.p.ssafy.io:9200";

// PLAN
// 계획 종료 후 저축하기
// {
//   "planSeq" : {
//     "type" : "integer",
//     "format" : "int64"
//   },
//   "purposeSavingList" : {
//     "type" : "array",
//     "items" : {
//       "$ref" : "#/components/schemas/PurposeSavingDTO"
//     }
//   },
//   "totalSaving" : {
//     "type" : "number"
//   }
// }
export const planSaving = async (savingData, accessToken, grantType) => {
  console.log("메롱", savingData);
  try {
    const response = await axios.patch(
      apiAddress + `/api/v1/plan/saving`,
      savingData,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("계획 종료 후 저축하기 성공:", response.data);
    return response;
  } catch (error) {
    console.log("계획 종료 후 저축하기 실패:", error);
    const response = error.response;
    return response;
  }
};
// 계획 종료 후 저축안하고 끝내기
export const planNoSaving = async (planSeq, accessToken, grantType) => {
  try {
    const response = await axios.patch(
      apiAddress + `/api/v1/plan/completed/${planSeq}`,
      null,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("계획 종료 후 저축안하고 끝내기 성공:", response.data);
    return response;
  } catch (error) {
    console.log("계획 종료 후 저축안하고 끝내기 실패:", error);
    const response = error.response;
    return response;
  }
};
// 계획 중단하기
export const planStop = async (planSeq, accessToken, grantType) => {
  try {
    const response = await axios.patch(
      apiAddress + `/api/v1/plan/stop/${planSeq}`,
      null,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("계획 중단하기 성공:", response.data);
    return response;
  } catch (error) {
    console.log(
      "계획 중단하기 실패:",
      error
    );
    const response = error.response;
    return response;
  }
};

// 계획 신규 등록
// {
//   "accountSeq" : {
//     "type" : "integer",
//     "format" : "int64"
//   },
//   "startedAt" : {
//     "type" : "string"
//   },
//   "endAt" : {
//     "type" : "string"
//   },
//   "categoryGroupList" : {
//     "type" : "array",
//     "items" : {
//       "$ref" : "#/components/schemas/CategoryGroupListDTO"
//     }
//   }
// }
export const planNewRegister = async (
  newRegisterData,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.post(
      apiAddress + `/api/v1/plan`,
      newRegisterData,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("계획 신규 등록 성공:", response.data);
    return response;
  } catch (error) {
    console.log(
      "계획 신규 등록 실패:",
      error
    );
    const response = error.response;
    return response;
  }
};

// CHATGPT
// 계획 GPt이용 카테고리 분류하기
// {
//   "categoryGroups" : {
//     "type" : "array",
//     "items" : {
//       "type" : "string"
//     }
//   },
//   "categorise" : {
//     "type" : "array",
//     "items" : {
//       "$ref" : "#/components/schemas/CategoryDTO"
//     }
//   }
// }
export const planClassifyChatGpt = async (
  classifyChatGptData,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.post(
      apiAddress + `/api/v1/chatgpt`,
      classifyChatGptData,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("계획 전체 카테고리 그룹 가져오기 성공:", response.data);
    return response;
  } catch (error) {
    console.log(
      "계획 전체 카테고리 그룹 가져오기 실패:",
      error
    );
    const response = error.response;
    return response;
  }
};

// categoryGroup
// 계획 전체 카테고리 그룹 가져오기
export const planCategoryGroupList = async (accessToken, grantType) => {
  try {
    const response = await axios.get(
      apiAddress + `/api/v1/categoryGroup`,
      null,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("계획 전체 카테고리 그룹 가져오기 성공:", response.data);
    return response;
  } catch (error) {
    console.log(
      "계획 전체 카테고리 그룹 가져오기 실패:",
      error
    );
    const response = error.response;
    return response;
  }
};

// categorydata
// 계획 카테고리 사용처 목록 가져오기
// [
//   {
//     "dataCode": "string",
//     "dataName": "string",
//     "count": 0
//   }
// ]
export const planCategoryUsingSpot = async (
  categorySeq,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.get(
      apiAddress + `/api/v1/categoryData?categorySeq=${categorySeq}`,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("계획 카테고리 사용처 목록 가져오기 성공:", response.data);
    return response;
  } catch (error) {
    console.log(
      "계획 카테고리 사용처 목록 가져오기 실패:",
      error
    );
    const response = error.response;
    return response;
  }
};
export const planCategoryDeleteSpot = async (
  dataCode,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.delete(
      apiAddress + `/api/v1/categoryData`,
      { dataCode: dataCode },
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("계획 카테고리 사용처 목록 제거하기 성공:", response.data);
    return response;
  } catch (error) {
    console.log(
      "계획 카테고리 사용처 목록 제거하기 실패:",
      error
    );
    const response = error.response;
    return response;
  }
};

// category
// 계획 전체 카테고리 목록 가져오기
export const planCategoryList = async (accessToken, grantType) => {
  try {
    const response = await axios.get(apiAddress + `/api/v1/category`, {
      headers: {
        Authorization: `${grantType} ${accessToken}`,
      },
    });
    console.log("계획 전체 카테고리 목록 가져오기 성공:", response.data);
    return response;
  } catch (error) {
    console.log(
      "계획 전체 카테고리 목록 가져오기 실패:",
      error
    );
    const response = error.response;
    return response;
  }
};

// plan
// 진행중인 계획 조회
export const planInProgress = async (
  inProgressData,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.get(
      apiAddress + `/api/v1/plan/${inProgressData}`,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("진행중인 계획 조회 성공:", response.data);
    return response;
  } catch (error) {
    console.log("진행중인 계획 조회 실패:", error);
    const response = error.response;
    return response;
  }
};

// 미분류 항목 조회
export const unclassifiedList = async (
  inProgressData,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.get(
      apiAddress + `/api/v1/payment/${inProgressData}`,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("미분류 정보 조회 성공:", response.data);
    return response;
  } catch (error) {
    console.log(
      "미분류 정보 계획 조회 실패:",
      error
    );
    const response = error.response;
    return response;
  }
};

//미분류 항목 업데이트
export const unClassifiedUpdate = async (
  updateData,
  planSeq,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.patch(
      apiAddress + `/api/v1/payment/${planSeq}`,
      { updateData },
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("미분류 항목 업데이트 성공:", response.data);
    return response;
  } catch (error) {
    console.log("진행중인 계획 조회 실패:", error);
    const response = error.response;
    return response;
  }
};

//명세서 전체 조회하기
export const planSpecificationList = async (accessToken, grantType) => {
  try {
    const response = await axios.get(
      apiAddress + `/api/v1/plan/specification`,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("계획 명세서 전체 조회하기 성공:", response.data);
    return response;
  } catch (error) {
    console.log("계획 명세서 전체 조회하기 실패:", error);
    const response = error.response;
    return response;
  }
};

//명세서 상세 조회하기
export const planSpecificationDetail = async (
  planSeq,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.get(
      apiAddress + `/api/v1/planDetail/specification/${planSeq}`,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("계획 명세서 상세 조회하기 성공:", response.data);
    return response;
  } catch (error) {
    console.log(
      "계획 명세서 상세 조회하기 실패:",
      error
    );
    const response = error.response;
    return response;
  }
};

//카테고리 소비 내역 조회
export const planDetailConsumeList = async (
  planDetailSeq,
  accessToken,
  grantType
) => {
  try {
    const response = await axios.get(
      apiAddress + `/api/v1/planDetail/${planDetailSeq}`,
      {
        headers: {
          Authorization: `${grantType} ${accessToken}`,
        },
      }
    );
    console.log("카테고리 소비 내역 조회 성공:", response.data);
    return response;
  } catch (error) {
    console.log(
      "카테고리 소비 내역 조회 실패:",
      error
    );
    const response = error.response;
    return response;
    // throw error;
  }
};
