import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserModel } from "src/generated/graphql"

export type UserState = UserModel | null
const initialState = null as UserState
export const UserSlice = createSlice({
	name: "user",
	initialState: initialState,
	reducers: {
		setUser: (state: UserState, action: PayloadAction<UserModel>) => {
			state = action.payload
			return state
		},
		logoutUser: (state: UserState) => {
			state = null
			return state
		},
	},
})

export const { setUser, logoutUser } = UserSlice.actions
export default UserSlice.reducer
