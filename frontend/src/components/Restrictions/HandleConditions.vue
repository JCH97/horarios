<template>
  <div>
    <vue-query-builder :labels='labels' :rules='rules' v-model='query'></vue-query-builder>
    <div class='modal-footer'>
      <!--      <button type='button' class='btn btn-secondary' data-dismiss='modal' @click.prevent='cancel()'>-->
      <!--        Cancelar-->
      <!--      </button>-->
      <div v-if='show'>
        <button type='button' :disabled='!query || !query.children || query.children.length  === 0'
                class='btn btn-primary'
                data-dismiss='modal'
                @click.prevent='saveCondition()'>
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VueQueryBuilder from 'vue-query-builder';
import Restrictions_type from '@/controllers/Restrictions/condition_types';

export default {
  name: 'HandleConditions',
  components: {
    VueQueryBuilder,
  },
  props: ['show'],
  data() {
    return {
      query: {},
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
      rules: [],
      teachers: [],
      locals: [],
      lessons: [],
      typeClasses: [],
      groups: [],
      departments: [],
      semesters: [],
    };
  },
  methods: {
    loadData() {
      this.loadFrom('typeClasses');
      this.loadFrom('groups');
      this.loadFrom('teachers');
      this.loadFrom('lessons');
      this.loadFrom('locals');
      this.loadFrom('semesters');
      this.loadFrom('departments');
    },

    saveCondition() {
      this.$store.state.restrictions.updateDataValue(this.query, Restrictions_type.BASE_CONDITION);

      this.$router.push({ name: 'chooseRestrictionsTypePage' });
    },

    loadFrom(arg) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state[arg].getAll(token)
        .then(result => {
          if (result === true) {
            this[arg] = this.$store.state[arg].data;

            this.makeRules(arg);

          }
        });
    },

    makeRules(arg) {
      this.$store.state.restrictions.updateDataValue({});

      if (this.rules.some(x => x.id === arg))
        return;

      switch (arg) {
        case 'teachers':
          if (this.teachers.length === 0)
            break;

          this.rules.push({
            type: 'select',
            id: 'teachers',
            label: 'Profesores',
            choices: this.teachers.map(t => {
              return {
                label: t.fullName,
                value: t.id,
              };
            }),
          });

          break;
        case 'typeClasses':
          if (this.typeClasses.length === 0)
            break;

          this.rules.push({
            type: 'select',
            id: 'typeClasses',
            label: 'Tipos de Clases',
            choices: this.typeClasses.map(t => {
              return {
                label: t.fullName,
                value: t.id,
              };
            }),
          });

          break;

        case 'groups':
          if (this.groups.length === 0)
            break;

          this.rules.push({
            type: 'select',
            id: 'groups',
            label: 'Grupos',
            choices: this.groups.map(t => {
              return {
                label: t.fullName,
                value: t.id,
              };
            }),
          });

          break;

        case 'lessons':
          if (this.lessons.length === 0)
            break;

          this.rules.push({
            type: 'select',
            id: 'lessons',
            label: 'Asignaturas',
            choices: this.lessons.map(t => {
              return {
                label: t.fullName,
                value: t.id,
              };
            }),
          });

          break;

        case 'locals':
          if (this.locals.length === 0)
            break;

          this.rules.push({
            type: 'select',
            id: 'locals',
            label: 'Locales',
            choices: this.locals.map(t => {
              return {
                label: t.fullName,
                value: t.id,
              };
            }),
          });

          break;

        case 'semesters':
          if (this.semesters.length === 0)
            break;

          this.rules.push({
            type: 'select',
            id: 'semesters',
            label: 'Semestres',
            choices: this.semester.map(t => {
              return {
                label: t.fullName,
                value: t.id,
              };
            }),
          });

          break;

        case 'departments':
          if (this.departments.length === 0)
            break;

          this.rules.push({
            type: 'select',
            id: 'departments',
            label: 'Departamentos',
            choices: this.departments.map(t => {
              return {
                label: t.fullName,
                value: t.id,
              };
            }),
          });

          break;

        default:
          break;
      }
    },

    addInitialRules() {
      // make local capacity
      this.rules.push({
          type: 'numeric',
          id: 'localCapacity',
          label: 'Capacidad del Local',
        },
      );

      // make start date
      // this.rules.push({
      //   type: 'radio',
      //   id: 'startDescription',
      //   label: 'Horario del Turno. Inicio.',
      //   choices: [
      //     { label: 'En la mañana', value: 'morning' },
      //     { label: 'En la tarde', value: 'afternoon' },
      //   ],
      // });
      //
      // // make end date
      // this.rules.push({
      //   type: 'radio',
      //   id: 'endDescription',
      //   label: 'Horario del Turno. Finalizacion.',
      //   choices: [
      //     { label: 'En la mañana', value: 'morning' },
      //     { label: 'En la tarde', value: 'afternoon' },
      //   ],
      // });

      this.rules.push({
        type: 'select',
        id: 'dayOfWeek',
        label: 'Dia de la Semana',
        choices: [
          { label: 'Lunes', value: '1' },
          { label: 'Martes', value: '2' },
          { label: 'Miercoles', value: '3' },
          { label: 'Jueves', value: '4' },
          { label: 'Viernes', value: '5' },
        ],
      });
    },
  },
  created() {
    this.addInitialRules();
    this.loadData();

    // this.$store.state.restrictions.loadMinData();
    // let conditions = this.$store.state.restrictions.data[Restrictions_type.BASE_CONDITION];

    const path = window.location.href.split('/');
    if (path[path.length - 1] != 'conditions' && path[path.length - 1] != 'count_conditions' && path[path.length - 1] != 'relational') {
      setTimeout(() => {
        this.query = this.$attrs || {};
      }, 1000);
    }
  },
 watch: {
    query: function(val) {
      this.$emit('input', val);
    },
  },
};
</script>

<style scoped>

</style>