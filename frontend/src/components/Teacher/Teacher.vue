<template>
  <div id='teacher'>
    <div class='row'>
      <div class='col-12'>
        <div class='card mb-4 w-100 border-bottom-primary'>
          <div class='card-header py-3 bg-white'>
            <h5 class='m-0 font-weight-bold text-primary'>Profesor: {{ teacher.fullName }} ({{ this.department.shortName
              }} / {{ this.department.faculty.shortName }}) </h5>

            <div class='form-inline justify-content-end'>
              <button class='btn sm-2'>
                <i role='button' class='fas fa-edit' style='padding-right: 10px' @click.prevent='edit()'></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class='container overflow-hidden'>
      <div class='row py-4'>
        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Nombre Completo </strong></h5>
              <p class='card-text'>{{ teacher.fullName }}</p>
            </div>
          </div>
        </div>

        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Nombre Reducido </strong></h5>
              <p class='card-text'>{{ teacher.shortName }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class='row py-4'>
        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Prioridad </strong></h5>
              <p class='card-text'>{{ teacher.priority }}</p>
            </div>
          </div>
        </div>

        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Descripción </strong></h5>
              <p class='card-text'>{{ teacher.description }}</p>
            </div>
          </div>
        </div>

        <div class='col-sm-6 py-4'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Correo </strong></h5>
              <p class='card-text'>{{ teacher.email }}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
    <!--    Modal for Edit-->

    <div class='modal fade' id='modalEdit' tabindex='-1' role='dialog' aria-labelledby='modalEdit'
         aria-hidden='true' ref='modalEdit'>
      <div class='modal-dialog' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title' id='exampleModalLabel'>Editando {{ teacher.fullName }}</h5>
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
                    <input type='text' class='form-control' id='input-fullName' v-model='teacher.fullName'>
                  </div>
                  <div class='form-group'>
                    <label for='input-shortName' class='col-form-label'>Nombre:</label>
                    <input type='text' class='form-control' id='input-shortName' v-model='teacher.shortName'>
                  </div>
                  <div class='form-group'>
                    <label for='input-priority' class='col-form-label'>Prioridad:</label>
                    <input type='number' class='form-control' id='input-priority' v-model='teacher.priority' />
                  </div>
                </div>
                <div class='col-md-6'>
                  <div class='form-group'>
                    <label for='input-description' class='col-form-label'>Email:</label>
                    <input class='form-control' id='input-description' v-model='teacher.email'>
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
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='teacher.description'></textarea>
              </div>

            </form>
          </div>


          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' data-dismiss='modal' @click.prevent='saveEdited()'>
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
  name: 'Teacher',
  data() {
    return {
      teacher: {
        id: '',
        fullName: '',
        shortName: '',
        description: '',
        priority: '',
        email: '',
        faculties: [],
        departmentId: {},
      },
      faculties: [],
      universities: [],
      department: {},
      facultyName: '',
      universityName: '',
      btnSelectFacultyText: 'Elegir facultad',
      btnSelectUniversityText: 'Elegir universidad',
    };
  },

  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.teacher.getDetails(token, this.teacher.id).then(result => {
        if (result === true) {
          this.teacher = this.$store.state.teacher.data;
          // const faculty = this.teacher.faculties.length > 0
          //   ? this.teacher.faculties[0]
          //   : 'Elegir facultad';
          //
          // const university = this.teacher.faculties.length > 0
          //   ? this.teacher.faculties[0].university
          //   : 'Elegir universidad';
          //
          //
          // this.btnSelectFacultyText = faculty.shortName;
          // this.btnSelectUniversityText = university.shortName;
          //
          // this.facultyName = faculty.fullName;
          // this.universityName = university.fullName;
          //
          // const universityId = this.teacher.faculties[0].university.id;
          // this.getAllFaculties(universityId);
          // this.getAllUniversities();

          this.$store.state.department.getDetails(token, this.teacher.departmentId.id)
            .then(result => {
              if (result === true) {
                this.department = this.$store.state.department.data;
              }
            });

        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    filterList(list, box, prop, val) {
      let tmp = list.slice().sort(this.comparer(prop, val));
      return tmp.filter(elem => {
        return elem[prop].toString().toLowerCase().includes(box.toLowerCase());
      });
    },
    edit() {
      $('#modalEdit').modal('show');
    },
    saveEdited() {

      const faculty = (this
        .faculties
        .find(x => x.shortName === this.btnSelectFacultyText));

      if (faculty)
        this.teacher.facultyIds = [{ id: faculty.id }];

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;
      this.$store.state.teacher.edit(token, this.teacher)
        .then(result => {
          if (result === true) {
            this.teacher = this.$store.state.teacher.data;

            this.facultyName = faculty.fullName;
            this.universityName = (this
              .universities
              .find(x => x.id === faculty.universityId)).fullName;

          } else {
            this.$router.push({ name: 'notFoundPage' });
          }
        });
    },
    setVal(number) {
      if (number == 1) {
        this.user_val = 1;
      } else {
        this.event_val = 1;
      }
    },
    unsetVal(number) {
      if (number == 1) {
        this.user_val = -1;
      } else {
        this.event_val = -1;
      }
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

      this.getAllFaculties(university.id);

      this.btnSelectFacultyText = 'Elegir facultad';

    },
    chooseFaculty(facultyFullName) {
      this.btnSelectFacultyText = (this.faculties.find(x => x.fullName === facultyFullName)).shortName;
    },
    getAllUniversities() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.universities.getAll(token)
        .then(result => {
          if (result === true)
            this.universities = this.$store.state.universities.data;
        });
    },
    getAllFaculties(universityId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.faculties.getAll(token, { universityId: universityId })
        .then(result => {
          if (result === true) {
            this.faculties = this.$store.state.faculties.data;
          }
        });
    },
  },

  created() {
    this.teacher.id = this.$route.params.teacherId;
    if (!this.teacher.id) {
      this.$router.push({ name: 'notFoundPage' });
    }
    this.loadData();
  },

};
</script>

<style scoped>

</style>