import { Module } from '@nestjs/common';
import { GenerateExcelReport } from './application/useCases/reports.generate-excel.use-case';
import { ClassModule } from '../class/class.module';
import { GroupModule } from '../group/group.module';
import { LocalModule } from '../local/local.module';
import { ReportsController } from './presentation/controllers/reports.controller';
import { LessonModule } from '../lesson/lesson.module';
import { TypeclassModule } from '../typeclass/typeclass.module';

@Module({
  imports: [
    ClassModule,
    GroupModule,
    LocalModule,
    LessonModule,
    TypeclassModule,
  ],
  providers: [GenerateExcelReport],
  exports: [GenerateExcelReport],
  controllers: [ReportsController],
})
export class ReportModule {
}
