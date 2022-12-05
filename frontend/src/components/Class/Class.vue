<template>
  <div id='add_class'>
    <div class='row'>
      <div class='col-12'>
        <div class='card mb-4 w-100 border-bottom-primary'>
          <div class='card-header py-3 bg-white'>
            <h5 class='m-0 font-weight-bold text-primary'>
              Elija la universidad
            </h5>
            <h6 v-if="universityName != '' ">
              {{ universityName }}
            </h6>

            <div class='form-inline justify-content-end'>
              <button class='btn sm-2'>
                <i role='button' class='fas fa-check' style='padding-right: 10px'></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <form>
      <div class=' row'>
        <div class='form-group col col-md-4'>
          <label class='col-form-label'> Elegir univerisidad:</label>
          <br>
          <button class='btn btn-secondary btn-lg dropdown-toggle' type='button'
                  id='input-select-university'
                  data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='false'
                  style='width: 220px; height: 40px;'
          >
            {{ btnSelectUniversityText }}
          </button>

          <div class='dropdown-menu'>
            <a v-for='u in this.universities' :key='u.id' class='dropdown-item'
               @click.prevent='chooseUniversity(u.fullName)'>{{ u.fullName }}</a>
          </div>
        </div>
      </div>
    </form>


    <div class='modal-footer'>
      <button type='button' class='btn btn-secondary' data-dismiss='modal' @click.prevent='cancel()'>
        Cancelar
      </button>
      <button type='button' class='btn btn-primary' data-dismiss='modal' @click.prevent='selectionOk()'>
        Siguiente
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChooseFaculty',
  data() {
    return {
      universities: [],
      universityName: '',
      btnSelectUniversityText: 'Elegir universidad',
    };
  },
  methods: {
    selectionOk() {
      const university = this.universities.find(x => x.fullName === this.universityName);
      this.$router.push({
        name: 'facultiesPage', params:
          { universityId: university.id },
      });
    },
    cancel() {
      this.$router.push({ name: 'homePage' });
    },
    chooseUniversity(universityFullName) {
      const university = this.universities.find(x => x.fullName === universityFullName);
      this.btnSelectUniversityText = university.shortName;
      this.universityName = university.fullName;
    },
    getAllUniversities() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.universities.getAll(token)
        .then(result => {
          if (result === true) {
            this.universities = this.$store.state.universities.data;
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
