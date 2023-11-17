import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const loaderSlice = createSlice({
    name: "loader",
    initialState: {
        isLoading: true 
    },
    reducers: {
        SHOW_LOADER: (state) => {
            return {isLoading: true}
        },
        HIDE_LOADER: (state) => {
            return {isLoading: false}
        },

    }

})

export const { SHOW_LOADER, HIDE_LOADER } = loaderSlice.actions;
export default loaderSlice.reducer;