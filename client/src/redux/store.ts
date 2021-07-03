import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import UserReducer from './user'
import GlobalReducer from "./global"

const store = configureStore({
	reducer: {
		user: UserReducer,
		global: GlobalReducer
	},
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// the react-redux docs don't show what this returns so let's leave it be
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store