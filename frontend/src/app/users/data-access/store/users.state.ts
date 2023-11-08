import { User } from "@app/shared/models/user.model";


export type UsersState = {
    user?: User,
    currentlyShownUser?: User,
    errorMessage?: string,
    statusCode?: number
}