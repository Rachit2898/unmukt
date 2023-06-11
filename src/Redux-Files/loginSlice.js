import { createSlice } from '@reduxjs/toolkit'

const loginSlice = createSlice({
name: 'login',
initialState: null,
reducers: {
  isLogin: (state, action) => {
    state = action.payload;
    return action.payload
  }
}
});
export const { isLogin } = loginSlice.actions
export default loginSlice.reducer