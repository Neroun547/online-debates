import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetSubjectsDto } from "./dto/get-subjects.dto";
import { CreateSubjectDto } from "./dto/create-subject.dto";
import type { Request } from "express";
import { SubjectsService } from "./service/subjects.service";
import { UpdateSubjectDto } from "./dto/update-subject.dto";
import { GetByCategoryIdWithCategoryAndUserResponseDto } from "./dto/get-by-category-id-with-category-and-user-response.dto";
import { GetSubjectByIdWithCategoryAndUserResponseDto } from "./dto/get-subject-by-id-with-category-and-user-response.interface";
import { GetSubjectUsersRequestDto } from "./dto/get-subject-users-request.dto";

@Controller("subjects")
export class SubjectsController {
    constructor(private subjectsService: SubjectsService) {}
    
    @UseGuards(AuthGuard)
    @Get()
    async getSubjects(@Query() query: GetSubjectsDto): Promise<GetByCategoryIdWithCategoryAndUserResponseDto> {
        return await this.subjectsService.getByCategoryIdWithCategoryAndUser(
            {
                page: query.page,
                limit: query.limit,
                categoryId: query.categoryId,
                userId: query.userId
            }
        );
    }
    
    @UseGuards(AuthGuard)
    @Post()
    async createSubject(@Body() body: CreateSubjectDto, @Req() req: Request) {
        await this.subjectsService.createSubject(body.name, body.categoryId, req["user"].id);

        return;
    }

    @UseGuards(AuthGuard)
    @Get(":subjectId/users")
    async getSubjectUsers(@Req() req: Request, @Query() query: GetSubjectUsersRequestDto) {
        return this.subjectsService.getUsersBySubjectId(query.subjectId, query.page, query.limit, req["user"].id);   
    }


    @UseGuards(AuthGuard)
    @Get(":id")
    async getSubjectById(@Param("id", new ParseIntPipe()) id: number): Promise<GetSubjectByIdWithCategoryAndUserResponseDto> {
        return await this.subjectsService.getSubjectWithUserAndCategoryById(id);
    }

    @UseGuards(AuthGuard)
    @Put(":id")
    async updateSubject(@Body() body: UpdateSubjectDto, @Req() req: Request, @Param("id", new ParseIntPipe()) id: number) {
        await this.subjectsService.updateSubjectByCategoryIdAndUserId(req["user"].id, body.categoryId, id, body);

        return;
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    async deleteSubjectById(@Param("id", new ParseIntPipe()) id: number, @Req() req: Request) {
        await this.subjectsService.deleteSubjectById(id, req["user"].id);

        return;
    } 
}

