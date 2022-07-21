<template>
  <div id='semesters'>
    <div class='row'>
      <div class='col-12'>
        <div class='card w-100 border-bottom-primary mb-1'>
          <div class='card-header py-2 bg-white'>
            <div class='row align-items-center'>
              <div class='col'>
                <h5 class='m-0 font-weight-bold text-primary'> Semestres
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
                  <button class='btn ml-2' @click.prevent='addSemester()'>
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
              <button v-if="filterList(semesters, text, 'id').length === 0" type='button'
                      class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
              </button>
              <router-link v-for="sem in filterList(semesters, text, 'id')" :key='sem.id'
                           :to="{name: 'semesterPage', params: {semesterId: sem.id}}"
                           class='list-group-item list-group-item-action'>
                {{ sem.fullName }}
                ({{ sem.shortName }}) =>
                <strong>{{ formatDate(sem.start) }} / {{ formatDate(sem.end) }} </strong>
                <div class='form-inline justify-content-end'>
                  <i class='fas fa-trash' @click.prevent='removeSemester(sem.id)'></i>
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
            <h5 class='modal-title' id='exampleModalLabel'>Nuevo Semester</h5>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <form>
              <div class='form-group'>
                <label for='input-fullName' class='col-form-label'>Nombre completo:</label>
                <input type='text' class='form-control' id='input-fullName' v-model='newSemester.fullName'>
              </div>
              <div class='form-group'>
                <label for='input-shortName' class='col-form-label'>Nombre:</label>
                <input type='text' class='form-control' id='input-shortName' v-model='newSemester.shortName'>
              </div>
              <div class='form-group'>
                <label for='input-priority' class='col-form-label'>Prioridad:</label>
                <input type='number' class='form-control' id='input-priority' v-model='newSemester.priority' />
              </div>
              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='newSemester.description'></textarea>
              </div>
              <div class='form-group'>
                <label for='input-start' class='col-form-label'>Inicio:</label>
                <input type='date' class='form-control' id='input-start' v-model='newSemester.start'>
              </div>
              <div class='form-group'>
                <label for='input-end' class='col-form-label'>Fin:</label>
                <input type='date' class='form-control' id='input-end' v-model='newSemester.end'>
              </div>
            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' data-dismiss='modal' @click='saveSemester()'>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as moment from 'moment';

export default {
  name: 'Semesters',
  data() {
    return {
      semesters: [],
      text: '',
      val: 1,
      newSemester: {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        duration: '',
        start: undefined,
        end: undefined,
      },
    };
  },
  methods: {
    formatDate(date) {
      return moment(date).format('ll');
    },
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.semesters.getData(token, {})
        .then(result => {
          if (result === true) {
            this.semesters = this.$store.state.semesters.data;
            this.semesters = this.semesters.slice().sort((a, b) => b.shortName - a.shortName);
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
    removeSemester(semesterId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.semesters.delete(token, semesterId).then(result => {
        if (result === true) {
          this.semesters = this.semesters.filter(u => u.id != semesterId);
          this.semesters = this.semesters.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    addSemester() {
      $('#modalCreate').modal('show');
    },
    saveSemester() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.newSemester.duration = moment(this.newSemester.end).diff(moment(this.newSemester.start), 'days');
      this.newSemester.start = new Date(this.newSemester.start);
      this.newSemester.end = new Date(this.newSemester.end);

      this.$store.state.semesters.create(token, this.newSemester).then(result => {
        if (result === true) {
          this.semesters.push(this.$store.state.semesters.data);
          this.semesters = this.semesters.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });

      for (let member in this.newSemester)
        delete this.newSemester[member];

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
