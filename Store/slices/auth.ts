import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

// Define a type for the slice state

interface User {
    id: number,
    name: string,
    email: string,
    role: string,
    accountId?: string,
}

export interface AuthState {
    user: User | null,
}


// Define the initial state using that type
const initialState: AuthState = {
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        changeUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload
        },
        resetAuthData: (state) => {
            state.user = null
        }
    },
})

export const {
    resetAuthData,
    changeUser,
} = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth

export default authSlice.reducer