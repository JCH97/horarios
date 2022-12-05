export type WeekCreateBySemesterDto = {
  semesterStart: Date;
  semesterEnd: Date;
  semesterId: { id: string };
};