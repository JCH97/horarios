import Vue from 'vue';
import Vuex from 'vuex';
import CourseController from './controllers/course';
import CoursesController from './controllers/courses';
import EventController from './controllers/event';
import EventsController from './controllers/events';
import GroupController from './controllers/group';
import GroupsController from './controllers/groups';
import ProfileController from './controllers/profile';
import QueryController from './controllers/query';
import ResourceController from './controllers/resource';
import ResourcesController from './controllers/resources';
import NotificationsController from './controllers/notifications';
import RoutesController from './controllers/routes';
import TagController from './controllers/tag';
import TagsController from './controllers/tags';
import UserController from './controllers/user';
import UsersController from './controllers/users';
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
  }, mutations: {}, actions: {},
});

export default store;
