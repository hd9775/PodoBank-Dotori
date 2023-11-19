import { createSlice } from '@reduxjs/toolkit';


// 슬라이스(slice) 리듀서 정의
const userSlice = createSlice({
  name: 'user',
  initialState: {
    accessToken:null,
    refreshToken:null,
    userTokenRefreshModalVisible:false, // AccessToken 만료 시 띄우는 모달창
    accessTokenExpiration: null,  // AccessToken 만료 시간을 저장
    isnotReissuanceToken : false, // 재발급 여부에서 안할 시 True
    userInfo: null,
  },
  reducers: {
    inputAccessToken(state, action){
      state.accessToken = action.payload
    },
    inputRefreshToken(state, action){
      state.refreshToken = action.payload
    },
    setUserTokenRefreshModalVisible(state, action){
      state.userTokenRefreshModalVisible = action.payload
    },
    setAccessTokenExpiration(state, action) {
      state.accessTokenExpiration = action.payload; // AccessToken의 만료 시간 설정
      // console.log(action.payload)
    },
    setIsnotReissuanceToken(state, action) {
      state.accessTokenExpiration = action.payload; // AccessToken의 재발급 여부 미발급 결정시 True
      console.log("action.payload:",action.payload, 'state.accessTokenExpiration:', state.accessTokenExpiration)
    },
    setUserInfo(state, action){
      state.userInfo = action.payload
      console.log(state.userInfo)
    },
  },
});

export const { 
  inputAccessToken, inputRefreshToken, setUserTokenRefreshModalVisible,
  setAccessTokenExpiration, setIsnotReissuanceToken, setUserInfo,
} = userSlice.actions;

export default userSlice.reducer;