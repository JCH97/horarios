<template>
  <div id='department'>
    <div class='row'>
      <div class='col-12'>
        <div class='card w-100 border-bottom-primary mb-1'>
          <div class='card-header py-2 bg-white'>
            <div class='row align-items-center'>
              <div class='col'>
                <h5 class='m-0 font-weight-bold text-primary'> Departamentos de {{ faculty.shortName }}
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
                  <button class='btn ml-2' @click.prevent='addDepartment()'>
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
              <button v-if="filterList(departments, text, 'fullName').length === 0" type='button'
                      class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
              </button>
              <router-link v-for="department in filterList(departments, text, 'fullName')" :key='department.id'
                           :to="{name: 'departmentPage', params: {departmentId: department.id}}"
                           class='list-group-item list-group-item-action'>{{ department.fullName }}
                <div class='form-inline justify-content-end'>
                  <i class='fas fa-trash' @click.prevent='removeDepartment(department.id)'></i>
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
            <h5 class='modal-title' id='exampleModalLabel'>Nuevo Departamento</h5>
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
                       v-model='newDepartment.fullName'>
              </div>
              <div class='form-group'>
                <label for='input-shortName' class='col-form-label'>Nombre Reducido:</label>
                <input type='text'
                       :class="{'form-control': true, 'border-danger': errors & (1 << 1)}"
                       id='input-shortName'
                       v-model='newDepartment.shortName'>
              </div>
              <div class='form-group'>
                <label for='input-priority' class='col-form-label'>Prioridad:</label>
                <input type='number' class='form-control' id='input-priority' v-model='newDepartment.priority' />
              </div>
              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='newDepartment.description'></textarea>
              </div>

            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' @click='saveDepartment()'>
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
  name: 'Departments',
  data() {
    return {
      facultyId: '',
      faculty: {},
      departments: [],
      text: '',
      val: 1,
      errors: 0,
      newDepartment: {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        facultyId: '',
        teachers: [],
      },
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      const facultyId = this.$route.params.facultyId;

      this.$store.state.departments.getData(token, { facultyId })
        .then(result => {
          if (result === true) {
            this.departments = this.$store.state.departments.data;
          }
        });


      this.$store.state.faculty.getDetails(token, this.facultyId)
        .then(result => {
          if (result === true) {
            this.faculty = this.$store.state.faculty.data;
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
    removeDepartment(departmentId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.departments.delete(token, departmentId).then(result => {
        if (result === true) {
          this.departments = this.departments.filter(x => x.id !== departmentId);
          this.departments = this.departments.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });

    },
    addDepartment() {
      $('#modalCreate').modal('show');
    },
    checkErrors() {
      this.errors |= (this.newDepartment.fullName === '') ? 1 : this.errors;
      this.errors |= (this.newDepartment.shortName === '') ? (1 << 1) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },
    saveDepartment() {
      if (this.checkErrors()) return;

      $('#modalCreate').modal('hide');

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.newDepartment.facultyId = { id: this.facultyId };

      this.$store.state.departments.create(token, this.newDepartment).then(result => {
        if (result === true) {
          this.departments.push(this.$store.state.departments.data);
          this.departments = this.departments.slice().sort((a, b) => b.shortName - a.shortName);
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
    this.facultyId = this.$route.params.facultyId;

    if (!this.facultyId) {
      this.$router.push({ name: 'notFoundPage' });
    }

    this.loadData();
  },
};
</script>

<style scoped>

</style>