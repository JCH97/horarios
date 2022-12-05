<template>
  <div id='faculties'>
    <div class='row'>
      <div class='col-12'>
        <div class='card w-100 border-bottom-primary mb-1'>
          <div class='card-header py-2 bg-white'>
            <div class='row align-items-center'>
              <div class='col'>
                <h5 class='m-0 font-weight-bold text-primary'> Facultades de {{ university.fullName }}
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
                  <button class='btn ml-2' @click.prevent='addFaculty()'>
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
              <button v-if="filterList(faculties, text, 'fullName').length === 0" type='button'
                      class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
              </button>
              <router-link v-for="fac in filterList(faculties, text, 'fullName')" :key='fac.id'
                           :to="{name: 'facultyPage', params: {facultyId: fac.id}}"
                           class='list-group-item list-group-item-action'>{{ fac.fullName }} ({{ fac.shortName }})
                <div class='form-inline justify-content-end'>
                  <i class='fas fa-trash' @click.prevent='removeFaculty(fac.id)'></i>
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
            <h5 class='modal-title' id='exampleModalLabel'>Nueva Facultad</h5>
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
                       v-model='newFaculty.fullName'>
              </div>
              <div class='form-group'>
                <label for='input-shortName' class='col-form-label'>Nombre:</label>
                <input type='text'
                       class='form-control'
                       :class="{'form-control': true, 'border-danger': errors & (1 << 1)}"
                       id='input-shortName'
                       v-model='newFaculty.shortName'>
              </div>
              <div class='form-group'>
                <label for='input-priority' class='col-form-label'>Prioridad:</label>
                <input type='number' class='form-control' id='input-priority' v-model='newFaculty.priority' />
              </div>
              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='newFaculty.description'></textarea>
              </div>
            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' @click='saveFaculty()'>
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
  name: 'Faculties',
  data() {
    return {
      university: {
        id: '',
        fullName: '',
        shortName: '',
      },
      faculties: [],
      text: '',
      val: 1,
      newFaculty: {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        universityId: '',
      },
      errors: 0,
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.university.getData(token, this.university.id)
        .then(result => {
          if (result === true) {
            this.university = this.$store.state.university.data;
          }
        });

      this.$store.state.faculties.getData(token, { universityId: this.university.id })
        .then(result => {
          if (result === true) {
            this.faculties = this.$store.state.faculties.data;
            this.faculties = this.faculties.slice().sort((a, b) => b.shortName - a.shortName);
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
    removeFaculty(facultyId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.faculties.delete(token, facultyId).then(result => {
        if (result === true) {
          this.faculties = this.faculties.filter(u => u.id != facultyId);
          this.faculties = this.faculties.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    addFaculty() {
      $('#modalCreate').modal('show');
    },
    checkErrors() {
      this.errors |= (this.newFaculty.fullName === '') ? 1 : this.errors;
      this.errors |= (this.newFaculty.shortName === '') ? (1 << 1) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },
    saveFaculty() {
      if (this.checkErrors()) return;

      $('#modalCreate').modal('hide');

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.newFaculty.universityId = this.university.id;

      this.$store.state.faculties.create(token, this.newFaculty).then(result => {
        if (result === true) {
          this.faculties.push(this.$store.state.faculties.data);
          this.faculties = this.faculties.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });

      for (let member in this.newFaculty)
        delete this.newFaculty[member];

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
    const universityId = this.$route.params.universityId;
    if (!universityId)
      this.$router.push({ name: 'notFoundPage' });

    this.university.id = universityId;
    this.loadData();
  },
};
</script>

<style scoped>

</style>