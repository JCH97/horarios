import Vue from 'vue';
import Vuex from 'vuex';
import CourseController from './controllers/course';
import CoursesController from './controllers/courses';
import EventController from './controllers/event';
import EventsController from './controllers/events';
import ProfileController from './controllers/Profile/profile';
import QueryController from './controllers/query';
import ResourceController from './controllers/resource';
import ResourcesController from './controllers/resources';
import NotificationsController from './controllers/notifications';
import RoutesController from './controllers/routes';
import TagController from './controllers/tag';
import TagsController from './controllers/tags';
import UserController from './controllers/Users/user';
import UsersController from './controllers/Users/users';
import IntervalsController from './controllers/intervals';
import FreeLocalsController from './controllers/free_locals';
import FreeResourcesController from './controllers/free_resources';
import UniversitiesController from './controllers/University/universities';
import UniversityController from './controllers/University/university';
import FacultiesController from './controllers/Faculty/faculties';
import FacultyController from './controllers/Faculty/faculty';
import TeachersController from './controllers/Teacher/teachers';
import TeacherController from './controllers/Teacher/teacher';
import LocalsController from './controllers/Local/locals';
import LocalController from './controllers/Local/local';
import TypeClasses from './controllers/TypeClasses/typeClasses';
import TypeClass from './controllers/TypeClasses/typeClass';
import Majors from './controllers/Major/majors';
import Major from './controllers/Major/major';
import GroupController from './controllers/Group/group';
import GroupsController from './controllers/Group/groups';
import DepartmentController from './controllers/Department/department';
import DepartmentsController from './controllers/Department/departments';
import LessonController from './controllers/Lessons/lesson';
import LessonsController from './controllers/Lessons/lessons';
import SemesterController from './controllers/Semester/semester';
import SemestersControllers from './controllers/Semester/semesters';
import ClassController from './controllers/Class/class';
import ClassesController from './controllers/Class/classes';
import ReportsController from './controllers/Reports/report';
import LocationController from './controllers/Location/location';
import RestrictionsControllers from './controllers/Restrictions/restrictions';
import SimpleCountRestrictionsController from './controllers/Restrictions/simple_count_restrictions';
import CountConditionsRestrictionsController from './controllers/Restrictions/count_conditions_restrictions';
import SimpleCountRestrictionsDetails from './controllers/Restrictions/simple_count_restriction.details';
import CountCondtionalsRestrictinsDetails from './controllers/Restrictions/count_conditions_restriction.details';
import DistributionRestrictions from './controllers/Restrictions/distribution_attr_restrictions';
import DistributionRestrictionsDetails from './controllers/Restrictions/distribute_attr_restrictions_details';
import RelationalRestrictions from './controllers/Restrictions/relational-restrictions.';
import RelationalRestrictionsDetails from './controllers/Restrictions/relational-restrictions_details';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    course: CourseController,
    courses: CoursesController,
    event: EventController,
    events: EventsController,
    group: GroupController,
    groups: GroupsController,
    profile: ProfileController,
    query: QueryController,
    resource: ResourceController,
    resources: ResourcesController,
    notifications: NotificationsController,
    routes: RoutesController,
    tag: TagController,
    tags: TagsController,
    user: UserController,
    users: UsersController,
    intervals: IntervalsController,
    free_locals: FreeLocalsController,
    free_resources: FreeResourcesController,
    university: UniversityController,
    universities: UniversitiesController,
    faculties: FacultiesController,
    faculty: FacultyController,
    teachers: TeachersController,
    teacher: TeacherController,
    local: LocalController,
    locals: LocalsController,
    typeClasses: TypeClasses,
    typeClass: TypeClass,
    majors: Majors,
    major: Major,
    department: DepartmentController,
    departments: DepartmentsController,
    lesson: LessonController,
    lessons: LessonsController,
    semester: SemesterController,
    semesters: SemestersControllers,
    class: ClassController,
    classes: ClassesController,
    reports: ReportsController,
    location: LocationController,
    restrictions: RestrictionsControllers,
    simpleCountRestrictions: SimpleCountRestrictionsController,
    simpleCountRestrictionsDetails: SimpleCountRestrictionsDetails,
    countConditionsRestrictions: CountConditionsRestrictionsController,
    countConditionsRestrictionsDetails: CountCondtionalsRestrictinsDetails,
    distributionRestrictions: DistributionRestrictions,
    distributionRestrictionsDetails: DistributionRestrictionsDetails,
    relationalRestrictions: RelationalRestrictions,
    relationalRestrictionsDetails: RelationalRestrictionsDetails,
  }, mutations: {}, actions: {},
});

export default store;
