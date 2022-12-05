<template>
  <div>
    <div style='text-align: justify'>

      <p>
        Este requerimiento se refiere a la cantidad de valores distintos que puede
        tomar determinado atributo en el conjunto de turnos que pasa la etapa de
        condiciones. El usuario configura, además del atributo A, el operador de
        comparación O y el valor V. El requerimiento se cumple si la cantidad de
        valores que toma el atributo A en el conjunto de turnos que cumple las
        condiciones previas mantiene una relación O con V.

        Ejemplo de este requerimiento e
      </p>

      <ol>
        <li>
          <strong>Dar clases 3 días de la semana</strong>
          <ul>
            <li>Atributo: dia de la semana</li>
            <li>Valor: 3</li>
            <li>Operador: =</li>
            <li>Intervalo: Todo el curso</li>
          </ul>
        </li>
        <li>
          <strong>No dar turnos de más de 1 asignatura en una semana</strong>
          <ul>
            <li>Atributo: dia de la semana</li>
            <li>Valor: 1</li>
            <li>Operador: <=</li>
            <li>Intervalo: Semanal</li>
          </ul>
        </li>
      </ol>


      <p>
        Esta clase cuenta con los siguientes atributos:
      </p>

      <ul>
        <li>attribute, nombre del atributo del que se quiere verificar su distribución</li>
        <li>min, que representa un número de valores que puede tomar el atributo</li>
        <li>
          operator, campo enumerativo que representa el operador que se aplica
          entre la cantidad de valores que toma el atributo en los turnos que
          cumplen las condiciones y min
        </li>
      </ul>


    </div>
    <div role='document'>
      <div class='modal-header'>
        <h5 class='modal-title' id='exampleModalLabel'>Nueva Restricción de Distribucion de Atributos</h5>
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
            <label for='input-min' class='col-form-label'>Mínimo:</label>
            <input type='number'
                   :class="{'form-control': true, 'border-danger': errors & 1}"
                   id='input-min'
                   v-model='newRestriction.min'>
          </div>

          <div class='form-group'>
            <label for='input-interval' class='col-form-label'>Intervalo:</label>
            <input type='number'
                   :class="{'form-control': true, 'border-danger': errors & (1 << 3)}"
                   id='input-interval'
                   v-model='newRestriction.interval'>
          </div>

          <div class='form-group'>
            <label for='input-priority' class='col-form-label'>Prioridad:</label>
            <input type='number'
                   :class="{'form-control': true, 'border-danger': errors & (1 << 4)}"
                   id='input-priority'
                   v-model='newRestriction.priority'>
          </div>

          <div class='row'>

            <div class='col col-md-6 form-group'>
              <label for='input-part' class='col-form-label'>Atributo:</label>
              <div style='margin-left: 5px; margin-top: 10px' class='form-group dropdown mb-0'>
                <button
                  :class="{'btn': true, 'btn-light': true, 'dropdown-toggle': true, 'border-danger': errors & (1 << 1)}"
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
                  :class="{'btn': true, 'btn-light': true, 'dropdown-toggle': true, 'border-danger': errors & (1 << 2)}"
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
              :class="{'form-control': true, 'border-danger': errors & (1 << 5)}"
              id='input-priority'
              v-model='newRestriction.description'>
            </textarea>
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
import Restrictions_type from '@/controllers/Restrictions/condition_types';
import Permission from '@/utils/permission';
import InfiniteScroll from '@/components/InfiniteScroll';

export default {
  name: 'DistributionRestrictions',
  components: {
    InfiniteScroll,
  },
  data() {
    return {
      errors: 0,
      teachers: [],
      newRestriction: {
        min: 0,
        attribute: '',
        operator: '',
        interval: 0,
        priority: 0,
        description: '',
        teacherId: { id: undefined },
      },
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
      operators: [
        '>',
        '<',
        '>=',
        '<=',
        '!=',
        '==',
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

    handleAllRestrictions() {
      return this.$store.state.profile.hasRole(Permission.CREATE_RESTRICTIONS_FOR_ALL_USERS);
    },
    checkErrors() {
      this.errors |= (this.newRestriction.min === 0) ? 1 : this.errors;
      this.errors |= (this.newRestriction.attribute === '') ? (1 << 1) : this.errors;
      this.errors |= (this.newRestriction.operator === '') ? (1 << 2) : this.errors;
      this.errors |= (this.newRestriction.interval === 0) ? (1 << 3) : this.errors;
      this.errors |= (this.newRestriction.priority === 0) ? (1 << 4) : this.errors;
      this.errors |= (this.newRestriction.description === '') ? (1 << 5) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },
    saveRestriction() {

      if (this.checkErrors()) return;

      this.$store.state.restrictions.loadMinData();
      let conditions = this.$store.state.restrictions.data[Restrictions_type.BASE_CONDITION];

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.distributionRestrictions.create(token, {
        conditions: JSON.stringify(conditions),
        ...this.newRestriction,
      })
        .then(result => {
          if (result === true)
            this.$router.push({ name: 'restrictionsPage' });
          else
            this.$swal.fire({
              position: 'top-end',
              icon: 'error',
              title: `Oops... problemas con las restricciones`,
              text: this.$store.state.distributionRestrictions.data.error,
              footer: 'Facultad de Matemática y Computación. UH.',
              timer: 5000,
            });
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
