<template>
  <div>
    <div style='text-align: justify'>

      <p>
        Este requerimiento se refiere a la relación que mantiene el conjunto de turnos
        que cumplen las condiciones previas con otro que cumple otro grupo de
        condiciones. En este caso se requiere que el usuario añada un segundo grupo de
        condiciones que filtrarán el segundo conjunto de turnos, un atributo A y un
        operador booleano de conjuntos O que define la relación entre los valores de A
        en el primer conjunto y el segundo. El requerimiento se cumple si el conjunto
        de valores que toma A en el primer conjunto de turnos mantiene una relación O
        con el conjunto de valores que toma A en el segundo conjunto

        Ejemplos de este requerimiento son:
      </p>

      <ul>
        <li>
          <strong>
            Que los turnos que cumplan las condiciones anteriores sean los mismos días
            de la semana que los que cumplen X condiciones
          </strong>

          <ol>
            <li>
              Atributo: día de la semana
            </li>
            <li>
              Operador: EQUALS
            </li>
          </ol>

        </li>

        <li>
          <strong>
            Que los turnos que cumplan las condiciones anteriores se impartan en locales
            donde se imparten los que los que cumplen X condiciones
          </strong>

          <ol>
            <li>
              Atributo: local
            </li>
            <li>
              Operador: SUBSET
            </li>
          </ol>
        </li>
      </ul>

      <p>
        Esta clase cuenta con los siguientes atributos:
      </p>

      <ul>
        <li>
          subConditions, texto que representa el código
          correspondiente a las condiciones del requerimiento, o sea, a las
          condiciones que como requerimiento deben cumplir los turnos que
          cumplan con conditions.
        </li>
        <li>
          attribute, nombre del atributo del que se quiere verificar su distribución
        </li>
        <li>
          relationalOperator, literal que representa el operador booleano de
          conjuntos que se aplica entre ambos subconjuntos de valores de
          attribute.
        </li>
      </ul>


    </div>
    <div role='document'>
      <div class='modal-header'>
        <h5 class='modal-title' id='exampleModalLabel'>Nueva Restriccion de Requerimiento Relacional</h5>
        <!--        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>-->
        <!--          <span aria-hidden='true'>&times;</span>-->
        <!--        </button>-->
      </div>
      <div class='modal-body'>
        <form>

          <div v-if='this.handleAllRestrictions()' class='form-group'>
            <label for='select_teacher' class='col-form-label'>Seleccione Profesor:</label>
            <infinite-scroll id='select_teacher' :values='this.teachers'
                             v-model='newRestriction.teacherId.id'></infinite-scroll>
          </div>
          <div class='form-group'>
            <label for='input-interval' class='col-form-label'>Intervalo:</label>
            <input type='number'
                   :class="{'form-control': true, 'border-danger': errors & (1 << 2)}"
                   id='input-interval'
                   value='7'
                   :min='1'
                   v-model='newRestriction.interval'>
          </div>
          <div class='form-group'>
            <label for='input-priority' class='col-form-label'>Prioridad:</label>
            <input type='number'
                   :class="{'form-control': true, 'border-danger': errors & (1 << 3)}"
                   id='input-priority'
                   v-model='newRestriction.priority'>
          </div>

          <div class='row'>

            <div class='col col-md-6 form-group'>
              <label for='input-part' class='col-form-label'>Atributo:</label>
              <div style='margin-left: 5px; margin-top: 10px' class='form-group dropdown mb-0'>
                <button
                  :class="{'btn': true, 'btn-light': true, 'dropdown-toggle': true, 'border-danger': errors & (1 << 4)}"
                  type='button' id='teacher_drop_down'
                  data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
                  {{ !newRestriction.attribute ? 'Elegir Attriburo' : newRestriction.attribute }}
                </button>
                <div class='dropdown-menu'>
                  <a style='cursor:pointer;' v-for='u in this.attributes' :key='u[2]' class='dropdown-item'
                     @click='newRestriction.attribute = u[1]'>{{ u[0] }}</a>
                </div>
              </div>
            </div>

            <div class='col col-md-6 form-group'>
              <label for='input-operator' class='col-form-label'>Operador:</label>

              <div style='margin-left: 5px; margin-top: 10px' class='form-group dropdown mb-0'>
                <button
                  :class="{'btn': true, 'btn-light': true, 'dropdown-toggle': true, 'border-danger': errors & (1 << 5)}"
                  type='button' id='teacher_drop_down'
                  data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
                  {{ !newRestriction.operator ? 'Elegir Operador' : newRestriction.operator }}
                </button>
                <div class='dropdown-menu'>
                  <a style='cursor:pointer;' v-for='u in this.operators' :key='u' class='dropdown-item'
                     @click='newRestriction.operator = u'>{{ u }}</a>
                </div>
              </div>
            </div>

          </div>

          <div class='form-group'>
            <label for='input-description' class='col-form-label'>Descripcion:</label>
            <textarea
              :class="{'form-control': true, 'border-danger': errors & (1 << 6)}"
              id='input-priority'
              v-model='newRestriction.description'>
            </textarea>
          </div>

          <div class='form-group'>
            <HandleConditions @show='false' v-model='query'></HandleConditions>
          </div>

        </form>
      </div>
      <div class='modal-footer'>
        <button type='button' style='cursor: pointer;' class='btn btn-primary' @click='saveRestriction()'>
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import HandleConditions from '@/components/Restrictions/HandleConditions';
import Restrictions_type from '@/controllers/Restrictions/condition_types';
import Permission from '@/utils/permission';
import InfiniteScroll from '@/components/InfiniteScroll';

export default {
  name: 'RelationalRestriction',
  components: {
    HandleConditions,
    InfiniteScroll,
  },
  data() {
    return {
      query: {},
      errors: 0,
      newRestriction: {
        attribute: '',
        operator: '',
        interval: 0,
        priority: 0,
        description: '',
        teacherId: {}
      },
      teachers: [],
      operators: [
        'EQUALS',
        'NOT_EQUALS',
        'SUBSET',
      ],
      attributes: [
        ['prioridad', 'priority', 1],
        ['local', 'localId', 2],
        ['asignatura', 'lessonId', 3],
        ['grupo', 'groupId'],
        ['inicio del turno', 'start', 4],
        ['fin del turno', 'end', 5],
        ['semana', 'week', 6],
        ['dia de la semana', 'start', 7],
      ],
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
          }
        });
    },
    checkErrors() {
      this.errors |= (this.newRestriction.attribute === '') ? (1 << 4) : this.errors;
      this.errors |= (this.newRestriction.operator === '') ? (1 << 5) : this.errors;
      this.errors |= (this.newRestriction.interval === 0) ? (1 << 2) : this.errors;
      this.errors |= (this.newRestriction.description === '') ? (1 << 6) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },
    handleAllRestrictions() {
      return this.$store.state.profile.hasRole(Permission.CREATE_RESTRICTIONS_FOR_ALL_USERS);
    },
    saveRestriction() {
      if (this.checkErrors()) return;

      this.$store.state.restrictions.loadMinData();
      let conditions = this.$store.state.restrictions.data[Restrictions_type.BASE_CONDITION];

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.relationalRestrictions.create(token, {
        conditions: JSON.stringify(conditions),
        subConditions: JSON.stringify(this.query),
        ...this.newRestriction,
      })
        .then(result => {
          if (result === true)
            this.$router.push({ name: 'restrictionsPage' });
          else {
            this.$swal.fire({
              position: 'top-end',
              icon: 'error',
              title: `Oops... problemas con las restricciones`,
              text: this.$store.state.relationalRestrictions.data.error,
              footer: 'Facultad de Matemática y Computación. UH.',
              timer: 5000,
            });
          }
        });
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style scoped>

</style>
