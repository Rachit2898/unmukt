import {configureStore} from '@reduxjs/toolkit'
import loginSlice from './loginSlice'
import mapAreaCordinates from './mapAreaCordinates'
import ProfileSlice from './ProfileSlice'

export const store = configureStore({
    reducer: {
        login: loginSlice,
        areaCordinates: mapAreaCordinates,
        profile:ProfileSlice
    }
})
