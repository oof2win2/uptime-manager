import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface GlobalState {
	AuthUrl: string|undefined
}
// interface GlobalStatePayload {
// 	AuthUrl?: string
// }

const initialState: GlobalState = {
	AuthUrl: undefined
}
export const GlobalSlice = createSlice({
	name: "user",
	initialState: initialState,
	reducers: {
		setAuthUrl: (state: GlobalState, action: PayloadAction<{AuthUrl: string}>) => {
			state = {
				...state,
				AuthUrl: action.payload.AuthUrl
			}
			return state
		}
	}
})

export const { setAuthUrl } = GlobalSlice.actions
export default GlobalSlice.reducer