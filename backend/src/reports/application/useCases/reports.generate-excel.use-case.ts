import { Injectable, Logger } from '@nestjs/common';
import * as xl from 'excel4node';
import { FindAllWithDetailsClassUseCase } from '../../../class/application/useCases';
import { FindAllGroupUseCase } from '../../../group/application/useCases';
import { Group } from '../../../group/domain/entities/group.entity';
import { FindAllLocalUseCase } from '../../../local/application/useCases';
import { ClassMappers } from '../../../class/infra/mappers/class.mapper';
import * as moment from 'moment';
import * as _ from 'underscore';
import { FindAllLessonUseCase } from '../../../lesson/application/useCases';
import { FindAllTypeClassUseCase } from '../../../typeclass/application/useCases';
import { ClassDetailsDto } from '../../../class/application/dtos/class.details.dto';
import { LocalMappers } from '../../../local/infra/mappers/local.mappers';

@Injectable()
export class GenerateExcelReport {
  private _logger: Logger;

  constructor(
    private readonly findClassWithDetailsUseCase: FindAllWithDetailsClassUseCase,
    private readonly findGroupsUseCase: FindAllGroupUseCase,
    private readonly findLocals: FindAllLocalUseCase,
    private readonly findTypeClasses: FindAllTypeClassUseCase,
    private readonly findLessons: FindAllLessonUseCase) {
    this._logger = new Logger('GenerateExcelReport');
  }

  async Handle() {
    let doc = new xl.Workbook();

    const groups: Group[] = (await this.findGroupsUseCase.execute({ filter: {} }))
      .value
      .unwrap()
      .items;

    let nameStartRow = 4; // starting name of days (row)
    let nameStartColumn = 2; // starting name of days (column)

    for (let i = 0; i < groups.length; ++i) {

      const g = groups[i];

      const classes = (await this.findClassWithDetailsUseCase.execute({ filter: { groupId: g._id.toString() } }))
        .value
        .unwrap()
        .items
        .map(ClassMappers.DomainToDetails);

      if (classes.length == 0) continue;

      const grouped = _.groupBy(classes, (c) => c.week.id); // grouping by week

      let ws = doc.addWorksheet(g.fullName);

      let year = 0;

      for (let i = nameStartColumn; i < nameStartColumn + 5; ++i) { // name of days

        ws.column(i).setWidth(20);

        ws.cell(nameStartRow, i)
          .string(moment().day(i - nameStartColumn + 1).format('dddd'))
          .style({
            font: {
              italics: true,
            },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
          });
      }

      let startRow = nameStartRow + 1;
      let startColumn = nameStartColumn;

      // walking for each week
      for (let key in grouped) {

        let maxLessonInADay = 10;

        const classes = grouped[key]
          .sort((a, b) => a.start.getTime() - b.start.getTime());

        if (classes.length == 0) continue;

        let start = moment(classes[0].week.firstDate);
        let end = moment(classes[0].week.endDate);
        year = classes[0].lesson.year;

        let row = startRow;
        let column = startColumn;

        const weekLabel = `Semana ${start.format('DD/MM')}  - ${end.format('DD/MM')}`;
        ws
          .cell(startRow - 2, startColumn + 2)
          .string(weekLabel)
          .style({
            font: {
              bold: true,
              size: 14,
            },
            alignment: { horizontal: 'center' },
          });

        // explore specific week
        while (start.isBefore(end)) {
          const now = classes
            .filter(c => moment(c.start).isSame(start, 'day')); // day's classes

          maxLessonInADay = Math.max(maxLessonInADay, now.length + 5);

          now.forEach(c => {
            const turn = this.getNumberTurn(c);

            ws.cell(startRow + this.getValueToSum(turn), startColumn - 1)
              .string(`${turn}º Turno`)
              .style({
                alignment: { horizontal: 'center' },
              });

            ws.cell(startRow + this.getValueToSum(turn), column)
              .string(`${c.shortName} (${c.typeClass.shortName}) - ${c.local.shortName}`)
              .style({
                alignment: { horizontal: 'center' },
              });

            row++;
          });

          start = start.add(1, 'days');

          row = startRow;
          column++;
        }

        startRow += maxLessonInADay;
      }

      await this.makeLegend(ws, year);

    }

    await this.makeLocalsDistribution(doc, nameStartRow, nameStartColumn);

    return doc;
  }

  private getValueToSum(turn: number): number {
    if (turn === 1 || turn === 4) return 0;
    if (turn === 2 || turn === 5) return 1;
    if (turn === 3 || turn === 6) return 2;
  }

  private getNumberTurn(c: ClassDetailsDto): number {

    const minutesByTurns = [30, 5, 40, 15, 50, 25];
    return (minutesByTurns.findIndex(x => x === c.start.getMinutes()) + 1);

    // const init = '1997-09-21T';
    // const end = '+00:00';
    //
    // const firstTurn = [luxon.DateTime.fromISO(init + '08:40:00' + end), luxon.DateTime.fromISO(init + '09:50:00' + end)];
    // const secondTurn = [luxon.DateTime.fromISO(init + '10:15:00' + end), luxon.DateTime.fromISO(init + '11:30:00' + end)];
    // const thirdTurn = [luxon.DateTime.fromISO(init + '11:50:00' + end), luxon.DateTime.fromISO(init + '13:05:00' + end)];
    // const fourthTurn = [luxon.DateTime.fromISO(init + '13:25:00' + end), luxon.DateTime.fromISO(init + '14:40:00' + end)];
    // const fifthTurn = [luxon.DateTime.fromISO(init + '15:00:00' + end), luxon.DateTime.fromISO(init + '16:15:00' + end)];
    // const sixthTurn = [luxon.DateTime.fromISO(init + '16:35:00' + end), luxon.DateTime.fromISO(init + '17:50:00' + end)];
    //
    // const s = luxon.DateTime.fromISO(`${init}${c.start.getHours()}:${c.start.getMinutes()}:00${end}`);
    // const e = luxon.DateTime.fromISO(`${init}${c.end.getHours()}:${c.end.getMinutes()}:00${end}`);
    //
    // // in the morning
    // if (s < firstTurn[0] && e > firstTurn[1]) return 1;
    // if (s < secondTurn[0] && e > secondTurn[1]) return 2;
    // if (s < thirdTurn[0] && e > thirdTurn[1]) return 3;
    //
    // // in the afternoon
    // if (s < fourthTurn[0] && e > fourthTurn[1]) return 1;
    // if (s < fifthTurn[0] && e > fifthTurn[1]) return 2;
    // if (s < sixthTurn[0] && e > sixthTurn[1]) return 3;
    //
    // return -1;
  }

  private async makeLocalsDistribution(doc: xl.Workbook, startRow: number, startColumn: number) {

    this._logger.log('Local Distributions');

    const locals = (await this.findLocals.execute({ filter: {} }))
      .value
      .unwrap()
      .items
      .map(LocalMappers.DomainToDto)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));

    const classes = (await this.findClassWithDetailsUseCase.execute({ filter: {} }))
      .value
      .unwrap()
      .items
      .map(ClassMappers.DomainToDetails);

    if (classes.length == 0) return;

    const grouped = _.groupBy(classes, (c) => c.week.id); // grouping by week

    let ws = doc.addWorksheet('Distribucion por locales');

    for (let i = startColumn; i < startColumn + locals.length; ++i) { // name of locals

      ws.column(i)
        .setWidth(20);

      ws.cell(startRow - 1, i)
        .string(locals[i - startColumn].fullName)
        .style({
          font: {
            italics: true,
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
          },
        });
    }


    let sr = startRow + 1;
    let sc = startColumn;

    // walking for each week
    for (let key in grouped) {

      const classes = grouped[key]
        .sort((a, b) => a.fullName.localeCompare(b.fullName));

      if (classes.length == 0) continue;

      let row = startRow;
      let column = startColumn;

      const weekLabel = `Semana ${moment(classes[0].week.firstDate).format('DD/MM')} - ${moment(classes[0].week.endDate).format('DD/MM')}`;
      ws
        .cell(startRow - 2, startColumn + 2)
        .string(weekLabel)
        .style({
          font: {
            bold: true,
            size: 14,
          },
          alignment: { horizontal: 'center' },
        });


      // set turns numbers
      for (let i = 0; i < 6; ++i) {
        ws.cell(startRow + i, startColumn - 1)
          .string(`${i + 1}º Turno`)
          .style({
            alignment: { horizontal: 'center' },
          });
        row++;
      }

      for (let i = 0; i < locals.length; ++i, row = startRow, column++) {
        const l = locals[i];

        const classByLocals = classes.filter(x => x.local.id === l.id); // all lessons in local l

        if (classByLocals.length === 0) continue;

        const groupByHours = _.groupBy(classByLocals, c => `${c.start.getHours()}-${c.start.getMinutes()}`);

        for (let k in groupByHours) {
          const g = groupByHours[k] as Array<ClassDetailsDto>;

          const turn = this.getNumberTurn(g[0]);

          let textInCell = [];
          g.forEach(l => {
            textInCell.push(`${moment(l.start).format('DD/MM')} ${l.group.shortName} (${l.typeClass.shortName}) ${l.lesson.shortName}\n`);
          });

          textInCell.sort();

          ws.row(startRow + turn - 1).setHeight(100);

          ws.cell(startRow + turn - 1, column)
            .string(textInCell)
            .style({
              alignment: { horizontal: 'center', wrapText: true },
              font: {
                size: 13,
              },
            });
        }

      }
      startRow += 10; // rows between weeks
    }
  }

  private async makeLegend(ws: xl.Worksheet, year: number) {
    let row = 3;
    let column = 9;

    ws.cell(row, column + 1)
      .string('Asignaturas')
      .style({
        font: {
          bold: true,
          size: 12,
        },
        alignment: { horizontal: 'center' },
      });

    const lessons = (await this.findLessons.execute({ filter: { year: year } }))
      .value
      .unwrap()
      .items;

    row += 1;

    for (let i = 0; i < lessons.length; ++i, ++row) {
      ws.cell(row, column)
        .string(lessons[i].shortName)
        .style({
          alignment: { horizontal: 'center' },
        });

      ws.cell(row, column + 1)
        .string(lessons[i].fullName);
    }
    row += 2;

    ws.cell(row, column + 1)
      .string('Horario de los turnos')
      .style({
        font: {
          bold: true,
          size: 12,
        },
        alignment: { horizontal: 'center' },
      });

    let start = moment('08:30', 'HH:mm');
    for (let i = 0; i < 6; ++i) {
      ws.cell(row + i + 1, column)
        .string(`${i + 1}º turno`)
        .style({
          alignment: { horizontal: 'center' },
        });

      ws.cell(row + i + 1, column + 1)
        .string(`${start.format('hh:mm A')} - ${start.add(1 * 60 + 35, 'minutes').format('hh:mm A')}`);

      start.add(5, 'minutes');
    }
  }
}