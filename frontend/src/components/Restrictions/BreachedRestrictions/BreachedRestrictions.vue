<template>
  <div class='row'>

    <pulse-loader color='#0000FF' style='position: fixed; z-index: 1; width: 100%; height: 100%; left: 50%; top:50%'
                  :loading='loading'></pulse-loader>

    <div class='col-12'>
      <div class='card w-100 border-bottom-primary mb-1'>
        <div class='card-header py-2 bg-white'>
          <div class='row align-items-center'>
            <div class='col'>
              <h5 class='m-0 font-weight-bold text-primary'> Restricciones Incumplidas
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
                <!--                <button class='btn ml-2' @click.prevent='()'>-->
                <!--                </button>-->
                <!--                <router-link style='cursor: pointer' :to="{name: 'restrictionsConditionsPage'}" class='nav-link'>-->
                <!--                  <i role='button' class='fas fa-plus'></i>-->
                <!--                </router-link>-->
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class='card'>
        <div class='card-body p-0'>
          <div class='list-group'>
            <button v-if="filterList(restrictions, text, 'teacherName').length === 0" type='button'
                    class='list-group-item list-group-item-action' disabled>No hay restricciones incumplidas
            </button>
            <router-link v-for="(rest, index) in filterList(restrictions, text, 'teacherName')" :key='rest.id'
                         class='list-group-item list-group-item-action'
                         :to="{name: 'breachedRestrictionsDetailsPage', params: {restrictionId: rest.id, restrictionType: rest.restrictionType}}">
              <strong>Profesor: </strong> {{ rest.teacherName }}
              <br>
              <strong> ID de la restricción: </strong> {{ rest.id }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Condition_types from '@/controllers/Restrictions/condition_types';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

export default {
  name: 'BreachedRestrictions',
  components: {
    PulseLoader,
  },
  data() {
    return {
      restrictions: [],
      teachers: [],
      val: 1,
      text: '',
      loading: false,
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.teachers.getAll(token, {})
        .then(result => {
          if (result === true) {
            this.teachers = this.$store.state.teachers.data;

            this.$store.state.restrictions.getHappiness({})
              .then(result => {
                if (result === true) {
                  this.restrictions = (this.$store.state.restrictions.data[Condition_types.HAPPINESS]).breachedRestrictions;

                  for (let i = 0; i < this.restrictions.length; i++)
                    this.restrictions[i].teacherName = this.getTeacherName(this.restrictions[i].teacherId);


                  this.loading = false;

                }
              });
          }
        });
    },

    getTeacherName(id) {
      let teacher = this.teachers.find(teacher => teacher.id === id);
      return teacher ? teacher.fullName : '';
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
    this.loading = true;
    this.loadData();
  },
};
</script>

<style scoped>

</style>