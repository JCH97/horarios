const baseUrl = 'http://localhost:3001/';

export default {
  baseUrl: baseUrl,
  login: baseUrl + 'auth/login',
  courses: baseUrl + 'courses',
  events: baseUrl + 'events',
  permissions: baseUrl + 'permissions',
  roles: baseUrl + 'roles',
  resources: baseUrl + 'resources',
  notifications: baseUrl + 'notifications',
  tags: baseUrl + 'tags',
  token: baseUrl + 'auth/login',
  intervals: baseUrl + 'intervals',
  free_locals: baseUrl + 'locals/free',
  free_resources: baseUrl + 'resources/free',

  users: baseUrl + 'user',
  register: baseUrl + 'auth/register',
  profile: baseUrl + 'user/profile',
  usersGetAll: baseUrl + 'user/all',
  linkUserTeacher: baseUrl + 'user/link_teacher',

  local: baseUrl + 'local',
  localGetAll: baseUrl + 'local/all',

  groups: baseUrl + 'group',
  groupsGetAll: baseUrl + 'group/all',

  universities: baseUrl + 'university',
  universitiesGetAll: baseUrl + 'university/all',

  faculties: baseUrl + 'faculty',
  facultiesGetAll: baseUrl + 'faculty/all',

  teachers: baseUrl + 'teacher',
  teachersGetAll: baseUrl + 'teacher/all',
  teachersBreakUser: baseUrl + 'teacher/unlink_user',

  typeClasses: baseUrl + 'typeclass',
  typeClassesGetAll: baseUrl + 'typeclass/all',

  majors: baseUrl + 'major',
  majorsGetAll: baseUrl + 'major/all',

  classes: baseUrl + 'class',
  multipleEditionClass: baseUrl + 'class/multiple',
  multipleEditionByFields: baseUrl + 'class/multiple_by_fields',
  classesGetAll: baseUrl + 'class/all',
  classRemoveInSerie: baseUrl + 'class/in_serie',
  query: baseUrl + 'class/query',
  multipleCreateClass: baseUrl + 'class/create/multiple',
  createClass: baseUrl + 'class/create',

  departments: baseUrl + 'department',
  departmentGetAll: baseUrl + 'department/all',

  semesters: baseUrl + 'semester',
  semestersGetAll: baseUrl + 'semester/all',

  lessons: baseUrl + 'lesson',
  lessonsGetAll: baseUrl + 'lesson/all',

  excelReport: baseUrl + 'reports/excel',

  restrictions: baseUrl + 'restrictions',
  simple_count_restrictions: baseUrl + 'restrictions/simple_count_restrictions',
  count_conditions_restrictions: baseUrl + 'restrictions/count_conditions_restrictions',
  distribute_restrictions: baseUrl + 'restrictions/distribution_restrictions',
  relational_restrictions: baseUrl + 'restrictions/relational_restrictions',

  happiness: baseUrl + 'restrictions/happiness',
  getRestrictionsDescriptions: baseUrl + 'restrictions/descriptions'
};