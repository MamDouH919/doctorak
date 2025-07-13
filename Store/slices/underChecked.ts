import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface Type {
    state: boolean,
}


// Define the initial state using that type
const initialState: Type = {
    state: false,
}

export const underCheckedSlice = createSlice({
    name: 'underChecked',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        changeDialogState: (state, action: PayloadAction<Type>) => {
            state.state = action.payload.state
        },
    },
})

export const {
    changeDialogState
} = underCheckedSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUnderChecked = (state: RootState) => state.underChecked.state

export default underCheckedSlice.reducer