import { Controller, Delete, Query, Req, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/admin/auth/admin-auth.guard";
import { SubjectsService } from "./service/subjects.service";
import { DeleteSubjectDto } from "./dto/delete-subject.dto";

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
}

