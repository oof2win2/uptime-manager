import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserClass } from 'src/generated/graphql'


export type UserState = UserClass|null
const initialState = null as UserState
export const UserSlice = createSlice({
	name: "user",
	initialState: initialState,
	reducers: {
		setUser: (state: UserState, action: PayloadAction<UserClass>) => {
			state = action.payload
			return state
		}
	}
})

export const { setUser } = UserSlice.actions
export default UserSlice.reducer