import { createSlice } from '@reduxjs/toolkit';


// 슬라이스(slice) 리듀서 정의
const accountSlice = createSlice({
  name: 'account',
  initialState: {
    totalBalance:0,
    // changeNicknameModalVisible : false,
  },
  reducers: {
    changeTotalBalance(state, action){
      state.totalBalance = action.payload
    },
    // setChangeNicknameModalVisible(state, action){
    //   state.userTokenRefreshModalVisible = action.payload
    // },
  },
});

export const {
   changeTotalBalance,
} = accountSlice.actions;

export default accountSlice.reducer;




// // 사용 예시 
// import { useSelector, useDispatch } from 'react-redux';
// import { decrement, increment, incrementByAmount,changeNameNum } from '../../redux/slices/accounts/account'
// const count = useSelector((state) => state.counter.count);
// const name = useSelector((state) => state.counter.nametmp);
// const count2 = useSelector((state) => state.whole.count2);
// const name2 = useSelector((state) => state.whole.nameTmp2);
// const dispatch = useDispatch();
// <Button
//   title="Increment"
//   aria-label="Increment value"
//   onPress={() => dispatch(increment())}
// />