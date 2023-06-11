import { createSlice } from '@reduxjs/toolkit'

const ProfileSlice = createSlice({
name: 'profiledata',
initialState: {},
reducers: {
  ProfileData: (state, action) => {
    console.log(action)
    state = action.payload;
    return action.payload
  }
}
});
export const { ProfileData } = ProfileSlice.actions
export default ProfileSlice.reducer