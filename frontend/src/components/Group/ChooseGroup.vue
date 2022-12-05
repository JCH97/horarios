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
              <h4> Elegir carrera:</h4>
            </div>

            <br>

            <div class='col col-md-6'>
              <button class='btn btn-secondary btn-lg dropdown-toggle bg-white' type='button'
                      id='input-select-faculty'
                      data-toggle='dropdown'
                      aria-haspopup='true' aria-expanded='false'
                      style='width: 220px; height: 40px; color: black;'
                      :disabled='this.majors.length === 0'
              >
                {{ btnSelectedMajorText }}
              </button>

              <div class='dropdown-menu'>
                <button style='cursor: pointer;' v-for='u in this.majors' :key='u.id' class='dropdown-item'
                        @click.prevent='chooseMajor(u.fullName)'>{{ u.fullName }}
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
          <button type='button' :disabled='majorName === ""' class='btn btn-primary' data-dismiss='modal'
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
  name: 'ChooseGroup',
  data() {
    return {
      faculties: [],
      universities: [],
      majors: [],
      facultyName: '',
      universityName: '',
      majorName: '',
      btnSelectFacultyText: 'Elegir facultad',
      btnSelectUniversityText: 'Elegir universidad',
      btnSelectedMajorText: 'Elegir carrera',
    };
  },
  methods: {
    selectionOk() {
      const major = this.majors.find(x => x.fullName === this.majorName);

      console.log(major.id);

      this.$router.push({ name: 'groupsPage', params: { majorId: major.id } });
    },
    cancel() {
      this.$router.push({ name: 'homePage' });
    },
    chooseUniversity(universityFullName) {
      const university = this.universities.find(x => x.fullName === universityFullName);

      this.btnSelectUniversityText = university.shortName;
      this.getAllFaculties(university.id);

      this.btnSelectFacultyText = 'Elegir facultad';
      this.universityName = universityFullName;
      this.facultyName = '';

    },
    chooseFaculty(facultyFullName) {
      const faculty = this.faculties.find(x => x.fullName === facultyFullName);

      this.btnSelectFacultyText = faculty.shortName;
      this.facultyName = facultyFullName;

      this.getAllMajors(faculty.id);

      this.majorName = '';
      this.btnSelectedMajorText = 'Elegir carrera';
    },
    chooseMajor(majorFullName) {
      this.btnSelectedMajorText = (this.majors.find(x => x.fullName === majorFullName)).shortName;

      this.majorName = majorFullName;
    },
    getAllUniversities() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.universities.getAll(token)
        .then(result => {
          if (result === true) {
            this.universities = this.$store.state.universities.data;

            if (this.universities.length === 1)
              this.chooseUniversity(this.universities[0].fullName);
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
              this.chooseFaculty(this.faculties[0].fullName);
          }
        });
    },
    getAllMajors(facultyId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.majors.getAll(token, { facultyId })
        .then(result => {
          if (result === true) {
            this.majors = this.$store.state.majors.data;

            if (this.majors.length === 1)
              this.chooseMajor(this.majors[0].fullName);

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