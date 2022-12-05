<template>
  <div id='choose'>
    <div role='document'>
      <div class='modal-header'>
        <h5 class='modal-title' id='exampleModalLabel'>
          Elija la universidad
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
          </div>
        </form>
      </div>
      <div class='modal-footer'>
        <button type='button' class='btn btn-secondary' data-dismiss='modal' @click.prevent='cancel()'>
          Cancelar
        </button>
        <button type='button' :disabled='universityName === ""' class='btn btn-primary' data-dismiss='modal'
                @click.prevent='selectionOk()'>
          Siguiente
        </button>
      </div>
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

            if (this.universities.length == 1)
              this.chooseUniversity(this.universities[0].fullName);

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