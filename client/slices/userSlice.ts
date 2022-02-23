import {createSlice, PayloadAction} from "@reduxjs/toolkit"; 
import {User} from "../interfaces";

interface UserState {
    accessToken : string | null, 
    data : User | null
}

const initialState : UserState = {
    accessToken : null,
    data : null,
}

export const userSlice = createSlice({
    name : "user", 
    initialState, 
    reducers : {
        updateToken : (state, action:PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        updateUserData : (state, action:PayloadAction<User>) => {
            const obj = {...action.payload};
            state.data = obj; 
        }
    }
})

export const {updateToken, updateUserData} = userSlice.actions; 
export default userSlice.reducer; 