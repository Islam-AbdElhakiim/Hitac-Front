import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "employees",
    initialState: {},
    reducers: {
        LOGIN: (state, action) => {
            let user = action.payload.user;
            // user.expires = action.payload.expires;
            return user;
        },

    }

})

export const { LOGIN } = authSlice.actions;
export default authSlice.reducer;