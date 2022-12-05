<template>
  <div id='home'>
    <div id='wrapper'>
      <!-- Sidebar -->
      <ul class='navbar-nav bg-gradient-primary sidebar sidebar-dark accordion' id='accordionSidebar'>
        <!-- Sidebar - Brand -->
        <router-link :to="{name: 'homePage'}" class='sidebar-brand d-flex align-items-center justify-content-center'
                     href=''>
          <div class='sidebar-brand-icon rotate-n-15'>
            <i class='fas fa-calendar-alt'></i>
          </div>
          <!--<div class="sidebar-brand-text mx-3"></div>-->
        </router-link>
        <!-- Divider -->
        <hr class='sidebar-divider my-0'>
        <!-- Nav Item - Inicio -->
        <li class='nav-item'>
          <router-link :to="{name: 'homePage'}" class='nav-link'>
            <i class='fas fa-fw fa-home'></i>
            <span>Inicio</span></router-link>
        </li>


        <!--        <li class='nav-item' v-if='this.isLogued() && this.viewPanel()'>-->
        <!--          <router-link :to="{name: 'usersPage'}" class='nav-link'>-->
        <!--            <i class='fas fa-fw fa-user'></i>-->
        <!--            <span>Usuarios</span></router-link>-->
        <!--        </li>-->


        <li class='nav-item'>
          <a
            class='nav-link' href='#' data-toggle='collapse' data-target='#collapse_horarios' aria-expanded='true'
            aria-controls='collapse_horarios'>
            <i class='fas fa-fw fa-folder'></i>
            <span>Horario Utilidades</span>
          </a>
        </li>

        <div class='mx-4'>
          <div class='collapse' id='collapse_horarios' v-if='this.isLogued()'>

            <li v-if='this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'universitiesPage'}" class='nav-link'>
                <i class='fas fa-fw fa-building'></i>
                <span>Universidades</span>

              </router-link>
            </li>

            <li v-if='this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'chooseFacultyPage'}" class='nav-link'>
                <i class='fas fa-fw fa-building'></i>
                <span>Facultades</span>

              </router-link>
            </li>

            <li v-if='this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'chooseMajorPage'}" class='nav-link'>
                <i class='fas fa-fw fa-building'></i>
                <span>Carreras</span>

              </router-link>
            </li>

            <li v-if='this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'chooseLocalPage'}" class='nav-link'>
                <i class='fas fa-fw fa-building'></i>
                <span>Locales</span>

              </router-link>
            </li>

            <li v-if='this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'chooseTeacherPage'}" class='nav-link'>
                <i class='fas fa-fw fa-people-carry'></i>
                <span>Profesores</span>
              </router-link>
            </li>

            <li v-if='this.handleRestrictions() || this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'restrictionsPage'}" class='nav-link'>
                <i class='fas fa-fw fa-building'></i>
                <span>Restricciones</span>
              </router-link>
            </li>

            <li v-if='this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'breachedRestrictionsPage'}" class='nav-link'>
                <i class='fas fa-fw fa-building'></i>
                <span>Restr. Incumplidas</span>
              </router-link>
            </li>

            <li v-if='this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'chooseLessonPage'}" class='nav-link'>
                <i class='fas fa-fw fa-building'></i>
                <span>Asignaturas</span>

              </router-link>
            </li>

            <li v-if='this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'typeClassesPage'}" class='nav-link'>
                <i class='fas fa-fw fa-th-list'></i>
                <span>Tipos de clase</span>

              </router-link>
            </li>

            <li v-if='this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'chooseGroupPage'}" class='nav-link'>
                <i class='fas fa-fw fa-people-carry'></i>
                <span>Grupos</span>

              </router-link>
            </li>

            <li v-if='this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'chooseDepartmentPage'}" class='nav-link'>
                <i class='fas fa-fw fa-people-carry'></i>
                <span>Departamentos</span>

              </router-link>
            </li>

            <li v-if='this.viewPanel()' class='nav-item form-inline'>
              <router-link @click.native='scrollToTop()' :to="{name: 'semestersPage'}" class='nav-link'>
                <i class='fas fa-fw fa-people-carry'></i>
                <span>Semestres</span>

              </router-link>
            </li>
          </div>

        </div>
        <!-- Divider -->
        <hr class='sidebar-divider'>
        <!-- Heading -->
        <!--<div class="sidebar-heading">-->
        <!--Addons-->
        <!--</div>-->
        <!-- Nav Item - Pages Collapse Menu -->
        <li class='nav-item'>
          <a class='nav-link' href='#' data-toggle='collapse' data-target='#collapsePages' aria-expanded='true'
             aria-controls='collapsePages'>
            <i class='fas fa-fw fa-folder'></i>
            <span>Enlaces Externos</span>
          </a>
          <div id='collapsePages' class='collapse' aria-labelledby='headingPages'
               data-parent='#accordionSidebar'>
            <div class='bg-white py-2 collapse-inner rounded'>
              <h6 class='collapse-header'>Sitios Matcom:</h6>
              <a class='collapse-item' href='http://foros.matcom.uh.cu'
                 @click.prevent="openNewTab('http://foros.matcom.uh.cu')">Foros Matcom</a>
              <a class='collapse-item' href='http://correo.estudiantes.matcom.uh.cu'
                 @click.prevent="openNewTab('http://correo.estudiantes.matcom.uh.cu')">Correo</a>
              <div class='collapse-divider'></div>
              <h6 class='collapse-header'>Sitios UH:</h6>
              <a class='collapse-item' href='http://www.uh.cu' @click.prevent="openNewTab('http://www.uh.cu')">UH</a>
            </div>
          </div>
        </li>
        <!-- Divider -->
        <hr class='sidebar-divider d-none d-md-block'>
        <!-- Sidebar Toggler (Sidebar) -->
        <!-- <div class="text-center d-none d-md-inline">
            <button class="rounded-circle border-0" id="sidebarToggle"></button>
        </div> -->
      </ul>
      <!-- End of Sidebar -->
      <div id='content-wrapper' class='d-flex flex-column'>
        <!-- Main Content -->
        <div id='content'>
          <!-- Topbar -->
          <nav class='navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow'>
            <!-- Sidebar Toggle (Topbar) -->
            <button id='sidebarToggleTop' class='btn btn-link d-md-none rounded-circle mr-3'>
              <i class='fa fa-bars'></i>
            </button>
            <h1 class='h2 mb-0 text-dark'>
              Calendario Matcom
            </h1>
            <!-- Topbar Navbar -->
            <ul class='navbar-nav ml-auto'>

              <!-- Happinnes-->
              <li class='nav-item dropdown no-arrow mx-1'>
                <a class='nav-link dropdown-toggle' href='#' id='userDropdown' role='button'
                   data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                  <i class='fas fa-smile mr-2'
                     :style='{color: [happiness >= 80 ? "#2BC10A" : happiness >= 60 ? "#EED013" : "#CD101C"] }'>
                  </i>
                  <span
                    class='mr-3 d-none d-lg-inline text-gray-600 small'>
                    {{ happiness }}
                  </span>
                </a>
              </li>

              <div class='topbar-divider d-none d-sm-block'></div>

              <!-- Nav Item - Alerts -->
              <li class='nav-item dropdown no-arrow mx-1'>
                <a class='nav-link dropdown-toggle' href='#' id='alertsDropdown' role='button'
                   data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                  <i class='fas fa-bell fa-fw'></i>
                  <!-- Counter - Alerts -->
                  <span v-if='notifications_unseened' class='badge badge-danger badge-counter'>{{ notifications_unseened
                    }}</span>
                </a>
                <!-- Dropdown - Alerts -->
                <div class='dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in'
                     aria-labelledby='alertsDropdown'>
                  <h6 class='dropdown-header text-center'>
                    Notificaciones
                  </h6>
                  <!-- <a class="dropdown-item d-flex align-items-center" href="#">
                      <div class="mr-3">
                          <div class="icon-circle bg-primary">
                              <i class="fas fa-file-alt text-white"></i>
                          </div>
                      </div>
                      <div>
                          <div class="small text-gray-500">12 de diciembre del 2020</div>
                          <span class="font-weight-bold">Un nuevo reporte esta listo para ser descargado</span>
                          <div class="small text-gray-500">Grupo(s): C322</div>
                      </div>
                  </a>
                  <a class="dropdown-item d-flex align-items-center" href="#">
                      <div class="mr-3">
                          <div class="icon-circle bg-success">
                              <i class="fas fa-donate text-white"></i>
                          </div>
                      </div>
                      <div>
                          <div class="small text-gray-500">7 de diciembre del 2020</div>
                          290.29 dolares han sido depositados en su cuenta.
                      </div>
                  </a> -->
                  <a v-for='(noti, index) in notifications' :key='noti.id'
                     class='dropdown-item d-flex align-items-center' href='' @click.prevent='seen(noti.id, index)'>
                    <div>
                      <div class='small text-gray-500'>{{ render_date(noti.date) }}</div>
                      <h6 :class="noti.seened ? '': 'font-weight-bold'" class='mb-0'>{{ noti.title }}</h6>
                      <div :class="noti.seened ? '': 'font-weight-bold'" class='mb-0'>{{ noti.body }}</div>
                      <div v-if='noti.groups.length > 0' class='small text-gray-500'>Grupo(s): {{
                          parseGroupsToStr(noti.groups) }}
                      </div>
                    </div>
                  </a>
                  <router-link v-if='notifications.length > 0' :to="{name: 'notificationsPage'}"
                               class='dropdown-item text-center small text-gray-500'>Ver todas las notificaciones
                  </router-link>
                  <span v-else class='dropdown-item text-center text-dark'>No hay notificaciones para mostrar</span>
                </div>
              </li>

              <div class='topbar-divider d-none d-sm-block'></div>

              <div v-if='isLogued()'>

                <li class='nav-item dropdown no-arrow'>
                  <a class='nav-link dropdown-toggle' href='#' id='userDropdown' role='button'
                     data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                    <span class='mr-3 d-none d-lg-inline text-gray-600 small'>{{ username }}</span>
                    <i class='fas fa-user fa-lg fa-fw mr-2 text-gray-400'></i>
                    <!--                    <img class='img-profile rounded-circle' :src='user_pic_location'>-->
                  </a>
                  <!-- Dropdown - User Information -->
                  <div class='dropdown-menu dropdown-menu-right shadow animated--grow-in'
                       aria-labelledby='userDropdown'>
                    <router-link :to="{name: 'profilePage'}" class='dropdown-item'>
                      <i class='fas fa-user fa-sm fa-fw mr-2 text-gray-400'></i>
                      Perfil
                    </router-link>
                    <router-link v-if='viewPanel()' :to="{name: 'panelPage'}" class='dropdown-item'>
                      <i class='fas fa-edit fa-sm fa-fw mr-2 text-gray-400'></i>
                      Administrar
                    </router-link>
                    <!-- <a class="dropdown-item" href="#">
                        <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Configuración
                    </a> -->
                    <div class='dropdown-divider'></div>
                    <a class='dropdown-item' href='#' data-toggle='modal' data-target='#logoutModal'>
                      <i class='fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400'></i>
                      Cerrar Sesión
                    </a>
                  </div>
                </li>

              </div>
              <div v-else>

                <li class='nav-item dropdown no-arrow'>
                  <a class='nav-link dropdown-toggle' href='#' id='userDropdown' role='button'
                     data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                    <!--                    <img class='img-profile rounded-circle' :src='user_pic_location'>-->
                    <router-link :to="{name: 'loginPage'}" class='dropdown-item'>
                      <i class='fas fa-user fa-fw mr-2 text-gray-400'></i>
                      <span class='mr-3 d-none d-lg-inline text-gray-600 small'>Login</span>
                    </router-link>
                  </a>
                </li>

              </div>

            </ul>
          </nav>
          <!-- End of Topbar -->
          <!-- Begin Page Content -->
          <div class='container-fluid'>
            <!-- Page Heading -->
            <router-view></router-view>
          </div>
          <!-- /.container-fluid -->
        </div>
        <!-- End of Main Content -->
        <hr>
        <!-- Footer -->
        <footer class='sticky-footer bg-white'>
          <div class='container my-auto'>
            <div class='copyright text-center my-auto'>
              <strong>Facultad de Matemática y Computación de la Universidad de La Habana &copy; 2022</strong>
            </div>
          </div>
        </footer>
        <!-- End of Footer -->
      </div>
      <!-- End of Content Wrapper -->
    </div>
    <!-- Scroll to Top Button-->
    <!-- <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a> -->

    <!-- Logout Modal-->
    <div class='modal fade' id='logoutModal' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel'
         aria-hidden='true'>
      <div class='modal-dialog' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title' id='exampleModalLabel'>¿Está seguro que desea cerrar sesión?</h5>
            <button class='close' type='button' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>x</span>
            </button>
          </div>
          <div class='modal-footer'>
            <button class='btn btn-secondary' type='button' data-dismiss='modal'>Cancelar</button>
            <button class='btn btn-primary' data-dismiss='modal' @click='logoutUser'>Cerrar Sesión</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Permission from '@/utils/permission';
import { renderPresentation } from '../utils/render_date';
import { convertGroupsToStr } from '../utils/utils';
import Condition_types from '@/controllers/Restrictions/condition_types';

export default {
  name: 'Home',
  data() {
    return {
      loginOut: false,
      user_pic_location: './img/default_user_image.jpeg',
      username: '',
      notifications: [],
      notifications_unseened: 0,
      happiness: 100,
    };
  },
  methods: {
    getHappiness() {
      this.$store.state.restrictions.getHappiness({})
        .then(result => {
          if (result === true) {
            this.happiness = (this.$store.state.restrictions.data[Condition_types.HAPPINESS]).happiness;
            this.happiness = isNaN(this.happiness) || !this.happiness ? 0 : Math.trunc(this.happiness * 100);
          }
        });
    },

    scrollToTop() {
      window.scrollTo(0, 0);
    },

    logoutUser() {
      this.$store.state.profile.logOut();
      this.$router.push({ name: 'loginPage' });
    },

    openNewTab(url) {
      window.open(url, '_blank');
    },

    viewPanel() {
      return this.$store.state.profile.hasRole(Permission.VIEW_PANEL);
    },

    handleRestrictions() {
      return this.$store.state.profile.hasRole(Permission.HANDLE_RESTRICTIONS);
    },

    isLogued() {
      return this.$store.state.profile.isLogued();
    },

    render_date(start) {
      return renderPresentation(start, null);
    },

    parseGroupsToStr(groups) {
      return convertGroupsToStr(groups);
    },

    seen(id, index) {
      let token = this.$store.state.profile.data.token;
      this.$store.state.notifications.setSeened(token, id).then(status => {
        if (status)
          this.notifications[index].seened = true;
      });
      this.$store.state.notifications.update();
    },

    loadData() {
      let token = this.$store.state.profile.data.token;
      this.$store.state.notifications.getData(token).then(() => {
        this.notifications = this.$store.state.notifications.data;
        this.notifications_unseened = 0;
        this.notifications.forEach(noti => {
          this.notifications_unseened += noti.seened ? 0 : 1;
        });
        this.notifications = this.notifications.slice(0, 5);
      });
    },
  },

  created() {
    this.$store.state.profile.getData().then(() => {
      this.username = this.$store.state.profile.data.username;
    });
    this.$store.state.notifications.addUpdate('nav', this.loadData);
    this.$store.state.notifications.update();

    this.getHappiness();
  },
  mounted() {
    this.$root.$on('refresh_happiness', this.getHappiness);
  },
};
</script>
