<template>
  <div id='lessons'>
    <div class='row'>
      <div class='col-12'>
        <div class='card w-100 border-bottom-primary mb-1'>
          <div class='card-header py-2 bg-white'>
            <div class='row align-items-center'>
              <div class='col'>
                <h5 class='m-0 font-weight-bold text-primary'>Asignaturas ({{ major.fullName }})</h5>
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
                  <button class='btn ml-2' @click.prevent='addLesson()'>
                    <i role='button' class='fas fa-plus'></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class='card'>
          <div class='card-body p-0'>
            <div class='list-lesson'>
              <button v-if="filterList(lessons, text, 'fullName').length === 0" type='button'
                      class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
              </button>
              <router-link v-for="lesson in filterList(lessons, text, 'fullName')" :key='lesson.id'
                           :to="{name: 'lessonPage', params: {lessonId: lesson.id}}"
                           class='list-group-item list-group-item-action'>
                {{ lesson.fullName }} (Año: {{ lesson.year }})
                <div class='form-inline justify-content-end'>
                  <i class='fas fa-trash' @click.prevent='removeLesson(lesson.id)'></i>
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
            <h5 class='modal-title' id='exampleModalLabel'>Nueva Asignatura</h5>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <form>
              <div class='row'>

                <div class='col-md-6'>

                  <div class='form-lesson'>
                    <label for='input-fullName' class='col-form-label'>Nombre completo:</label>
                    <input type='text'
                           id='input-fullName'
                           :class="{'form-control': true, 'border-danger': errors & 1}"
                           v-model='newLesson.fullName'>
                  </div>

                  <div class='form-lesson'>
                    <label for='input-shortName' class='col-form-label'>Nombre reducido:</label>
                    <input type='text'
                           :class="{'form-control': true, 'border-danger': errors & (1 << 1)}"
                           id='input-shortName'
                           v-model='newLesson.shortName'>
                  </div>

                </div>

                <div class='col-md-6'>
                  <div class='form-lesson'>
                    <label for='input-description' class='col-form-label'>Año:</label>
                    <input
                      :class="{'form-control': true, 'border-danger': errors & (1 << 2)}"
                      id='input-description'
                      v-model='newLesson.year'>
                  </div>


                  <div class='form-lesson'>
                    <label for='input-priority' class='col-form-label'>Prioridad:</label>
                    <input type='number' class='form-control' id='input-priority' v-model='newLesson.priority' />
                  </div>

                </div>

              </div>

              <div class='row py-3 mx-0'>
                <div>
                  <div style='margin-left: 5px; margin-top: 10px' class='form-group dropdown mb-0'>
                    <button :style='[selectedSemester.id ? {"color": "green"} : {}]'
                            :class="{'btn': true, 'btn-light': true, 'dropdown-toggle': true, 'border-danger': errors & (1 << 4)}"
                            type='button' id='teacher_drop_down'
                            data-toggle='dropdown'
                            aria-haspopup='true' aria-expanded='true'>
                      {{ !selectedSemester.shortName ? 'Elegir Semestre' : selectedSemester.shortName }}
                    </button>

                    <div class='dropdown-menu animated--fade-in ' aria-labelledby='dropdownMenuButton'
                         x-placement='bottom-start'
                         style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>
                      <div class='input-group m-2 ' v-for='it in this.semesters' :key='it.id'>
                        <div class='input-group-text bg-white'>
                          <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.selected'>
                          <span class='ml-2' id='basic7-addon3'>{{ it.shortName }}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              <div>
                <label :class="{'border-danger': errors & (1 << 3)}"> Elegir Profesor</label>
                <div :class="{'border-danger': errors & (1 << 3)}">
                  <infinite-scroll ref='infiniteScrollTeachers' :values='this.teachers'
                                   v-model='selectedTeacher'></infinite-scroll>
                </div>
              </div>

              <div class='form-lesson'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='newLesson.description'></textarea>
              </div>

            </form>
          </div>

          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' @click='saveLesson()'>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import InfiniteScroll from '@/components/InfiniteScroll';

export default {
  name: 'Lessons',
  components: { InfiniteScroll },
  data() {
    return {
      lessons: [],
      teachers: [],
      locals: [],
      semesters: [],
      text: '',
      val: 1,
      errors: 0,
      major: {},
      newLesson: {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        duration: '',
        majorId: {},
        teacherId: {},
        semesterIds: [],
        localId: {},
        year: '',
      },
      selectedTeacher: '',
      selectedLocal: {},
      selectedSemester: {},
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.lessons.getAll(token, {
        majorId: this.major.id,
      })
        .then(result => {
          if (result === true) {
            this.lessons = this.$store.state.lessons.data;
          }
        });

      this.$store.state.major.getDetails(token, this.major.id)
        .then(result => {
          if (result === true) {
            this.major = this.$store.state.major.data;
            this.newLesson.majorId = { id: this.major.id };
          }
        });

      this.$store.state.teachers.getAll(token, {})
        .then(result => {
          if (result === true) {
            this.teachers = this.$store.state.teachers.data;
          }
        });

      this.$store.state.semesters.getAll(token, {})
        .then(result => {
          if (result === true) {
            this.semesters = this.$store.state.semesters.data;
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
    removeLesson(lessonId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.lessons.delete(token, lessonId).then(result => {
        if (result === true) {
          this.lessons = this.lessons.filter(x => x.id !== lessonId);
          this.lessons = this.lessons.slice().sort((a, b) => b.fullName - a.fullName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    addLesson() {
      $('#modalCreate').modal('show');
    },
    checkErrors() {
      this.errors |= (this.newLesson.fullName === '') ? 1 : this.errors;
      this.errors |= (this.newLesson.shortName === '') ? (1 << 1) : this.errors;
      this.errors |= (this.newLesson.year === '') ? (1 << 2) : this.errors;
      this.errors |= (this.selectedTeacher === '') ? (1 << 3) : this.errors;
      this.errors |= (!this.semesters.some(x => x.selected === true)) ? (1 << 4) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },
    saveLesson() {
      if (this.checkErrors()) return;

      $('#modalCreate').modal('hide');

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.newLesson.fullName += ` ${this.major.shortName}`;
      this.newLesson.shortName += ` ${this.major.shortName}`;

      this.newLesson.majorId = { id: this.major.id };
      this.newLesson.teacherId = { id: this.selectedTeacher };
      this.newLesson.semesterIds = [];
      this.newLesson.priority = !this.newLesson.priority ? 1 : this.newLesson.priority;

      this.semesters.forEach(s => {
        if (s.selected)
          this.newLesson.semesterIds.push({ id: s.id });
      });

      this.$store.state.lessons.create(token, this.newLesson).then(result => {
        if (result === true) {
          this.lessons.push(this.$store.state.lessons.data);
          this.lessons = this.lessons.slice().sort((a, b) => b.year - a.year);

          this.restart();
          this.$refs.infiniteScrollTeachers.clear();

        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    restart() {
      this.newLesson = {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        duration: '',
        majorId: {},
        teacherId: {},
        semesterIds: [],
        localId: {},
        year: '',
      };

      this.selectedSemester = {};
      this.selectedLocal = {};
      this.selectedTeacher = '';

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
    this.major.id = this.$route.params.majorId;
    if (!this.major.id) {
      this.$router.push({ name: 'notFoundPage' });
    }

    this.loadData();
  },
};
</script>

<style scoped>

</style>