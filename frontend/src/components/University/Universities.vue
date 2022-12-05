<template>
  <div id='universities'>
    <div class='row'>
      <div class='col-12'>
        <div class='card w-100 border-bottom-primary mb-1'>
          <div class='card-header py-2 bg-white'>
            <div class='row align-items-center'>
              <div class='col'>
                <h5 class='m-0 font-weight-bold text-primary'>Universidades
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
                  <button class='btn ml-2' @click.prevent='addUniversity()'>
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
              <button v-if="filterList(universities, text, 'fullName').length === 0" type='button'
                      class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
              </button>
              <router-link v-for="uni in filterList(universities, text, 'fullName')" :key='uni.id'
                           :to="{name: 'universityPage', params: {universityId: uni.id}}"
                           class='list-group-item list-group-item-action'>{{ uni.fullName }} ({{ uni.shortName }})
                <div class='form-inline justify-content-end'>
                  <i class='fas fa-trash' @click.prevent='removeUniversity(uni.id)'></i>
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
            <h5 class='modal-title' id='exampleModalLabel'>Nueva Univesidad</h5>
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
                       v-model='newUniversity.fullName'>
              </div>
              <div class='form-group'>
                <label for='input-shortName' class='col-form-label'>Nombre Reducido:</label>
                <input type='text'
                       :class="{'form-control': true, 'border-danger': errors & (1 << 1)}"
                       id='input-shortName'
                       v-model='newUniversity.shortName'>
              </div>
              <div class='form-group'>
                <label for='input-priority' class='col-form-label'>Prioridad:</label>
                <input type='number' class='form-control' id='input-priority' v-model='newUniversity.priority' />
              </div>
              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='newUniversity.description'></textarea>
              </div>
            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' @click='saveUniversity()'>
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
  name: 'Universities',
  data() {
    return {
      universities: [],
      text: '',
      val: 1,
      errors: 0,
      newUniversity: {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
      },
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;
      this.$store.state.universities.getData(token).then(result => {
        if (result === true) {
          this.universities = this.$store.state.universities.data;
          this.universities = this.universities.slice().sort((a, b) => b.shortName - a.shortName);
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
    removeUniversity(universityId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.universities.delete(token, universityId).then(result => {
        if (result === true) {
          this.universities = this.universities.filter(u => u.id !== universityId);
          this.universities = this.universities.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    addUniversity() {
      $('#modalCreate').modal('show');
    },
    checkErrors() {
      this.errors |= (this.newUniversity.fullName === '') ? 1 : this.errors;
      this.errors |= (this.newUniversity.shortName === '') ? (1 << 1) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },
    saveUniversity() {
      if (this.checkErrors()) return;
      $('#modalCreate').modal('hide')

      ;
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.universities.create(token, this.newUniversity).then(result => {
        if (result === true) {
          this.universities.push(this.$store.state.universities.data);
          this.universities = this.universities.slice().sort((a, b) => b.shortName - a.shortName);
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