<template>
  <div id='local'>
    <div class='row'>
      <div class='col-12'>
        <div class='card mb-4 w-100 border-bottom-primary'>
          <div class='card-header py-3 bg-white'>
            <h5 class='m-0 font-weight-bold text-primary'>Local: {{ local.fullName }}</h5>

            <div class='form-inline justify-content-end'>
              <button class='btn sm-2'>
                <i role='button' class='fas fa-edit' style='padding-right: 10px' @click.prevent='edit()'></i>
              </button>
              <!--              <router-link :to="{name: 'facultiesPage', params: { universityId: this.university.id }}" class='nav-link'>-->
              <!--                <span>Facultades</span>-->
              <!--                <i class='fas fa-fw fa-building'></i>-->
              <!--              </router-link>-->
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
              <p class='card-text'>{{ local.fullName }}</p>
            </div>
          </div>
        </div>

        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Nombre Reducido </strong></h5>
              <p class='card-text'>{{ local.shortName }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class='row py-4'>
        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Prioridad </strong></h5>
              <p class='card-text'>{{ local.priority }}</p>
            </div>
          </div>
        </div>

        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Descripcion </strong></h5>
              <p class='card-text'>{{ local.description }}</p>
            </div>
          </div>
        </div>
      </div>


      <div class='row py-4'>
        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Capacidad </strong></h5>
              <p class='card-text'>{{ local.capacity }}</p>
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
            <h5 class='modal-title' id='exampleModalLabel'>Editando {{ local.fullName }}</h5>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <form>

              <div class='row'>
                <div class='col col-md-6 form-group'>
                  <label for='input-fullName' class='col-form-label'>Nombre completo:</label>
                  <input type='text' class='form-control' id='input-fullName' v-model='local.fullName'>
                </div>
                <div class='form-group'>
                  <label for='input-shortName' class='col-form-label'>Nombre:</label>
                  <input type='text' class='form-control' id='input-shortName' v-model='local.shortName'>
                </div>
              </div>

              <div class='row'>
                <div class='col col-md-6 form-group'>
                  <label for='input-priority' class='col-form-label'>Prioridad:</label>
                  <input type='number' class='form-control' id='input-priority'
                         v-model='local.priority' />
                </div>
                <div class='col col-md-6 form-group'>
                  <label for='input-capacity' class='col-form-label'>Capacidad:</label>
                  <input type='number' class='form-control' id='input-capacity' v-model='local.capacity'></input>
                </div>
              </div>

              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='local.description'></textarea>
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
  name: 'Local',
  data() {
    return {
      local: {
        id: '',
        fullName: '',
        shortName: '',
        description: '',
        priority: '',
        capacity: '',
      },
      facultyId: '',
      local_events: '',
      val: 1,
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;
      this.$store.state.local.getData(token, this.local.id).then(result => {
        if (result === true) {
          this.local = this.$store.state.local.data;
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
      this.$store.state.local.edit(token, this.local)
        .then(result => {
          if (result === true) {
            this.local = this.$store.state.local.data;
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
    this.local.id = this.$route.params.localId;
    if (!this.local.id) {
      this.$router.push({ name: 'notFoundPage' });
    }
    this.loadData();
  },
};
</script>

<style scoped>

</style>