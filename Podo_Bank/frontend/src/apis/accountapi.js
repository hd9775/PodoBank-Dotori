// src/api/accountApi.js
import axios from 'axios';
const apiAddress ="http://j9d107.p.ssafy.io:9600"

// 계좌가 최근에 보낸 계좌 3개를 받음
export const accountRecentTransfer = async (accountNumber, accessToken) => {
  try {
    const response = await axios.get(apiAddress+`/api/v1/account/${accountNumber}/recent`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('최근 송금 계좌 조회 성공:', response.data);
    return response;
  } catch (error) {
    console.error('최근 송금 계좌 조회 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
export const accountTransactionHistory = async (sendHistoryUnits, accountNumber, accessToken) => {
  try {
    console.log('어카운트넘버',accountNumber)
    console.log(accessToken)
    const response = await axios.get(apiAddress+`/api/v1/account/${accountNumber}/history?searchMonth=${sendHistoryUnits.searchMonth}&transactionType=${sendHistoryUnits.transactionType}&sortType=${sendHistoryUnits.sortType}&page=${sendHistoryUnits.page}`, 
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('계좌 거래 내역 조회 성공:', response.data);
    return response;
  } catch (error) {
    console.error('계좌 거래 내역 조회 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
// export const accountTransactionHistory = async (sendHistoryUnits, accountNumber, accessToken) => {
//   try {
//     console.log(accessToken)
//     const response = await axios.get(apiAddress+`/api/v1/account/${accountNumber}/history`, 
//     // {
//     //   params:sendHistoryUnits,
//     // },
//     {
//       params:{
//         searchMonth : 1,
//         transactionType : 'ALL',
//         sortType: 1,
//         page: 0,
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     console.log('계좌 거래 내역 조회 성공:', response.data);
//     return response;
//   } catch (error) {
//     console.error('계좌 거래 내역 조회 실패:', error);
//     const response = error.response
//     return response
//     // throw error;
//   }
// };
export const accountTransactionDetail = async (accountNumber, accessToken) => {
  try {
    const response = await axios.get(apiAddress+`/api/v1/account/${accountNumber}/detail`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('계좌 상세 조회 성공:', response.data);
    return response;
  } catch (error) {
    console.error('계좌 상세 조회 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
export const accountOwnerInquiry = async (accountNumber, accessToken) => {
  try {
    console.log(accountNumber)
    const response = await axios.get(apiAddress+`/api/v1/account/${accountNumber}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    console.log('계좌 소유주 조회 성공:', response.data);
    return response;
  } catch (error) {
    console.error('계좌 소유주 조회 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
export const accountWithdrawal  = async (withdrawInfo, accessToken) => {
  try {
    const response = await axios.patch(apiAddress+'/api/v1/account/withdraw', withdrawInfo, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('계좌 출금 성공:', response.data);
    return response;
  } catch (error) {
    console.error('계좌 출금 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
export const accountTypeInquiry = async (accessToken) => {
  try {
    const response = await axios.get(apiAddress+'/api/v1/account/type', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('계좌 종류 조회 성공:', response.data);
    return response;
  } catch (error) {
    console.error('계좌 종류 조회 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
export const accountTransfer = async (transferInfo, accessToken) => {
  try {
    const response = await axios.patch(apiAddress+'/api/v1/account/transfer', transferInfo, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('계좌 이체 성공:', response.data);
    return response;
  } catch (error) {
    console.error('계좌 이체 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
export const accountPasswordInitialization = async (resetInfo, accessToken) => {
  try {
    const response = await axios.patch(apiAddress+'/api/v1/account/password/reset', resetInfo, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('계좌 비밀번호 초기화 성공:', response.data);
    return response;
  } catch (error) {
    console.error('계좌 비밀번호 초기화 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
export const accountPasswordChange = async (pwChangeInfo, accessToken) => {
  try {
    const response = await axios.patch(apiAddress+'/api/v1/account/password/change', pwChangeInfo, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('계좌 비밀번호 변경 성공:', response.data);
    return response;
  } catch (error) {
    console.error('계좌 비밀번호 변경 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
export const accountDeposit = async (sendInfo, accessToken) => {
  try {
    const response = await axios.patch(apiAddress+'/api/v1/account/deposit', sendInfo, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('계좌 입금 성공:', response.data);
    return response;
  } catch (error) {
    console.error('계좌 입금 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
export const accountDelete = async (deleteInfo, accessToken) => {
  try {
    console.log(deleteInfo, accessToken)
    const response = await axios.post(apiAddress+'/api/v1/account/delete', deleteInfo, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('계좌 삭제 성공:', response.data);
    return response;
  } catch (error) {
    console.error('계좌 삭제 실패:', error.response.data, error.response.status);
    const response = error.response
    return response
    // throw error;
  }
};
export const accountCreate = async (createInfo, accessToken) => {
  console.log(createInfo, 'and', accessToken)
  try {
    const response = await axios.post(apiAddress+'/api/v1/account/create', createInfo, {
    // const response = await axios.post(apiAddress+'/api/v1/account/create', {accountCategoryId:createInfo.accountCategoryId, password:createInfo.password}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    console.log('계좌 생성 성공:', response.data);
    return response;
  } catch (error) {
    console.error('계좌 생성 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};

// 계좌 비밀번호 초기화시 이메일 인증 코드 확인
export const userAccountPwEmailVerificationCheck = async (code, email) => {
  try {
    const response = await axios.post(apiAddress+'/api/v1/user/emailVerification/check', {code:code, email:email, type:"RESET_ACCOUNT_PASSWORD"});
    console.log('이메일 인증 코드 확인 성공:', response.data)
    return response;
  } catch (error) {
    console.error('이메일 인증 코드 확인 실패:', error.response.status);
    const response = error.response
    return response
    // throw error;
  }
};

// 계좌 비밀번호 초기화시 이메일 인증 코드 전송
export const userAccountPwEmailVerificationSend = async (email) => {
  try {
    const response = await axios.post(apiAddress+'/api/v1/user/emailVerification', {email:email, type:"RESET_ACCOUNT_PASSWORD"});
    console.log('이메일 인증 코드 전송 성공:',response.status)
    return response;
  } catch (error) {
    console.error('이메일 인증 코드 전송 실패:', error);
    const response = error.response
    return response
    // throw error;
  }
};
// export const accountCreate = async (createInfo, accessToken) => {
//   console.log(createInfo, 'and', accessToken)
//   try {
//     const response = await axios.post(apiAddress+'/api/v1/account/create', createInfo, {
//     // const response = await axios.post(apiAddress+'/api/v1/account/create', {accountType:createInfo.accountType, password:createInfo.password}, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//     console.log('계좌 생성 성공:', response.data);
//     return response;
//   } catch (error) {
//     console.error('계좌 생성 실패:', error);
//     const response = error.response
//     return response
//     // throw error;
//   }
// };

export const accountListInquiry = async (accessToken) => {
  try {
    const response = await axios.get(apiAddress + '/api/v1/account/list', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('계좌 목록 조회 성공:', response.data)
    return response;
  } catch (error) {
    console.error('계좌 목록 조회 실패:', error);
    const response = error.response
    return response
    
    // throw error;
  }
};

export const accountNicknameChange = async (accountInfo, accessToken) => {
// export const accountNicknameChange = async (accountNumber, nickname, accessToken) => {
  try {
    const response = await axios.patch(apiAddress + '/api/v1/account/nickname', accountInfo, {
    // const response = await axios.patch(apiAddress + '/api/v1/account/nickname', {accountNumber:accountNumber,nickname:nickname}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('계좌 목록 조회 성공:', response.data)
    return response;
  } catch (error) {
    console.error('계좌 목록 조회 실패:', error);
    const response = error.response
    return response
    
    // throw error;
  }
};