<template>
  <div id='groups'>
    <div class='row'>
      <div class='col-12'>
        <div class='card w-100 border-bottom-primary mb-1'>
          <div class='card-header py-2 bg-white'>
            <div class='row align-items-center'>
              <div class='col'>
                <h5 class='m-0 font-weight-bold text-primary'>Grupos ({{ major.fullName }})</h5>
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
                  <button class='btn ml-2' @click.prevent='addGroup()'>
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
              <button v-if="filterList(groups, text, 'fullName').length === 0" type='button'
                      class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
              </button>
              <router-link v-for="group in filterList(groups, text, 'fullName')" :key='group.fullName'
                           :to="{name: 'groupPage', params: {groupId: group.id}}"
                           class='list-group-item list-group-item-action'>
                <span :style='{color: group.color}'>
                {{ group.fullName }} ({{ group.fullName }})
                </span>

                <div class='form-inline justify-content-end'>
                  <i class='fas fa-trash' @click.prevent='removeGroup(group.id)'></i>
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
            <h5 class='modal-title' id='exampleModalLabel'>Nuevo Grupo</h5>
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
                           v-model='newGroup.fullName'>
                  </div>
                  <div class='form-group'>
                    <label for='input-shortName' class='col-form-label'>Nombre:</label>
                    <input type='text'
                           :class="{'form-control': true, 'border-danger': errors & (1 << 1)}"
                           id='input-shortName'
                           v-model='newGroup.shortName'>
                  </div>
                  <div class='form-group'>
                    <label for='input-priority' class='col-form-label'>Prioridad:</label>
                    <input type='number' class='form-control' id='input-priority' v-model='newGroup.priority' />
                  </div>
                </div>


                <div class='col-md-6'>
                  <div class='form-group'>
                    <label for='input-description' class='col-form-label'>Year:</label>
                    <input
                      :class="{'form-control': true, 'border-danger': errors & (1 << 2)}"
                      id='input-description'
                      v-model='newGroup.year'>
                  </div>

                  <div class='form-group'>
                    <label for='input-color' class='col-form-label'>Color:</label>
                    <input type='color' class='form-control' id='input-color' v-model='newGroup.color'>
                  </div>

                </div>

              </div>

              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='newGroup.description'></textarea>
              </div>

            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' @click='saveGroup()'>
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
  name: 'Groups',
  data() {
    return {
      groups: [],
      text: '',
      val: 1,
      major: {},
      errors: 0,
      newGroup: {
        fullName: '',
        shortName: '',
        priority: '',
        description: '',
        year: '',
        majorId: {},
        color: '',
      },
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.groups.getData(token, {
        majorId: this.major.id
      })
        .then(result => {
          if (result === true) {
            this.groups = this.$store.state.groups.data;
          }
        });

      this.$store.state.major.getData(token, this.major.id)
        .then(result => {
          if (result === true) {
            this.major = this.$store.state.major.data;
            this.newGroup.majorId = { id: this.major.id };
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
    removeGroup(groupId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.groups.delete(token, groupId).then(result => {
        if (result === true) {
          this.groups = this.groups.filter(x => x.id !== groupId);
          this.groups = this.groups.slice().sort((a, b) => b.shortName - a.shortName);
        } else {
          this.$router.push({ name: 'notFoundPage' });
        }
      });
    },
    addGroup() {
      $('#modalCreate').modal('show');
    },
    checkErrors() {
      this.errors |= (this.newGroup.fullName === '') ? 1 : this.errors;
      this.errors |= (this.newGroup.shortName === '') ? (1 << 1) : this.errors;
      this.errors |= (this.newGroup.year === '') ? (1 << 2) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },
    saveGroup() {
      if (this.checkErrors()) return;

      $('#modalCreate').modal('hide');

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.groups.create(token, this.newGroup).then(result => {
        if (result === true) {
          this.groups.push(this.$store.state.groups.data);
          this.groups = this.groups.slice().sort((a, b) => b.shortName - a.shortName);
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