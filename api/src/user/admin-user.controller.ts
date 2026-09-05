import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/admin/auth/admin-auth.guard";
import { GetUsersRequestDto } from "./dto/get-users-request.dto";
import { UserService } from "./service/users.service";

@UseGuards(AdminAuthGuard)
@Controller("/admin/users")
export class AdminUsersController {
    constructor(private usersService:  UserService) {

    }
    
    @Get()
    async getUsers(@Query() query: GetUsersRequestDto) {
        return await this.usersService.getUsers({
            page: query.page,
            limit: query.limit,
            searchUsername: query.searchUsername
        });
    }
}
