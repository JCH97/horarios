<template>
  <div id='choose'>
    <div role='document'>
      <div class='modal-header'>
        <h5 class='modal-title' id='exampleModalLabel'>
          Elija la carrera
        </h5>
      </div>

      <div class='modal-body'>
        <form class='card-body'>
          <div>
            <div class='form-group row'>

              <div class='col col-md-6'>
                <h4> Elegir univerisidad:</h4>
              </div>
              <br>

              <div class='col col-md-6'>
                <button class='btn btn-secondary btn-lg dropdown-toggle bg-white' type='button'
                        id='input-select-university'
                        data-toggle='dropdown'
                        aria-haspopup='true' aria-expanded='false'
                        style='width: 220px; height: 40px; color: black'
                >
                  {{ btnSelectUniversityText }}
                </button>

                <div class='dropdown-menu'>
                  <a style='cursor: pointer' v-for='u in this.universities' :key='u.id' class='dropdown-item'
                     @click.prevent='chooseUniversity(u.fullName)'>
                    {{ u.fullName }}
                  </a>
                </div>
              </div>
            </div>

            <div v-if='universityName != "" ' class='form-group row'>

              <div class='col col-md-6'>
                <h4> Elegir facultad:</h4>
              </div>

              <br>

              <div class='col col-md-6'>
                <button class='btn btn-secondary btn-lg dropdown-toggle bg-white' type='button'
                        id='input-select-faculty'
                        data-toggle='dropdown'
                        aria-haspopup='true' aria-expanded='false'
                        style='width: 220px; height: 40px; color: black;'
                        :disabled='this.faculties.length === 0'
                >
                  {{ btnSelectFacultyText }}
                </button>

                <div class='dropdown-menu'>
                  <a style='cursor: pointer;' v-for='u in this.faculties' :key='u.id' class='dropdown-item'
                     @click.prevent='chooseFaculty(u.fullName)'>{{ u.fullName }}</a>
                </div>
              </div>
            </div>
          </div>


          <div v-if='facultyName != "" ' class='form-group row'>

            <div class='col col-md-6'>
              <h4> Elegir departamento:</h4>
            </div>

            <br>

            <div class='col col-md-6'>
              <button class='btn btn-secondary btn-lg dropdown-toggle bg-white' type='button'
                      id='input-select-faculty'
                      data-toggle='dropdown'
                      aria-haspopup='true' aria-expanded='false'
                      style='width: 220px; height: 40px; color: black;'
                      :disabled='this.departments.length === 0'
              >
                {{ btnSelectedDepartmentText }}
              </button>

              <div class='dropdown-menu'>
                <button style='cursor: pointer;' v-for='u in this.departments' :key='u.id' class='dropdown-item'
                        @click.prevent='chooseDepartment(u.id)'>{{ u.fullName }}
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
      <div class='modal-footer'>
        <div class='modal-footer'>
          <button type='button' class='btn btn-secondary' data-dismiss='modal' @click.prevent='cancel()'>
            Cancelar
          </button>
          <button type='button' :disabled='departmentName === ""' class='btn btn-primary' data-dismiss='modal'
                  @click.prevent='selectionOk()'>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChooseTeacher',
  data() {
    return {
      faculties: [],
      universities: [],
      departments: [],
      facultyName: '',
      universityName: '',
      departmentName: '',
      btnSelectFacultyText: 'Elegir facultad',
      btnSelectUniversityText: 'Elegir universidad',
      btnSelectedDepartmentText: 'Elegir departamento',
    };
  },
  methods: {
    selectionOk() {
      const department = this.departments.find(x => x.fullName === this.departmentName);
      this.$router.push({ name: 'teachersPage', params: { departmentId: department.id } });
    },
    cancel() {
      this.$router.push({ name: 'homePage' });
    },
    chooseUniversity(universityId) {
      const university = this.universities.find(x => x.id == universityId);

      this.btnSelectUniversityText = university.shortName;
      this.getAllFaculties(university.id);

      this.btnSelectFacultyText = 'Elegir facultad';
      this.universityName = university.fullName;
      this.facultyName = '';

    },
    chooseFaculty(facultyId) {
      const faculty = this.faculties.find(x => x.id == facultyId);

      this.btnSelectFacultyText = faculty.shortName;
      this.facultyName = faculty.fullName;

      this.getAllDepartments(facultyId);

      this.departmentName = '';
      this.btnSelectedDepartmentText = 'Elegir departamento';
    },
    chooseDepartment(departmentId) {
      const department = (this.departments.find(x => x.id === departmentId));
      this.btnSelectedDepartmentText = department.shortName;

      this.departmentName = department.fullName;
    },
    getAllUniversities() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.universities.getAll(token)
        .then(result => {
          if (result === true) {
            this.universities = this.$store.state.universities.data;

            if (this.universities.length === 1)
              this.chooseUniversity(this.universities[0].id);

          }
        });

    },
    getAllFaculties(universityId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.faculties.getAll(token, { universityId: universityId })
        .then(result => {
          if (result === true) {
            this.faculties = this.$store.state.faculties.data;

            if (this.faculties.length === 1)
              this.chooseFaculty(this.faculties[0].id);

          }
        });
    },
    getAllDepartments(facultyId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.departments.getAll(token, { facultyId })
        .then(result => {
          if (result === true) {
            this.departments = this.$store.state.departments.data;

            if (this.departments.length === 1)
              this.chooseDepartment(this.departments[0].id);

          }
        });
    },
  },
  created() {
    this.getAllUniversities();
  },
};
</script>

<style scoped>

</style>