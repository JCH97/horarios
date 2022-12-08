<template>
  <div id='teachers'>
    <div class='row'>
      <div class='col-12'>
        <div class='card w-100 border-bottom-primary mb-1'>
          <div class='card-header py-2 bg-white'>
            <div class='row align-items-center'>
              <div class='col'>
                <h5 class='m-0 font-weight-bold text-primary'> Profesores ({{ department.shortName }} /
                  {{ department.faculty.shortName }})
                </h5>
              </div>
              <div class='col'>
                <form class='form-inline justify-content-end'>
                  <input type='text' v-model='text' class='form-control bg-light border-0 small'
                         placeholder='Buscar ...' aria-label='Search' aria-describedby='basic-addon2'>
                  <button class='btn ml-2' @click.prevent='setVal()'>
                    <i class='fas fa-sort-alpha-down'></i>
                  </button>
                  <button class='btn ml-2' @click.prevent='unsetVal()'>
                    <i class='fas fa-sort-alpha-up'></i>
                  </button>
                  <button class='btn ml-2' @click.prevent='addTeacher()'>
                    <i role='button' class='fas fa-plus'></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class='card'>
          <div class='card-body p-0'>
            <div class='list-group'>
              <button v-if="filterList(teachers, text, 'fullName').length === 0" type='button'
                      class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
              </button>
              <router-link v-for="teacher in filterList(teachers, text, 'fullName')" :key='teacher.email'
                           :to="{name: 'teacherPage', params: {teacherId: teacher.id}}"
                           class='list-group-item list-group-item-action'>{{ teacher.fullName }} ({{ teacher.email }})
                <div class='form-inline justify-content-end'>
                  <i v-if='!teacher.userId || teacher.userId === {} || teacher.userId.id === null' class='fas fa-link mx-3'
                     data-toggle='tooltip'
                     title='Enlazar con usuario'
                     @click.prevent='linkUserModal(teacher.id)'></i>
                  <i v-else class='fas fa-unlink mx-3' data-toggle='tooltip' title='Desenlazar usuario'
                     @click.prevent='unlinkUser(teacher.id)'></i>
                  <i class='fas fa-trash' @click.prevent='removeTeacher(teacher.id)'></i>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    Modal Create-->
    <div class='modal fade' id='modalCreate' tabindex='-1' role='dialog' aria-labelledby='modalCreate'
         aria-hidden='true' ref='modalEdit'>
      <div class='modal-dialog' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title' id='exampleModalLabel'>Nuevo Profesor</h5>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <form>
              <div class='row'>
                <div class='col-md-6'>
                  <div class='form-group'>
                    <label for='input-fullName' class='col-form-label'>Nombre completo:</label>
                    <input type='text'
                           :class="{'form-control': true, 'border-danger': errors & 1}"
                           id='input-fullName'
                           v-model='newTeacher.fullName'>
                  </div>
                  <div class='form-group'>
                    <label for='input-shortName' class='col-form-label'>Nombre Reducido:</label>
                    <input type='text'
                           :class="{'form-control': true, 'border-danger': errors & (1 << 1)}"
                           id='input-shortName'
                           v-model='newTeacher.shortName'>
                  </div>
                </div>
                <div class='col-md-6'>
                  <div class='form-group'>
                    <div class='form-group'>
                      <label for='input-priority' class='col-form-label'>Prioridad:</label>
                      <input type='number' class='form-control' id='input-priority' v-model='newTeacher.priority' />
                    </div>

                    <label for='input-description' class='col-form-label'>Correo:</label>
                    <input type='text'
                           :class="{'form-control': true, 'border-danger': errors & (1 << 2)}"
                           id='input-description'
                           v-model='newTeacher.email'>
                  </div>

                  <!--                  <div class='form-group'>-->
                  <!--                    <label class='col-form-label'> Elegir univerisidad:</label>-->
                  <!--                    <button class='btn btn-secondary btn-lg dropdown-toggle' type='button' id='input-select-university'-->
                  <!--                            data-toggle='dropdown'-->
                  <!--                            aria-haspopup='true' aria-expanded='false'-->
                  <!--                            style='width: 220px; height: 40px;'-->
                  <!--                    >-->
                  <!--                      {{ btnSelectUniversityText }}-->
                  <!--                    </button>-->

                  <!--                    <div class='dropdown-menu'>-->
                  <!--                      <a v-for='u in this.universities' :key='u.id' class='dropdown-item'-->
                  <!--                         @click.prevent='chooseUniversity(u.fullName)'>{{ u.fullName }}</a>-->
                  <!--                    </div>-->
                  <!--                  </div>-->

                  <!--                  <div class='form-group'>-->
                  <!--                    <label class='col-form-label'> Elegir facultad:</label>-->
                  <!--                    <button class='btn btn-secondary btn-lg dropdown-toggle' type='button' id='input-select-faculty'-->
                  <!--                            data-toggle='dropdown'-->
                  <!--                            aria-haspopup='true' aria-expanded='false'-->
                  <!--                            style='width: 220px; height: 40px;'-->
                  <!--                            :disabled='this.faculties.length === 0'-->
                  <!--                    >-->
                  <!--                      {{ btnSelectFacultyText }}-->
                  <!--                    </button>-->

                  <!--                    <div class='dropdown-menu'>-->
                  <!--                      <a v-for='u in this.faculties' :key='u.id' class='dropdown-item'-->
                  <!--                         @click.prevent='chooseFaculty(u.fullName)'>{{ u.fullName }}</a>-->
                  <!--                    </div>-->
                  <!--                  </div>-->

                </div>
              </div>

              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripción:</label>
                <textarea class='form-control' id='input-description' v-model='newTeacher.description'></textarea>
              </div>

            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' @click='saveTeacher()'>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--    Link with user-->
    <div class='modal fade' id='modalLinkUser' tabindex='-1' role='dialog' aria-labelledby='modalLinkUser'
         aria-hidden='true' ref='modalLinkUser'>
      <div class='modal-dialog' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title' id='exampleModalLabel'>Enlazar con usuario</h5>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <form>
              <div class='row px-3'>
                <label class='col-form-label mx-3'> Elegir usuario:</label>
                <br>
                <button class='btn btn-secondary btn-lg dropdown-toggle' type='button'
                        id='input-select-university'
                        data-toggle='dropdown'
                        aria-haspopup='true' aria-expanded='false'
                        style='width: 220px; height: 40px;'
                >
                  {{ btnSelectedUserText }}
                </button>

                <div class='dropdown-menu'>
                  <a style='cursor: pointer' v-for='u in this.users' :key='u.id' class='dropdown-item'
                     @click='btnSelectedUserText = u.username'>{{ u.username }} / {{ u.email }}</a>
                </div>
              </div>
            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' @click='linkUser()'>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Teachers',
  data() {
    return {
      btnSelectUniversityText: 'Elegir universidad',
      btnSelectFacultyText: 'Elegir facultad',
      btnSelectedUserText: 'Elegir usuario',
      text: '',
      val: 1,
      errors: 0,
      universities: [],
      faculties: [], // indica las facultades de la universidad elegida
      teachers: [],
      department: {},
      newTeacher: {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        email: '',
        facultyIds: [],
        departmentId: {},
      },
      users: [],
      teacherIdSelectedForLink: '',
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      const departmentId = this.$route.params.departmentId;

      this.$store.state.teachers.getAll(token, { departmentId })
        .then(result => {
          if (result === true) {
            this.teachers = this.$store.state.teachers.data;
          }
        });

      // this.$store.state.universities.getAll(token)
      //   .then(result => {
      //     if (result === true)
      //       this.universities = this.$store.state.universities.data;
      //   });

      this.$store.state.department.getDetails(token, departmentId)
        .then(result => {
          if (result === true) {
            this.department = this.$store.state.department.data;
          }
        });
    },

    filterList(list, box, prop) {
      let tmp = list.slice().sort(this.comparer(prop, this.val));
      return tmp.filter(elem => {
        return elem[prop].toString().toLowerCase().includes(box.toLowerCase());
      });
    },

    setVal() {
      this.val = 1;
    },

    unsetVal() {
      this.val = -1;
    },

    removeTeacher(teacherId) {

      const pass = confirm('Esta seguro que desea eliminar el profesor ?');

      if (!pass)
        return;

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.teachers.delete(token, teacherId).then(result => {
        if (result === true) {
          this.teachers = this.teachers.filter(x => x.id !== teacherId);
          this.teachers = this.teachers.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },

    addTeacher() {
      $('#modalCreate').modal('show');
    },

    checkErrors() {
      this.errors |= (this.newTeacher.fullName === '') ? 1 : this.errors;
      this.errors |= (this.newTeacher.shortName === '') ? (1 << 1) : this.errors;
      this.errors |= (this.newTeacher.email === '') ? (1 << 2) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },

    linkUserModal(teacherId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.users.getAll(token)
        .then(result => {
          if (result === true) {

            let alreadyLinkedUsers = this.teachers
              .filter(x => x.userId && x.userId.id)
              .map(t => t.userId.id);

            this.users = this.$store.state.users.data;

            this.users = this.users
              .filter(x => !alreadyLinkedUsers.includes(x.id));

            this.teacherIdSelectedForLink = teacherId;
            $('#modalLinkUser').modal('show');
          }
        });
    },

    linkUser() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      const possibleUser = this.users.find(x => x.username === this.btnSelectedUserText);

      this.$store.state.users.linkUser(token, {
        userId: possibleUser.id,
        teacherId: this.teacherIdSelectedForLink,
      })
        .then(result => {
          if (result === true) {
            $('#modalLinkUser').modal('hide');

            let t = this.teachers.find(x => x.id === this.teacherIdSelectedForLink);
            t.userId = { id: possibleUser.id };

          }
        });
    },

    unlinkUser(teacherId) {
      const pass = confirm('Esta seguro que desea desenlazar el usuario ?');

      if (!pass) return;

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.teachers.unlinkUser(token, {
        teacherId: teacherId,
      })
        .then(result => {
          if (result === true) {
            let t = this.teachers.find(x => x.id === teacherId);
            t.userId = { id: null };
          }
        });
    },

    saveTeacher() {
      if (this.checkErrors()) return;

      $('#modalCreate').modal('hide');

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.newTeacher.facultyIds.push({ id: this.department.facultyId.id });
      this.newTeacher.departmentId = { id: this.department.id };

      this.$store.state.teachers.create(token, this.newTeacher).then(result => {
        if (result === true) {
          this.teachers.push(this.$store.state.teachers.data);
          this.teachers = this.teachers.slice().sort((a, b) => b.shortName - a.shortName);

          this.restore();

        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },

    restore() {
      this.newTeacher = {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        email: '',
        facultyIds: [],
        departmentId: {},
      };
    },

    comparer(prop, val) {
      return function(a, b) {
        if (a[prop] > b[prop]) {
          return 1 * val;
        } else if (a[prop] < b[prop]) {
          return -1 * val;
        } else {
          return 0;
        }
      };
    },

    chooseUniversity(universityFullName) {
      const university = this.universities.find(x => x.fullName === universityFullName);

      this.btnSelectUniversityText = university.shortName;

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.faculties.getAll(token, { universityId: university.id })
        .then(result => {
          if (result === true) {
            this.faculties = this.$store.state.faculties.data;
            this.btnSelectFacultyText = 'Elegir facultad';
          }
        });

    },

    chooseFaculty(facultyFullName) {
      this.btnSelectFacultyText = (this.faculties.find(x => x.fullName === facultyFullName)).shortName;
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style scoped>

</style>
