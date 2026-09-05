import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

export interface GetUsersResponseDto {
    data: UserDomainInterface[];
    isLoadMorePossible: boolean;
    count: number;
}

