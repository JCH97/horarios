<template>
  <div id='group'>
    <div class='row'>
      <div class='col-12'>
        <div class='card mb-4 w-100 border-bottom-primary'>
          <div class='card-header py-3 bg-white'>
            <h5 class='m-0 font-weight-bold text-primary'>Group: {{ group.fullName }}</h5>
            <!--            <h5 class='m-0 font-weight-bold text-primary'>Universidad: {{ this.universityName }}</h5>-->
            <!--            <h5 class='m-0 font-weight-bold text-primary'>Facultad: {{ this.facultyName }}</h5>-->

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
              <p class='card-text'>{{ group.fullName }}</p>
            </div>
          </div>
        </div>

        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Nombre Reducido </strong></h5>
              <p class='card-text'>{{ group.shortName }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class='row py-4'>
        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Prioridad </strong></h5>
              <p class='card-text'>{{ group.priority }}</p>
            </div>
          </div>
        </div>

        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Descripcion </strong></h5>
              <p class='card-text'>{{ group.description }}</p>
            </div>
          </div>
        </div>

        <div class='col-sm-6 py-4'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Anno </strong></h5>
              <p class='card-text'>{{ group.year }}</p>
            </div>
          </div>
        </div>


        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Color</strong></h5>
              <p class='card-text'>{{ group.color }}</p>
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
            <h5 class='modal-title' id='exampleModalLabel'>Editando {{ group.fullName }}</h5>
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
                    <input type='text' class='form-control' id='input-fullName' v-model='group.fullName'>
                  </div>
                  <div class='form-group'>
                    <label for='input-shortName' class='col-form-label'>Nombre:</label>
                    <input type='text' class='form-control' id='input-shortName' v-model='group.shortName'>
                  </div>
                  <div class='form-group'>
                    <label for='input-priority' class='col-form-label'>Prioridad:</label>
                    <input type='number' class='form-control' id='input-priority' v-model='group.priority' />
                  </div>
                </div>
                <div class='col-md-6'>
                  <div class='form-group'>
                    <label for='input-year' class='col-form-label'>Año:</label>
                    <input type='number' max='5' min='1' class='form-control' id='input-year' v-model='group.year'>
                  </div>
                </div>

                <div class='form-group'>
                  <label for='input-color' class='col-form-label'>Color:</label>
                  <input type='color' class='form-control' id='input-color' v-model='newGroup.color'>
                </div>

                <div class='form-group'>
                  <label for='input-description' class='col-form-label'>Descripcion:</label>
                  <textarea class='form-control' id='input-description' v-model='group.description'></textarea>
                </div>
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
  name: 'Group',
  data() {
    return {
      group: {
        id: '',
        fullName: '',
        shortName: '',
        description: '',
        priority: '',
        major: {},
        year: '',
        color: '',
      },
    };
  },

  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.group.getDetails(token, this.group.id).then(result => {
        if (result === true) {
          this.group = this.$store.state.group.data;
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

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;
      this.$store.state.group.edit(token, { ...this.group, major: null })
        .then(result => {
          if (result === true) {
            this.group = this.$store.state.group.data;
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
  },
  created() {
    this.group.id = this.$route.params.groupId;
    if (!this.group.id) {
      this.$router.push({ name: 'notFoundPage' });
    }
    this.loadData();
  },

};
</script>

<style scoped>

</style>