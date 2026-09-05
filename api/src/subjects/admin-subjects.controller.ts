import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/admin/auth/admin-auth.guard";
import { SubjectsService } from "./service/subjects.service";
import { DeleteSubjectDto } from "./dto/delete-subject.dto";
import { CreateSubjectDto } from "./dto/create-subject.dto";
import { GetSubjectsRequestDto } from "./dto/get-subjects-request.dto";
import { GetSubjectsResponseDto } from "./dto/get-subjects-response.dto";
import { AdminUpdateSubjectDto } from "./dto/admin-update-subject.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/subjects")
export class AdminSubjectsController {
    constructor(private subjectsService: SubjectsService) {

    }
    
    @Delete()
    async deleteSubject(@Query() query: DeleteSubjectDto, @Req() req: Request) {
        await this.subjectsService.deleteSubjectFromAdmin({
            subjectId: query.subjectId,
            categoryId: query.categoryId,
            adminId: req["user"].id
        });

        return;
    }

    @Post()
    async createSubject(@Body() body: CreateSubjectDto) {
        await this.subjectsService.adminCreateSubject(body.name, body.categoryId);

        return;
    }

    @Get()
    async getSubjects(@Query() query: GetSubjectsRequestDto): Promise<GetSubjectsResponseDto> {
        const result = await this.subjectsService.getSubjects({ page: query.page, limit: query.limit });
        
        return {
            data: result.data,
            count: result.count
        }
    }

    @Put(":id")
    async updateSubjectById(@Param("id", new ParseIntPipe()) id: number, @Body() body: AdminUpdateSubjectDto) {
        await this.subjectsService.updateSubject(id, body);

        return;
    }
}

