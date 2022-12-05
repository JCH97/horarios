<template>
  <div class='row'>
    <div class='col-12'>
      <div class='card w-100 border-bottom-primary mb-1'>
        <div class='card-header py-2 bg-white'>
          <div class='row align-items-center'>
            <div class='col'>
              <h5 class='m-0 font-weight-bold text-primary'> Restricciones
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
                <router-link style='cursor: pointer' :to="{name: 'restrictionsConditionsPage'}" class='nav-link'>
                  <i role='button' class='fas fa-plus'></i>
                </router-link>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class='card'>
        <div class='card-body p-0'>
          <div class='list-group'>
            <button v-if="filterList(restrictions, text, 'id').length === 0" type='button'
                    class='list-group-item list-group-item-action' disabled>No hay resultados para mostrar
            </button>
            <div v-for="(rest, index) in filterList(restrictions, text, 'id')" :key='rest.id'
                 class='list-group-item list-group-item-action'>

              <div class='my-2'>
                <h4>Restriccion tipo {{ rest.restrictionType }}. {{ getRestrictionType(rest) }} </h4>
                <h5>Profesor {{ (teachers.find(x => x.id === rest.teacherId.id)).fullName }}</h5>
                <!--                <HandleConditions v-bind='rest.conditions'></HandleConditions>-->
              </div>
              <!--              <p>Intervalo: {{ rest.interval }} </p>-->

              <hr>
              <p>{{ rest.description }}</p>

              <div style='cursor: pointer' class='form-inline justify-content-end'>
                <i class='fas fa-trash' @click.prevent='removeRestriction(rest.id)'></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Restrictions_type from '@/controllers/Restrictions/restrictions_type';
import VueQueryBuilder from 'vue-query-builder';
import HandleConditions from '@/components/Restrictions/HandleConditions';

export default {
  name: 'Restrictions',
  components: {
    VueQueryBuilder,
    HandleConditions,
  },
  data() {
    return {
      restrictions: [],
      teachers: [],
      text: '',
      val: 1,
      labels: {
        'matchType': 'Grupo de condiciones',
        'matchTypes': [
          { 'id': 'all', 'label': 'AND' },
          { 'id': 'any', 'label': 'OR' },
        ],
        'addRule': 'Agregar Regla',
        'removeRule': '&times;',
        'addGroup': 'Agregar Grupo',
        'removeGroup': '&times;',
        'textInputPlaceholder': 'value',
      },
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.simpleCountRestrictions.getAll(token, {})
        .then(result => {
          if (result === true) {
            this.restrictions = this.restrictions.concat(this.$store.state.simpleCountRestrictions.data);
            this.restrictions = this.restrictions.slice().sort((a, b) => b.priority - a.priority);
          }
        });

      this.$store.state.countConditionsRestrictions.getAll(token, {})
        .then(result => {
          if (result === true) {
            this.restrictions = this.restrictions.concat(this.$store.state.countConditionsRestrictions.data);
            this.restrictions = this.restrictions.slice().sort((a, b) => b.priority - a.priority);
          }
        });

      this.$store.state.distributionRestrictions.getAll(token, {})
        .then(result => {
          if (result === true) {
            this.restrictions = this.restrictions.concat(this.$store.state.distributionRestrictions.data);
            this.restrictions = this.restrictions.slice().sort((a, b) => b.priority - a.priority);
          }
        });

      this.$store.state.relationalRestrictions.getAll(token, {})
        .then(result => {
          if (result === true) {
            this.restrictions = this.restrictions.concat(this.$store.state.relationalRestrictions.data);
            this.restrictions = this.restrictions.slice().sort((a, b) => b.priority - a.priority);
          }
        });

      this.$store.state.teachers.getAll(token, {})
        .then(result => {
          if (result === true) {
            this.teachers = this.$store.state.teachers.data;
          }
        });

    },
    getRestrictionType(rest) {
      return Object.keys(Restrictions_type)[Object.values(Restrictions_type).indexOf(rest.restrictionType)];
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
    removeRestriction(restrictionId) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      const r = this.restrictions.find(x => x.id === restrictionId);

      switch (r.restrictionType) {
        case Restrictions_type.SimpleCountRestriction:

          this.$store.state.simpleCountRestrictions.delete(token, restrictionId).then(result => {
            if (result === true) {
              this.restrictions = this.restrictions.filter(u => u.id !== restrictionId);
              this.restrictions = this.restrictions.slice().sort((a, b) => b.priority - a.priority);
            }
          });

          break;
        case Restrictions_type.CountConditionsRestriction:

          this.$store.state.countConditionsRestrictions.delete(token, restrictionId).then(result => {
            if (result === true) {
              this.restrictions = this.restrictions.filter(u => u.id !== restrictionId);
              this.restrictions = this.restrictions.slice().sort((a, b) => b.priority - a.priority);
            }
          });

          break;
        case Restrictions_type.DistributionRestrictions:

          this.$store.state.distributionRestrictions.delete(token, restrictionId).then(result => {
            if (result === true) {
              this.restrictions = this.restrictions.filter(u => u.id !== restrictionId);
              this.restrictions = this.restrictions.slice().sort((a, b) => b.priority - a.priority);
            }
          });

          break;
        case Restrictions_type.RelationalRestrictions:

          this.$store.state.relationalRestrictions.delete(token, restrictionId).then(result => {
            if (result === true) {
              this.restrictions = this.restrictions.filter(u => u.id !== restrictionId);
              this.restrictions = this.restrictions.slice().sort((a, b) => b.priority - a.priority);
            }
          });

          break;
        default:
          break;
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
    this.loadData();
  },
};
</script>

<style scoped>

</style>