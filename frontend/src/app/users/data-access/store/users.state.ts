import { User } from "@app/shared/models/user.model";
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";


export interface UsersState extends EntityState<User> {
    user?: User,
    currentlyShownUser?: User,
    errorMessage?: string,
    statusCode?: number
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({})

export const initialState : UsersState = usersAdapter.getInitialState({ errorMessage: '' });