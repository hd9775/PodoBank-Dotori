import { createSlice } from '@reduxjs/toolkit';


// 슬라이스(slice) 리듀서 정의
const purposeSlice = createSlice({
  name: 'purpose',
  initialState: {
    // accessToken:null,
    // refreshToken:null,
    // userTokenRefreshModalVisible:false, // AccessToken 만료 시 띄우는 모달창
    // accessTokenExpiration: null,  // AccessToken 만료 시간을 저장
    // isnotReissuanceToken : false, // 재발급 여부에서 안할 시 True
    // userInfo: null,
    testValue: 0,
    isCalendarVisible : false
  },
  reducers: {
    testFuntion(state){
      state.testValue += 1
    },
    changeIsCalendarVisible(state, action){
      state.refreshToken = action.payload
    },
  },
});

export const { 
    changeIsCalendarVisible,
} = purposeSlice.actions;

export default purposeSlice.reducer;