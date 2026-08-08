import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetSubjectsDto } from "./dto/get-subjects.dto";
import { CreateSubjectDto } from "./dto/create-subject.dto";
import type { Request } from "express";
import { SubjectsService } from "./service/subjects.service";
import { UpdateSubjectDto } from "./dto/update-subject.dto";
import { GetByCategoryIdWithCategoryAndUserResponseDto } from "./dto/get-by-category-id-with-category-and-user-response.dto";

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

