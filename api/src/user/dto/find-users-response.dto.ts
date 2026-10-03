import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

export interface FindUsersResponseDto {
    data: UserDomainInterface[];
    isLoadMoreAvailable: boolean;
}