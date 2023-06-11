import { createSlice } from '@reduxjs/toolkit'

const mapAreaCordinates = createSlice({
name: 'areaCordinates',
initialState: [],
reducers: {
  cordinates: (state, action) => {
    state = action.payload;
    return action.payload
  }
}
});

export const { cordinates } = mapAreaCordinates.actions
export default mapAreaCordinates.reducer