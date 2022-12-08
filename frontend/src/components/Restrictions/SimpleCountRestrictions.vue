<template>
  <div>
    <div style='text-align: justify'>
      <p>
        Este requerimiento se refiere al número de turnos que han satisfecho las
        condiciones. El usuario debe configurar el operador de comparación O a aplicar y el valor V con el cual
        comparar. El requerimiento se cumple si la cantidad de
        turnos que satisfacen las condiciones mantiene una relación O con V.
        El valor V puede ser numérico, o bien porcentual o fraccionario con respecto al
        total de turnos que pasan la etapa de las condiciones, de modo que son
        válidas, por ejemplo, las siguientes variantes:
      </p>

      <ul>
        <li>
          <strong>
            que sean en total 10
          </strong>

          <ol>
            <li>
              Valor: 10
            </li>
            <li>
              Operador: =
            </li>
          </ol>
        </li>

        <li>
          <strong>
            que sean no más de la mitad (de los que pasan las condiciones)
          </strong>

          <ol>
            <li>
              Valor: 1/2 de los que cumplen las condiciones
            </li>
            <li>
              Operador: <=
            </li>
          </ol>
        </li>

        <li>
          <strong>
            que sean al menos el 23% (de los que pasan las condiciones)
          </strong>

          <ol>
            <li>
              Valor: 23/100 de los que cumplen las condiciones iniciales
            </li>
            <li>
              Operador: >=
            </li>
          </ol>
        </li>
      </ul>


      <p> Esta clase cuenta con los siguientes atributos: </p>

      <ul>
        <li>
          min, que representa el número de turnos que deben cumplir los
          requerimientos
        </li>
        <li>
          part, número fraccionario que representa qué parte del total de turnos
          deben cumplir los requerimientos
        </li>

        <li>
          operator, literal que representa el operador aritmético que se
          aplica entre la cantidad de turnos que cumplen las condiciones y min o el
          producto de part por la cardinalidad del conjunto de turnos que pasan
          las condiciones, dependiendo de cuál de ellos (min o part) esté
          establecido
        </li>
      </ul>

    </div>
    <div role='document'>
      <div class='modal-header'>
        <h5 class='modal-title' id='exampleModalLabel'>Nueva Restricción Simple</h5>
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
            <label for='input-part' class='col-form-label'>Parte:</label>
            <input type='number'
                   :class="{'form-control': true, 'border-danger': errors & (1 << 1)}"
                   id='input-part'
                   v-model='newRestriction.part'>
          </div>
          <!--          <div class='form-group'>-->
          <!--            <label for='input-operator' class='col-form-label'>Operador:</label>-->
          <!--            <input type='text'-->
          <!--                   :class="{'form-control': true, 'border-danger': errors & (1 << 2)}"-->
          <!--                   id='input-operator' v-model='newRestriction.operator' />-->
          <!--          </div>-->

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
  name: 'HandleRestrictionsSimpleCount',
  components: {
    InfiniteScroll,
  },
  data() {
    return {
      errors: 0,
      teachers: [],
      newRestriction: {
        min: 0,
        part: 0,
        operator: '',
        interval: 0,
        priority: 0,
        description: '',
        teacherId: { id: undefined },
      },
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
      // this.errors |= (this.newRestriction.min === 0) ? 1 : this.errors;
      // this.errors |= (this.newRestriction.part === 0) ? (1 << 1) : this.errors;
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

      this.$store.state.simpleCountRestrictions.create(token, {
        conditions: JSON.stringify(conditions),
        ...this.newRestriction,
      })
        .then(result => {
          if (result === true) {
            this.$router.push({ name: 'restrictionsPage' });
            this.$root.$emit('refresh_happiness');
          }
          else
            this.$swal.fire({
              position: 'top-end',
              icon: 'error',
              title: `Oops... problemas con las restricciones`,
              text: this.$store.state.simpleCountRestrictions.data.error,
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