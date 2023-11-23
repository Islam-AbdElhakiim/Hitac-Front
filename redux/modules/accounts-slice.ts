import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const accountsSlice = createSlice({
    name: "accounts",
    initialState: [],
    reducers: {
        GETALLACCOUNTS: (state, action) => {
            return action.payload.accounts;
        },

    }

})

export const { GETALLACCOUNTS } = accountsSlice.actions;
export default accountsSlice.reducer;