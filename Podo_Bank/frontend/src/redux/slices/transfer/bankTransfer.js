import { createSlice } from '@reduxjs/toolkit';


// 슬라이스(slice) 리듀서 정의
const bankTransferSlice = createSlice({
  name: 'bankTransfer',
  initialState: {
    count: 0,
    nameorigin: null,
    nametmp:null,
  },
  reducers: {
    increment(state) {
      state.count += 1;
      state.nameorigin = 'kim';
      state.nametmp = state.nameorigin;
    },
    decrement(state) {
      state.count -= 1;
      state.nameorigin ='no';
      state.nametmp = state.nameorigin;
    },
    incrementByAmount(state, action) {
      state.count += action.payload;
      state.nameorigin = 'what';
      state.nametmp = state.nameorigin;
    },
    changeNameNum(state) {
      const randomNum = Math.floor(Math.random() * 100) +1;
      state.nametmp = `${state.nameorigin}${randomNum}`;
    },
  },
});

export const { increment, decrement, incrementByAmount, changeNameNum } =
bankTransferSlice.actions;

export default bankTransferSlice.reducer;

// // 사용 예시 
// import { useSelector, useDispatch } from 'react-redux';
// import { decrement, increment, incrementByAmount,changeNameNum } from '../../redux/slices/transfer/bankTransfer'
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