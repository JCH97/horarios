<template>
  <div id='lesson'>
    <div class='row'>
      <div class='col-12'>
        <div class='card mb-4 w-100 border-bottom-primary'>
          <div class='card-header py-3 bg-white'>
            <h5 class='m-0 font-weight-bold text-primary'>Asignatura: {{ lesson.fullName }} / {{ lesson.major.fullName
              }}</h5>

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
              <p class='card-text'>{{ lesson.fullName }}</p>
            </div>
          </div>
        </div>

        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Nombre Reducido </strong></h5>
              <p class='card-text'>{{ lesson.shortName }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class='row py-4'>
        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Prioridad </strong></h5>
              <p class='card-text'>{{ lesson.priority }}</p>
            </div>
          </div>
        </div>

        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Descripción </strong></h5>
              <p class='card-text'>{{ lesson.description }}</p>
            </div>
          </div>
        </div>

      </div>


      <div class='row py-4'>
        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Año </strong></h5>
              <p class='card-text'>{{ lesson.year }}</p>
            </div>
          </div>
        </div>

        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Duración </strong></h5>
              <p class='card-text'>{{ lesson.duration }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class='row py-4'>
        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Profesor </strong></h5>
              <p class='card-text'>
                {{ this.selectedFromInfiniteScroll ? (teachers.find(x => x.id === this.selectedFromInfiniteScroll)).fullName : lesson.teacher.fullName
                }}
              </p>
            </div>
          </div>
        </div>

        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Semestres </strong></h5>
              <p class='card-text'>{{ lesson.semesters.map(x => x.shortName).join(',') }}</p>
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
            <h5 class='modal-title' id='exampleModalLabel'>Editando {{ lesson.fullName }}</h5>
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
                    <input type='text' class='form-control' id='input-fullName' v-model='lesson.fullName'>
                  </div>
                  <div class='form-group'>
                    <label for='input-shortName' class='col-form-label'>Nombre:</label>
                    <input type='text' class='form-control' id='input-shortName' v-model='lesson.shortName'>
                  </div>
                </div>
                <div class='col-md-6'>
                  <div class='form-group'>
                    <label for='input-priority' class='col-form-label'>Prioridad:</label>
                    <input type='number' class='form-control' id='input-priority' v-model='lesson.priority' />
                  </div>
                  <div class='form-group'>
                    <label for='input-year' class='col-form-label'>Año:</label>
                    <input type='number' max='5' min='1' class='form-control' id='input-year' v-model='lesson.year'>
                  </div>
                </div>
              </div>

              <div>
                <label> Elegir Profesor</label>
                <div>
                  <infinite-scroll :values='this.teachers' v-model='selectedFromInfiniteScroll'></infinite-scroll>
                </div>
              </div>

              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='lesson.description'></textarea>
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
import InfiniteScroll from '@/components/InfiniteScroll';

export default {
  name: 'Lesson',
  components: {
    InfiniteScroll,
  },
  data() {
    return {
      selectedFromInfiniteScroll: '',
      teachers: [],
      lesson: {
        id: '',
        fullName: '',
        shortName: '',
        description: '',
        priority: '',
        year: '',
        duration: '',
        major: {},
        local: {},
        teacher: {},
        semesters: [],
        localId: {},
        teacherId: {},
        semesterIds: [],
        majorId: {},
      },
    };
  },

  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.lesson.getDetails(token, this.lesson.id).then(result => {
        if (result === true) {
          this.lesson = this.$store.state.lesson.data;
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });

      this.$store.state.teachers.getAll(token, {})
        .then(result => {
          if (result === true) {
            this.teachers = this.$store.state.teachers.data;
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

      if (this.selectedFromInfiniteScroll !== '')
        this.lesson.teacherId = { id: this.selectedFromInfiniteScroll };

      this.$store.state.lesson.edit(token, { ...this.lesson })
        .then(result => {
          if (result === true) {
            this.lesson = this.$store.state.lesson.data;
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
    this.lesson.id = this.$route.params.lessonId;
    if (!this.lesson.id) {
      this.$router.push({ name: 'notFoundPage' });
    }
    this.loadData();
  },

};
</script>

<style scoped>

</style>