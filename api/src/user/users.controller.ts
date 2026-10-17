import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Query,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "./auth/auth.guard";
import { UserService } from "./service/users.service";
import { FindByIdWithSubjectsResponseDto } from "./dto/find-by-id-with-subjects-response.dto";
import { FindUsersRequestDto } from "./dto/find-users-request.dto";
import { FindUsersResponseDto } from "./dto/find-users-response.dto";

@Controller("users")
export class UsersController {
    constructor(private usersService: UserService) {}

    @UseGuards(AuthGuard)
    @Get()
    async findUsers(
        @Query() query: FindUsersRequestDto,
    ): Promise<FindUsersResponseDto> {
        return await this.usersService.findUsers(query);
    }

    @UseGuards(AuthGuard)
    @Get(":id")
    async getUserById(
        @Param("id", new ParseIntPipe()) id: number,
    ): Promise<FindByIdWithSubjectsResponseDto> {
        return await this.usersService.findByIdWithSubjects(id);
    }
}
