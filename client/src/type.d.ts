import { UserModel } from "./generated/graphql"

export interface ReactGlobalState {
	user: UserModel | null
}
