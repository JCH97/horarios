<template>
  <div id='locals'>
    <div class='row'>
      <div class='col-12'>
        <div class='card w-100 border-bottom-primary mb-1'>
          <div class='card-header py-2 bg-white'>
            <div class='row align-items-center'>
              <div class='col'>
                <h5 class='m-0 font-weight-bold text-primary'>Locales
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
                  <button class='btn ml-2' @click.prevent='addLocal()'>
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
              <button v-if="filterList(locals, text, 'fullName').length === 0" type='button'
                      class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
              </button>
              <router-link v-for="l in filterList(locals, text, 'fullName')" :key='l.id'
                           :to="{name: 'localPage', params: {localId: l.id}}"
                           class='list-group-item list-group-item-action'>{{ l.fullName }}
                ({{ faculty.university.shortName }} / {{ faculty.shortName }})
                <div class='form-inline justify-content-end'>
                  <i class='fas fa-trash' @click.prevent='removeLocal(l.id)'></i>
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
            <h5 class='modal-title' id='exampleModalLabel'>Nueva Local</h5>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <form>

              <div class='row'>
                <div class='col col-md-6 form-group'>
                  <label for='input-fullName' class='col-form-label'>Nombre completo:</label>
                  <input type='text'
                         :class="{'form-control': true, 'border-danger': errors & 1}"
                         id='input-fullName'
                         v-model='newLocal.fullName'>
                </div>
                <div class='col col-md-6 form-group'>
                  <label for='input-shortName' class='col-form-label'>Nombre Reducido:</label>
                  <input type='text'
                         :class="{'form-control': true, 'border-danger': errors & (1 << 1)}"
                         id='input-shortName'
                         v-model='newLocal.shortName'>
                </div>
              </div>

              <div class='row'>
                <div class='col col-md-6 form-group'>
                  <label for='input-priority' class='col-form-label'>Prioridad:</label>
                  <input type='number' class='form-control' id='input-priority' v-model='newLocal.priority' />
                </div>
                <div class='col col-md-6 form-group'>
                  <label for='input-capacity' class='col-form-label'>Capacidad:</label>
                  <input class='form-control' type='number' id='input-capacity' v-model='newLocal.capacity'></input>
                </div>
              </div>

              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='newLocal.description'></textarea>
              </div>
            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' @click='saveLocal()'>
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
  name: 'Locals',
  data() {
    return {
      locals: [],
      text: '',
      val: 1,
      facultyId: '',
      faculty: {},
      errors: 0,
      newLocal: {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        facultyId: '',
        capacity: '',
      },
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.facultyId = this.$route.params.facultyId;

      this.$store.state.faculty.getDetails(token, this.facultyId).then(result => {
        if (result === true) {

          this.faculty = this.$store.state.faculty.data;

        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });

      this.$store.state.locals.getData(token).then(result => {
        if (result === true) {
          this.locals = this.$store.state.locals.data;
          this.locals = this.locals.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
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
    restore() {
      this.newLocal = {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        facultyId: '',
        capacity: '',
      };
    },
    removeLocal(localId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.locals.delete(token, localId).then(result => {
        if (result === true) {
          this.locals = this.locals.filter(u => u.id !== localId);
          this.locals = this.locals.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    addLocal() {
      $('#modalCreate').modal('show');
    },
    checkErrors() {
      this.errors |= (this.newLocal.fullName === '') ? 1 : this.errors;
      this.errors |= (this.newLocal.shortName === '') ? (1 << 1) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },
    saveLocal() {
      if (this.checkErrors()) return;

      $('#modalCreate').modal('hide');

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.newLocal.facultyId = this.facultyId;

      this.$store.state.locals.create(token, this.newLocal).then(result => {

        if (result === true) {
          this.locals.push(this.$store.state.locals.data);
          this.locals = this.locals.slice().sort((a, b) => b.shortName - a.shortName);

          this.restore();

        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
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
    this.loadData();
  },
};
</script>

<style scoped>

</style>