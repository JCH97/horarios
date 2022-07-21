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
              <button v-if="filterList(lessons, text, 'id').length === 0" type='button'
                      class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
              </button>
              <router-link v-for="lesson in filterList(lessons, text, 'id')" :key='lesson.id'
                           :to="{name: 'lessonPage', params: {lessonId: lesson.id}}"
                           class='list-lesson-item list-lesson-item-action'>
                {{ lesson.fullName }}
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
                    <input type='text' class='form-control' id='input-fullName' v-model='newLesson.fullName'>
                  </div>
                  <div class='form-lesson'>
                    <label for='input-shortName' class='col-form-label'>Nombre:</label>
                    <input type='text' class='form-control' id='input-shortName' v-model='newLesson.shortName'>
                  </div>
                  <div class='form-lesson'>
                    <label for='input-priority' class='col-form-label'>Prioridad:</label>
                    <input type='number' class='form-control' id='input-priority' v-model='newLesson.priority' />
                  </div>
                </div>
                <div class='col-md-6'>
                  <div class='form-lesson'>
                    <label for='input-description' class='col-form-label'>Year:</label>
                    <input class='form-control' id='input-description' v-model='newLesson.year'>
                  </div>

                  <div class='form-lesson'>
                    <label for='input-description' class='col-form-label'>Descripcion:</label>
                    <textarea class='form-control' id='input-description' v-model='newLesson.description'></textarea>
                  </div>
                </div>

                <div style='margin-left: 5px; margin-top: 10px' class='form-group dropdown mb-0'>
                  <button
                    :style='[selectedTeacher.id ? {"color": "green"}: {} ]'
                    class='btn btn-light dropdown-toggle'
                    type='button' id='teacher_drop_down'
                    data-toggle='dropdown'
                    aria-haspopup='true' aria-expanded='true'>
                    {{ !selectedTeacher.shortName ? 'Elegir Profesor' : selectedTeacher.shortName }}
                  </button>
                  <div class='dropdown-menu'>
                    <a style='cursor:pointer;' v-for='u in this.teachers' :key='u.id' class='dropdown-item'
                       @click='selectedTeacher = u'>{{ u.fullName }}</a>
                  </div>
                </div>


                <!--                <div style='margin-left: 5px; margin-top: 10px' class='form-group dropdown mb-0'>-->
                <!--                  <button-->
                <!--                    class='btn btn-light dropdown-toggle'-->
                <!--                    type='button' id='teacher_drop_down'-->
                <!--                    data-toggle='dropdown'-->
                <!--                    aria-haspopup='true' aria-expanded='true'>-->
                <!--                    {{ selectedShortNameLocal != '' ? selectedShortNameLocal : 'Elegir local' }}-->
                <!--                  </button>-->
                <!--                  <div class='dropdown-menu'>-->
                <!--                    <a style='cursor:pointer;' v-for='u in this.locals' :key='u.id' class='dropdown-item'-->
                <!--                       @click.prevent='selectedShortNameLocal = u.shortName'>{{ u.fullName }}</a>-->
                <!--                  </div>-->
                <!--                </div>-->


                <div style='margin-left: 5px; margin-top: 10px' class='form-group dropdown mb-0'>
                  <button :style='[selectedSemester.id ? {"color": "green"} : {}]'
                          class='btn btn-light dropdown-toggle'
                          type='button' id='teacher_drop_down'
                          data-toggle='dropdown'
                          aria-haspopup='true' aria-expanded='true'>
                    {{ !selectedSemester.shortName ? 'Elegir Semestre' : selectedSemester.shortName }}
                  </button>
                  <div class='dropdown-menu'>
                    <a style='cursor:pointer;' v-for='u in this.semesters' :key='u.id' class='dropdown-item'
                       @click='selectedSemester = u'>{{ u.fullName }}</a>
                  </div>

                  <!--                  Elegir multiple-->
                  <!--                  <div class='dropdown-menu animated&#45;&#45;fade-in ' aria-labelledby='dropdownMenuButton'-->
                  <!--                       x-placement='bottom-start'-->
                  <!--                       style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>-->
                  <!--                    <div class='input-group m-2 ' v-for='it in semesters' :key='it.id'>-->
                  <!--                      <div class='input-group-text bg-white'>-->
                  <!--                        <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.'>-->
                  <!--                        <span class='ml-2' id='basi7-addon3'>{{ it.shortName }}</span>-->
                  <!--                      </div>-->
                  <!--                    </div>-->
                  <!--                  </div>-->

                </div>

              </div>

            </form>
          </div>

          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' data-dismiss='modal' @click='saveLesson()'>
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
  name: 'Lessons',
  data() {
    return {
      lessons: [],
      teachers: [],
      locals: [],
      semesters: [],
      text: '',
      val: 1,
      major: {},
      newLesson: {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        duration: '',
        majorId: {},
        teacherId: {},
        semesterId: {},
        localId: {},
      },
      selectedTeacher: {},
      selectedLocal: {},
      selectedSemester: {},
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.lessons.getData(token)
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

      // this.$store.state.se


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
          this.lessons = this.lessons.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    addLesson() {
      $('#modalCreate').modal('show');
    },
    saveLesson() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.newLesson.majorId = { id: this.major.id };

      this.$store.state.lessons.create(token, this.newLesson).then(result => {
        if (result === true) {
          this.lessons.push(this.$store.state.lessons.data);
          this.lessons = this.lessons.slice().sort((a, b) => b.shortName - a.shortName);
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
    chooseTeacher(id) {
      const teacher = this.teachers.find(x => x.Id === id);
      this.btnTeacherText = teacher.fullName;
    },
    chooseLocal(id) {
      const local = this.locals.find(x => x.Id === id);
      this.btnLocalText = local.fullName;
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