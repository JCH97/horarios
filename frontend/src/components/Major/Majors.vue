<template>
  <div id='universities'>
    <div class='row'>
      <div class='col-12'>
        <div class='card w-100 border-bottom-primary mb-1'>
          <div class='card-header py-2 bg-white'>
            <div class='row align-items-center'>
              <div class='col'>
                <h5 class='m-0 font-weight-bold text-primary'>Carreras
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
                  <button class='btn ml-2' @click.prevent='addMajor()'>
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
              <button v-if="filterList(majors, text, 'fullName').length === 0" type='button'
                      class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
              </button>
              <router-link v-for="m in filterList(majors, text, 'fullName')" :key='m.id'
                           :to="{name: 'majorPage', params: {majorId: m.id}}"
                           class='list-group-item list-group-item-action'>{{ m.fullName }} ({{ m.shortName }})
                <div class='form-inline justify-content-end'>
                  <i class='fas fa-trash' @click.prevent='removeMajor(m.id)'></i>
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
            <h5 class='modal-title' id='exampleModalLabel'>Nueva Carrera</h5>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <form>
              <div class='form-group'>
                <label for='input-fullName' class='col-form-label'>Nombre completo:</label>
                <input type='text'
                       :class="{'form-control': true, 'border-danger': errors & 1}"
                       id='input-fullName'
                       v-model='newMajor.fullName'>
              </div>
              <div class='form-group'>
                <label for='input-shortName' class='col-form-label'>Nombre Reducido: </label>
                <input type='text'
                       :class="{'form-control': true, 'border-danger': errors & (1 << 1)}"
                       id='input-shortName'
                       v-model='newMajor.shortName'>
              </div>
              <div class='form-group'>
                <label for='input-priority' class='col-form-label'>Prioridad:</label>
                <input type='number' class='form-control' id='input-priority' v-model='newMajor.priority' />
              </div>
              <div class='form-group'>
                <label for='input-duration' class='col-form-label'>Extension (annos):</label>
                <input type='number'
                       :class="{'form-control': true, 'border-danger': errors & (1 << 2)}"
                       id='input-duration'
                       v-model='newMajor.duration' />
              </div>
              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='newMajor.description'></textarea>
              </div>
            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' @click='saveMajor()'>
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
  name: 'Majors',
  data() {
    return {
      majors: [],
      text: '',
      val: 1,
      facultyId: '',
      errors: 0,
      newMajor: {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        duration: '',
        facultyId: '',
      },
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.facultyId = this.$route.params.facultyId;

      this.$store.state.majors.getData(token, 1, 10, { facultyId: this.facultyId }).then(result => {
        if (result === true) {
          this.majors = this.$store.state.majors.data;
          this.majors = this.majors.slice().sort((a, b) => b.shortName - a.shortName);
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
    removeMajor(majorId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.majors.delete(token, majorId).then(result => {
        if (result === true) {
          this.majors = this.majors.filter(u => u.id !== majorId);
          this.majors = this.majors.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    addMajor() {
      $('#modalCreate').modal('show');
    },
    checkErrors() {
      this.errors |= (this.newMajor.fullName === '') ? 1 : this.errors;
      this.errors |= (this.newMajor.shortName === '') ? (1 << 1) : this.errors;
      this.errors |= (this.newMajor.duration === '') ? (1 << 2) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },
    saveMajor() {
      if (this.checkErrors()) return;

      $('#modalCreate').modal('hide');

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.newMajor.facultyId = this.facultyId;

      this.$store.state.majors.create(token, this.newMajor).then(result => {

        if (result === true) {
          this.majors.push(this.$store.state.majors.data);
          this.majors = this.majors.slice().sort((a, b) => b.shortName - a.shortName);
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