export enum RowLocations {
  teachers = `"teachers"."id"`,
  locals = `"local"."id"`,
  lessons = `"lesson"."id"`,
  typeClasses = `"typeclass"."id"`,
  groups = `"group"."id"`,
  weeks = `"week"."id"`,
  departments = `"teachers"."department_id"`,
  localCapacity = `"local"."capacity"`,
  dayOfWeek = `"class"."start"`,
  startDescription = `"class"."start"`,
  endDescription = `"class"."end"`
}


export function ExistInEnum(value: string, _enum: any) {
  return Object.values(_enum).includes(value as any);
}

export function OperaSet(s1: Set<any>, op: string, s2: Set<any>) {
  switch (op) {
    case 'EQUALS':
      return s1.size == s2.size && Array.from(s1).every(element => {
        return s2.has(element);
      });

    case 'NOT_EQUALS':
      return s1.size != s2.size || Array.from(s1).some(element => {
        return !s2.has(element);
      });

    case 'SUBSET':
      return Array.from(s1).every(element => {
        return s2.has(element);
      });

    default:
      return false;
  }
}

export function OperaNumbers(n1: number, op: string, n2: number): boolean {
  switch (op) {
    case '==':
      return n1 == n2;
    case '!=':
      return n1 != n2;
    case '>':
      return n1 > n2;
    case '<':
      return n1 < n2;
    case '>=':
      return n1 >= n2;
    case '<=':
      return n1 <= n2;
    default:
      return false;
  }
}

export const BodyQuery = `
    SELECT "class"."id"               AS "class_id",
           "class"."created_at"       AS "class_created_at",
           "class"."updated_at"       AS "class_updated_at",
           "class"."shortName"        AS "class_shortName",
           "class"."fullName"         AS "class_fullName",
           "class"."description"      AS "class_description",
           "class"."priority"         AS "class_priority",
           "class"."local_id"         AS "class_local_id",
           "class"."lesson_id"        AS "class_lesson_id",
           "class"."type_class_id"    AS "class_type_class_id",
           "class"."group_id"         AS "class_group_id",
           "class"."start"            AS "class_start",
           "class"."resourceId"       AS "class_resourceId",
           "class"."end"              AS "class_end",
           "class"."serieId"          AS "class_serieId",
           "class"."color"            AS "class_color",
           "class"."week_id"          AS "class_week_id",
           "teachers"."id"            AS "teachers_id",
           "teachers"."created_at"    AS "teachers_created_at",
           "teachers"."updated_at"    AS "teachers_updated_at",
           "teachers"."shortName"     AS "teachers_shortName",
           "teachers"."fullName"      AS "teachers_fullName",
           "teachers"."description"   AS "teachers_description",
           "teachers"."priority"      AS "teachers_priority",
           "teachers"."email"         AS "teachers_email",
           "teachers"."department_id" AS "teachers_department_id",
           "local"."id"               AS "local_id",
           "local"."created_at"       AS "local_created_at",
           "local"."updated_at"       AS "local_updated_at",
           "local"."shortName"        AS "local_shortName",
           "local"."fullName"         AS "local_fullName",
           "local"."description"      AS "local_description",
           "local"."priority"         AS "local_priority",
           "local"."faculty_id"       AS "local_faculty_id",
           "local"."capacity"         AS "local_capacity",
           "lesson"."id"              AS "lesson_id",
           "lesson"."created_at"      AS "lesson_created_at",
           "lesson"."updated_at"      AS "lesson_updated_at",
           "lesson"."shortName"       AS "lesson_shortName",
           "lesson"."fullName"        AS "lesson_fullName",
           "lesson"."description"     AS "lesson_description",
           "lesson"."priority"        AS "lesson_priority",
           "lesson"."year"            AS "lesson_year",
           "lesson"."teacher_id"      AS "l esson_teacher_id",
           "lesson"."local_id"        AS "lesson_local_id",
           "lesson"."major_id"        AS "lesson_major_id",
           "group"."id"               AS "group_id",
           "group"."created_at"       AS "group_created_at",
           "group"."updated_at"       AS "group_updated_at",
           "group"."shortName"        AS "group_shortName",
           "group"."fullName"         AS "group_fullName",
           "group"."description"      AS "group_description",
           "group"."priority"         AS "group_priority",
           "group"."year"             AS "group_year",
           "group"."major_id"         AS "group_major_id",
           "group"."color"            AS "group_color",
           "typeclass"."id"           AS "typeclass_id",
           "typeclass"."created_at"   AS "typeclass_created_at",
           "typeclass"."updated_at"   AS "typeclass_updated_at",
           "typeclass"."shortName"    AS "typeclass_shor tName",
           "typeclass"."fullName"     AS "typeclass_fullName",
           "typeclass"."description"  AS "typeclass_description",
           "typeclass"."priority"     AS "typeclass_priority",
           "typeclass"."type"         AS "typeclass_type",
           "typeclass"."duration"     AS "typeclass_duration",
           "week"."id"                AS "week_id",
           "week"."created_at"        AS "week_created_at",
           "week"."updated_at"        AS "week_updated_at",
           "week"."shortName"         AS "week_shortName",
           "week"."fullName"          AS "week_fullName",
           "week"."description"       AS "week_description",
           "week"."priority"          AS "week_priority",
           "week"."duration"          AS "we ek_duration",
           "week"."firstDate"         AS "week_firstDate",
           "week"."endDate"           AS "week_endDate",
           "week"."semester_id"       AS "week_semester_id",
           "week"."number"            AS "week_number"
    FROM "class" "class"
             LEFT JOIN "class_teachers_teacher" "class_teachers"
                       ON "class_teachers"."classId" = "class"."id"
             LEFT JOIN "teacher" "teachers"
                       ON "teachers"."id" = "class_teachers"."teacherId"
             LEFT JOIN "local" "local"
                       ON "local"."id" = "class"."local_id"
             LEFT JOIN "lesson" "lesson"
                       ON "lesson"."id" = "class"."lesson_id"
             LEFT JOIN "group" "group"
                       ON "group"."id" = "class"."group_id"
             LEFT JOIN "typeclass" "typeclass"
                       ON "typeclass"."id" = "class"."type_class_id"
             LEFT JOIN "week" "week"
                       ON "week"."id" = "class"."week_id"
`;

// classes aqui tiene un objeto de la forma: {class_id: '', class_start: '', class_end: '',} xq es una consulta directa sobre la BD
export function BuildInterval(classes: any[], intervalTimePeriod: number): any[][] {
  const result = [];
  const classesCopy = [...classes];

  while (classesCopy.length > 0) {
    const firstClass = classesCopy[0];

    const startDate = new Date(firstClass['class_start'] || firstClass.start);
    const endDate = new Date(firstClass['class_start'] || firstClass.start);

    endDate.setDate(endDate.getDate() + intervalTimePeriod);

    const classesInInterval = classesCopy.filter((c) => {
      const x1 = startDate;
      const x2 = c['class_start'] || c.start;
      const x3 = endDate;

      // console.log(x1, " /// ", x2, " /// ", x3);
      // console.log(x1 >= x2 && x1 < x3);

      return x2 >= x1 && x2 < x3;
    });

    result.push(classesInInterval);
    classesCopy.splice(0, classesInInterval.length);

    // console.log(classesInInterval.length);

  }
  return result;
}