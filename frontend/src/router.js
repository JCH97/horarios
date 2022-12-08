import Vue from 'vue';
import Router from 'vue-router';
import Course from './components/Course';
import Courses from './components/Courses';
import Event from './components/Event';
import Events from './components/Events';
import Home from './components/Home';
import Login from './views/Login';
import Nav from './views/Nav';
import NotFound from './views/NotFound';
import Profile from './components/Profile/Profile';
import Register from './views/Register';
import Resource from './components/Resource';
import Resources from './components/Resources';
import Notifications from './components/Notifications';
import Store from './store';
import Tag from './components/Tag';
import Tags from './components/Tags';
import User from './components/Users/User';
import Users from './components/Users/Users';
import Editor from './components/Editor';
import Panel from './components/Panel';
import Forbidden from './views/Forbidden';
import Permission from './utils/permission';
import Universities from '@/components/University/Universities';
import University from '@/components/University/University';
import Faculties from '@/components/Faculty/Faculties';
import Faculty from '@/components/Faculty/Faculty';
import Teachers from '@/components/Teacher/Teachers';
import Teacher from '@/components/Teacher/Teacher';
import Local from '@/components/Local/Local';
import Locals from '@/components/Local/Locals';
import TypeClasses from '@/components/TypeClass/TypeClasses';
import TypeClass from '@/components/TypeClass/TypeClass';
import Majors from '@/components/Major/Majors';
import Major from '@/components/Major/Major';
import Group from '@/components/Group/Group';
import Groups from '@/components/Group/Groups';
import ChooseGroup from '@/components/Group/ChooseGroup';
import Department from '@/components/Department/Department';
import Departments from '@/components/Department/Departments';
import ChooseDepartment from '@/components/Department/ChooseDepartment';
import ChooseFaculty from '@/components/Faculty/ChooseFaculty';
import ChooseLocals from '@/components/Local/ChooseLocals';
import ChooseMajor from '@/components/Major/ChooseMajor';
import ChooseLesson from '@/components/Lesson/ChooseLesson';
import Lessons from '@/components/Lesson/Lessons';
import Lesson from '@/components/Lesson/Lesson';
import ChooseTeacher from '@/components/Teacher/ChooseTeacher';
import Semester from '@/components/Semester/Semester';
import Semesters from '@/components/Semester/Semesters';
import HandleConditions from '@/components/Restrictions/HandleConditions';
import HandleRestrictionsSimpleCount from '@/components/Restrictions/SimpleCountRestrictions';
import ChooseRestrictionType from '@/components/Restrictions/ChooseRestrictionType';
import CountConditionsRestrictions from '@/components/Restrictions/CountConditionsRestrictions';
import Restrictions from '@/components/Restrictions/Restrictions';
import BreachedRestrictions from '@/components/Restrictions/BreachedRestrictions/BreachedRestrictions';
import BreachedRestrictionsDetails from '@/components/Restrictions/BreachedRestrictions/BreachedRestrictionsDetails';
import DistributionRestrictions from '@/components/Restrictions/DistributionRestrictions';
import RelationalRestrictions from '@/components/Restrictions/RelationalRestrictions';

Vue.use(Router);

const checkforAuth = (to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    Store.state.profile.loadMinData();
    if (Store.state.profile.isLogued() === false) {
      next({ name: 'loginPage' });
    }
  }
};

const checkRoles = (to, from, next) => {
  if (to.matched.some(route => route.meta.requireRoles)) {
    Store.state.profile.loadMinData();
    let haveAccess = true;
    to.meta.requireRoles.forEach((role) => {
      haveAccess = haveAccess & Store.state.profile.hasRole(role);
    });
    if (haveAccess === 0) {
      next({ name: 'forbiddenPage' });
    }
  }
};

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    //Redirections
    {
      path: '/',
      redirect: { name: 'homePage' },
    },
    //Redirections
    {
      path: '/nav',
      name: 'navPage',
      component: Nav,
      meta: {
        // requiresAuth: true,
      },
      children: [
        {
          path: '/home',
          name: 'homePage',
          component: Home,
        },
        {
          path: '/universities',
          name: 'universitiesPage',
          component: Universities,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/universities/:universityId',
          name: 'universityPage',
          component: University,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/faculties/:universityId',
          name: 'facultiesPage',
          component: Faculties,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/faculties/details/:facultyId',
          name: 'facultyPage',
          component: Faculty,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/faculty/choose',
          name: 'chooseFacultyPage',
          component: ChooseFaculty,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/semesters/',
          name: 'semestersPage',
          component: Semesters,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/semester/details/:semesterId',
          name: 'semesterPage',
          component: Semester,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },

        {
          path: '/teacher/choose',
          name: 'chooseTeacherPage',
          component: ChooseTeacher,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/teachers/:departmentId',
          name: 'teachersPage',
          component: Teachers,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/teachers/details/:teacherId',
          name: 'teacherPage',
          component: Teacher,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/local/choose',
          name: 'chooseLocalPage',
          component: ChooseLocals,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/locals/:facultyId',
          name: 'localsPage',
          component: Locals,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/locals/:localId',
          name: 'localPage',
          component: Local,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/typeclasses',
          name: 'typeClassesPage',
          component: TypeClasses,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/typeclasses/:typeClassId',
          name: 'typeClassPage',
          component: TypeClass,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/major/choose',
          name: 'chooseMajorPage',
          component: ChooseMajor,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/majors/:facultyId',
          name: 'majorsPage',
          component: Majors,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/major/:majorId',
          name: 'majorPage',
          component: Major,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/lesson/choose',
          name: 'chooseLessonPage',
          component: ChooseLesson,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/lesson/:majorId',
          name: 'lessonsPage',
          component: Lessons,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/lesson/details/:lessonId',
          name: 'lessonPage',
          component: Lesson,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },

        {
          path: '/courses/:courseId',
          name: 'coursePage',
          component: Course,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/courses',
          name: 'coursesPage',
          component: Courses,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/restrictions/',
          name: 'restrictionsPage',
          component: Restrictions,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/breached_restrictions/details/:restrictionId/:restrictionType',
          name: 'breachedRestrictionsDetailsPage',
          component: BreachedRestrictionsDetails,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/breached_restrictions/',
          name: 'breachedRestrictionsPage',
          component: BreachedRestrictions,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/restrictions/conditions',
          name: 'restrictionsConditionsPage',
          component: HandleConditions,
          props: {
            show: true,
          },
          meta: {
            requiresAuth: true,
            // requireRoles: [
            //   Permission.RESTRICTIONS_VIEW,
            // ],
          },
        },
        {
          path: '/restrictions/simple_count',
          name: 'simpleCountRestrictionsPage',
          component: HandleRestrictionsSimpleCount,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/restrictions/relational',
          name: 'relationalRestrictionPage',
          component: RelationalRestrictions,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/restrictions/count_conditions',
          name: 'countConditionsRestrictionsPage',
          component: CountConditionsRestrictions,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/restrictions/distribution_attribute',
          name: 'distributeAttributeRestriction',
          component: DistributionRestrictions,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'restrictions/type',
          name: 'chooseRestrictionsTypePage',
          component: ChooseRestrictionType,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/events/:eventId',
          name: 'eventPage',
          component: Event,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/events',
          name: 'eventsPage',
          component: Events,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },

        {
          path: '/group/choose',
          name: 'chooseGroupPage',
          component: ChooseGroup,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/groups/details/:groupId',
          name: 'groupPage',
          component: Group,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/groups/:majorId',
          name: 'groupsPage',
          component: Groups,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/department/choose',
          name: 'chooseDepartmentPage',
          component: ChooseDepartment,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/department/details/:departmentId',
          name: 'departmentPage',
          component: Department,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/department/:facultyId',
          name: 'departmentsPage',
          component: Departments,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/profile',
          name: 'profilePage',
          component: Profile,
          meta: {
            requiresAuth: true,
            // requireRoles: [
            //   Permission.VIEW_PANEL,
            // ],
          },
        },
        {
          path: '/resources/:resourceId',
          name: 'resourcePage',
          component: Resource,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/resources',
          name: 'resourcesPage',
          component: Resources,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/tags/:tagId',
          name: 'tagPage',
          component: Tag,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
        {
          path: '/tags',
          name: 'tagsPage',
          component: Tags,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/users/:userId',
          name: 'userPage',
          component: User,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/notifications',
          name: 'notificationsPage',
          component: Notifications,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/users',
          name: 'usersPage',
          component: Users,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: '/editor/:groupId',
          name: 'editorPage',
          component: Editor,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
              Permission.CREATE_EVENT,
            ],
          },
        },
        {
          path: '/panel',
          name: 'panelPage',
          component: Panel,
          meta: {
            requiresAuth: true,
            requireRoles: [
              Permission.VIEW_PANEL,
            ],
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'loginPage',
      component: Login,
      beforeEnter(to, from, next) {
        Store.state.profile.loadMinData();
        if (Store.state.profile.isLogued() === true) {
          next({ name: Store.state.routes.getLast() });
        }
        next();
      },
    },
    {
      path: '/register',
      name: 'registerPage',
      component: Register,
    },
    {
      path: '/forbidden',
      name: 'forbiddenPage',
      component: Forbidden,
    },
    {
      path: '*',
      name: 'notFoundPage',
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  checkforAuth(to, from, next);
  checkRoles(to, from, next);
  next();
});

router.afterEach((to, from) => {
  Store.state.routes.updateLast(from.name);
});

export default router;