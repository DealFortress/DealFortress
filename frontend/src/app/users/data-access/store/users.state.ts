import { User } from "@app/shared/models/user/user.model";
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";


export interface UsersState extends EntityState<User> {
    loggedInUser?: User,
    errorMessage?: string,
    statusCode?: number,
    loggedInUserStatusCode?: number
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({})

export const initialState : UsersState = usersAdapter.getInitialState({ errorMessage: '' });