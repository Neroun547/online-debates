import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/admin/auth/admin-auth.guard";
import { GetUsersRequestDto } from "./dto/get-users-request.dto";
import { UserService } from "./service/users.service";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { AdminUpdateUserDto } from "./dto/admin-update-user.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/users")
export class AdminUsersController {
    constructor(private usersService: UserService) {

    }
    
    @Get()
    async getUsers(@Query() query: GetUsersRequestDto) {
        return await this.usersService.getUsers({
            page: query.page,
            limit: query.limit,
            searchUsername: query.searchUsername
        });
    }

    @Delete(":userId")
    async deleteUserById(@Param("userId", new ParseIntPipe()) userId: number) {
        await this.usersService.deleteUserById(userId);

        return;
    }

    @Post()
    async createUser(@Body() body: CreateUserRequestDto) {
        await this.usersService.createUser({
            username: body.username,
            email: body.email,
            timezone: body.timezone,
            password: body.password,
            age: body.age,
            description: body.description,
            sex: body.sex
        });

        return;
    }

    @Put(":userId")
    async updateUser(@Param("userId", new ParseIntPipe()) userId: number, @Body() body: AdminUpdateUserDto) {
        await this.usersService.adminUpdateUser({
            userId: userId,
            email: body.email,
            username: body.username,
            timezone: body.timezone
        });

        return;
    }
}
