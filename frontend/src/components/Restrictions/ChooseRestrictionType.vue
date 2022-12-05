<template>
  <div>
    <div role='document'>
      <div class='modal-header'>
        <h5 class='modal-title' id='exampleModalLabel'>Seleccione el tipo de restricción</h5>
      </div>

      <div class='modal-body'>
        <div class='' v-for='(it, index) in restrictionType' :key='it.id'>
          <div>
            <input type='checkbox' data-toggle='collapse' :href='`#id${it.id}`' role='button' aria-expanded='false'
                   aria-controls='type_description' v-model='it.isSelected' @click='disableOthers(it.id)'>
            <span class='ml-2'>{{ it.name }}</span>
          </div>
          <div class='collapse' :id='`id${it.id}`'>
            <p class='ml-2 card-body' style='text-align: justify'>
              {{ it.description }}
            </p>
          </div>
        </div>
      </div>
      <div class='modal-footer'>
        <button type='button' style='cursor: pointer;' class='btn btn-primary' @click='restrictionOk()'>
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChooseRestrictionType',
  data() {
    return {
      restrictionType: [
        {
          id: 1,
          name: 'Restricción de Cuenta Simple',
          isSelected: false,
          description: ' Este requerimiento se refiere al número de turnos que han satisfecho las condiciones. El usuario debe configurar el operador de comparación O a aplicar y el valor V con el cual comparar. El requerimiento se cumple si la cantidad de turnos que satisfacen las condiciones mantiene una relación O con V.',
        },
        {
          id: 2,
          name: 'Restricción de Cuenta de Condiciones',
          isSelected: false,
          description: 'Este requerimiento se refiere a qué parte del conjunto de turnos que ha satisfecho las condiciones previas, cumple también un bloque de condiciones adicionales, y cuenta además con el operador de comparación O a aplicar y el valor V con el cual comparar. El requerimiento se cumple si la cantidad de turnos que satisfacen las condiciones iniciales y satisfacen simultáneamente otras que se han configurado, mantiene una relación O con V.',
        },
        {
          id: 3,
          name: 'Restriccion de Distribucion de Atributo',
          isSelected: false,
          description: 'Este requerimiento se refiere a la cantidad de valores distintos que puede tomar determinado atributo en el conjunto de turnos que pasa la etapa de condiciones. El usuario configura, además del atributo A, el operador de comparación O y el valor V. El requerimiento se cumple si la cantidad de valores que toma el atributo A en el conjunto de turnos que cumple las condiciones previas mantiene una relación O con V.',
        },
        {
          id: 4,
          name: 'Restriccion de requerimiento relacional',
          isSelected: false,
          description: 'Este requerimiento se refiere a la relación que mantiene el conjunto de turnos que cumplen las condiciones previas con otro que cumple otro grupo de condiciones. En este caso se requiere que el usuario añada un segundo grupo de condiciones que filtrarán el segundo conjunto de turnos, un atributo A y un operador booleano de conjuntos O que define la relación entre los valores de A en el primer conjunto y el segundo. El requerimiento se cumple si el conjunto de valores que toma A en el primer conjunto de turnos mantiene una relación O con el conjunto de valores que toma A en el segundo conjunto.',
        },
      ],
    };
  },
  methods: {
    restrictionOk() {
      const obj = this.restrictionType.find(x => x.isSelected === true);

      switch (obj.id) {
        case 1:
          this.$router.push({ name: 'simpleCountRestrictionsPage' });
          break;
        case 2:
          this.$router.push({ name: 'countConditionsRestrictionsPage' });
          break;
        case 3:
          this.$router.push({ name: 'distributeAttributeRestriction' });
          break;
        case 4:
          this.$router.push({ name: 'relationalRestrictionPage' });
          break;
        default:
          this.$router.push({ name: 'notFoundPage' });
      }

    },
    disableOthers(id) {
      this.restrictionType.forEach((it) => {
        if (it.id !== id) {
          it.isSelected = false;
        }
      });
    },
  },
};
</script>

<style scoped>

</style>