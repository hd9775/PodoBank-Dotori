// src/api/accountApi.js
import axios from 'axios';
const apiAddress ="http://j9d107.p.ssafy.io:9600"

// 사용자 계좌 잔액 조회
export const userBalanceInquiry = async (codeInfo, ManagerAccessToken) => {
  try {
    const response = await axios.post(apiAddress+`/api/v1/fintech/balance`, codeInfo, {
      headers: {
        Authorization: `Bearer ${ManagerAccessToken}`,
      },
    });
    console.log('사용자 계좌 잔액 조회 성공:', response.data);
    return response;
  } catch (error) {
    console.error('사용자 계좌 잔액 조회 실패:', error.status, error.data);
    const response = error.response
    return response
    // throw error;
  }
};
// 사용자 계좌 입금
export const userAccountDeposit = async (depositInfo, ManagerAccessToken) => {
  try {
    const response = await axios.post(apiAddress+`/api/v1/fintech/deposit`, depositInfo, {
      headers: {
        Authorization: `Bearer ${ManagerAccessToken}`,
      },
    });
    console.log('사용자 계좌 입금 성공:', response.data);
    return response;
  } catch (error) {
    console.error('사용자 계좌 입금 실패:', error.status, error.data);
    const response = error.response
    return response
    // throw error;
  }
};
// 사용자 계좌 내역 조회
export const userAccountdetailsInquiry = async (historyInfo, ManagerAccessToken) => {
  try {
    const response = await axios.post(apiAddress+`/api/v1/fintech/history`, historyInfo, {
      headers: {
        Authorization: `Bearer ${ManagerAccessToken}`,
      },
    });
    console.log('사용자 계좌 내역 조회 성공:', response.data);
    return response;
  } catch (error) {
    console.error('사용자 계좌 내역 조회 실패:', error.status, error.data);
    const response = error.response
    return response
    // throw error;
  }
};
// 1원 송금 확인
export const oneCentVerificationCheck  = async (codeInfo, ManagerAccessToken) => {
  try {
    const response = await axios.post(apiAddress+`/api/v1/fintech/oneCentVerification/check`, codeInfo, {
      headers: {
        Authorization: `Bearer ${ManagerAccessToken}`,
      },
    });
    console.log('1원 송금 확인 성공:', response.data);
    return response;
  } catch (error) {
    console.error('1원 송금 확인 실패:', error.status, error.data);
    const response = error.response
    return response
    // throw error;
  }
};
// 1원 송금
export const oneCentVerification = async (codeInfo, ManagerAccessToken) => {
  try {
    const response = await axios.post(apiAddress+`/api/v1/fintech/oneCentVerification`, codeInfo, {
      headers: {
        Authorization: `Bearer ${ManagerAccessToken}`,
      },
    });
    console.log('1원 송금 성공:', response.data);
    return response;
  } catch (error) {
    console.error('1원 송금 실패:', error.status, error.data);
    const response = error.response
    return response
    // throw error;
  }
};
// 사용자 계좌 출금
export const userAccountWithrawal = async (withdrawInfo, ManagerAccessToken) => {
  try {
    const response = await axios.post(apiAddress+`/api/v1/fintech/withdraw`, withdrawInfo, {
      headers: {
        Authorization: `Bearer ${ManagerAccessToken}`,
      },
    });
    console.log('사용자 계좌 출금 성공:', response.data);
    return response;
  } catch (error) {
    console.error('사용자 계좌 출금 실패:', error.status, error.data);
    const response = error.response
    return response
    // throw error;
  }
};