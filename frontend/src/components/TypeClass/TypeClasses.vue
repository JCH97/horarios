<template>
  <div id='typeClasses'>
    <div class='row'>
      <div class='col-12'>
        <div class='card w-100 border-bottom-primary mb-1'>
          <div class='card-header py-2 bg-white'>
            <div class='row align-items-center'>
              <div class='col'>
                <h5 class='m-0 font-weight-bold text-primary'>Tipos de Clases
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
                  <button class='btn ml-2' @click.prevent='addTypeClass()'>
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
              <button v-if="filterList(typeClasses, text, 'fullName').length === 0" type='button'
                      class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
              </button>
              <router-link v-for="type in filterList(typeClasses, text, 'fullName')" :key='type.id'
                           :to="{name: 'typeClassPage', params: {typeClassId: type.id}}"
                           class='list-group-item list-group-item-action'>{{ type.fullName }} ({{ type.shortName }})
                <div class='form-inline justify-content-end'>
                  <i class='fas fa-trash' @click.prevent='removeTypeClass(type.id)'></i>
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
            <h5 class='modal-title' id='exampleModalLabel'>Nuevo Tipo de Clase</h5>
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
                    <input type='text'
                           :class="{'form-control': true, 'border-danger': errors & 1}"
                           id='input-fullName'
                           v-model='newTypeClass.fullName'>
                  </div>
                  <div class='form-group'>
                    <label for='input-shortName' class='col-form-label'>Nombre Reducido:</label>
                    <input type='text'
                           :class="{'form-control': true, 'border-danger': errors & (1 << 1)}"
                           id='input-shortName'
                           v-model='newTypeClass.shortName'>
                  </div>
                  <div class='form-group'>
                    <label for='input-priority' class='col-form-label'>Prioridad:</label>
                    <input type='number' class='form-control' id='input-priority' v-model='newTypeClass.priority' />
                  </div>
                </div>


                <div class='col-md-6'>
                  <div class='form-group'>
                    <div class='form-group'>
                      <label for='input-duration' class='col-form-label'>Duración:</label>
                      <input type='number'
                             :class="{'form-control': true, 'border-danger': errors & (1 << 2)}"
                             id='input-duration'
                             v-model='newTypeClass.duration' />
                    </div>
                    <div class='form-group'>
                      <label class='col-form-label'> Elegir tipo:</label>
                      <button
                        :class="{'btn': true, 'btn-secondary': true, 'btn-lg': true, 'dropdown-toggle': true, 'border-danger': errors & (1 << 3)}"
                        type='button'
                        id='input-select-type'
                        data-toggle='dropdown'
                        aria-haspopup='true' aria-expanded='false'
                        style='width: 220px; height: 40px;'
                      >
                        {{ this.btnSelectedTypeText }}
                      </button>

                      <div class='dropdown-menu'>
                        <a style='cursor: pointer' v-for='u in this.types' :key='u' class='dropdown-item'
                           @click.prevent='chooseType(u)'>{{ u }}</a>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='newTypeClass.description'></textarea>
              </div>

            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' data-dismiss='modal' @click='saveTypeClass()'>
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
  name: 'TypeClasses',
  data() {
    return {
      typeClasses: [],
      types: ['CONFERENCIA', 'CLASE_PRACTICA', 'LABORATORIO'], // TODO: change this for api query
      text: '',
      val: 1,
      newTypeClass: {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        duration: '',
        type: '',
      },
      btnSelectedTypeText: '',
      errors: 0,
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;
      this.$store.state.typeClasses.getData(token).then(result => {
        if (result === true) {
          this.typeClasses = this.$store.state.typeClasses.data;
          this.typeClasses = this.typeClasses.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    chooseType(type) {
      this.btnSelectedTypeText = type;
      this.newTypeClass.type = type;
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
    removeTypeClass(typeClassId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.typeClasses.delete(token, typeClassId).then(result => {
        if (result === true) {
          this.typeClasses = this.typeClasses.filter(u => u.id !== typeClassId);
          this.typeClasses = this.typeClasses.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    addTypeClass() {
      $('#modalCreate').modal('show');
    },
    checkErrors() {
      this.errors |= (this.newTypeClass.fullName === '') ? 1 : this.errors;
      this.errors |= (this.newTypeClass.shortName === '') ? (1 << 1) : this.errors;
      this.errors |= (this.newTypeClass.duration === '') ? (1 << 2) : this.errors;
      this.errors |= (this.newTypeClass.type === '') ? (1 << 3) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },

    restore() {
      this.btnSelectedTypeText = '';
      this.newTypeClass = {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        duration: '',
        type: '',
      };
    },

    saveTypeClass() {
      if (this.checkErrors()) return;

      $('#modalCreate').modal('hide');

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.typeClasses.create(token, this.newTypeClass).then(result => {
        if (result === true) {
          this.typeClasses.push(this.$store.state.typeClasses.data);
          this.typeClasses = this.typeClasses.slice().sort((a, b) => b.shortName - a.shortName);

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