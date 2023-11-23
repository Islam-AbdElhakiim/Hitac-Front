import { configureStore} from '@reduxjs/toolkit';
import employeesReducer from './modules/employees-slice';
import accountsReducer from './modules/accounts-slice';
import authReducer from './modules/auth-slice';
import loaderReducer from './modules/loader-slice';

export const store = configureStore({
    reducer: {
        employeesReducer,
        accountsReducer,
        authReducer,
        loaderReducer
    }
}) ;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

