import { Controller, Get, Logger, Response } from '@nestjs/common';
import { GenerateExcelReport } from '../../application/useCases/reports.generate-excel.use-case';

@Controller('reports')
export class ReportsController {
  private _logger: Logger;

  constructor(
    private readonly generateExcelReport: GenerateExcelReport,
  ) {
    this._logger = new Logger('ReportsController');
  }

  @Get('excel')
  async generateExcel(@Response() res) {
    this._logger.log('Generate Excel');

    let doc = await this.generateExcelReport.Handle();

    // return doc;
    doc.write('horario.xlsx', res);
  }
}