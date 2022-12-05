<template>
  <div id='restrictionDetails'>
    <div class='row'>
      <div class='col-12'>
        <div class='card mb-4 w-100 border-bottom-primary'>
          <div class='card-header py-3 bg-white'>
            <h5 class='m-0 font-weight-bold text-primary'> Restriccion. Profesor: {{ this.teacher.fullName }} </h5>
            <h6>{{ this.getRestrictionType() }}</h6>
          </div>
        </div>
      </div>
    </div>

    <div class='container overflow-hidden'>
      <div>
        <div class='card'>
          <div class='card-body'>
            <h5 class='card-title text-black-50'><strong> Condicion </strong></h5>

            <HandleConditions v-bind='this.restriction.conditions'></HandleConditions>
          </div>
        </div>
      </div>

      <div class='my-4'>
        <div class='card text-center'>
          <div class='card-body'>
            <h5 class='card-title text-black-50'><strong> Descripcion </strong></h5>
            <p class='card-text'>{{ restriction.description }}</p>
          </div>
        </div>
      </div>

      <div class='row py-4'>
        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Intervalo </strong></h5>
              <p class='card-text'>{{ restriction.interval }}</p>
            </div>
          </div>
        </div>


        <div class='col-sm-6'>
          <div class='card text-center'>
            <div class='card-body'>
              <h5 class='card-title text-black-50'><strong> Prioridad </strong></h5>
              <p class='card-text'>{{ restriction.priority }}</p>
            </div>
          </div>
        </div>

      </div>

      <div v-if='this.restriction.restrictionType === 1'>

        <div class='row py-4'>
          <div class='col-sm-6'>
            <div class='card text-center'>
              <div class='card-body'>
                <h5 class='card-title text-black-50'><strong> Parte / Min </strong></h5>
                <p class='card-text'>{{ restriction.part }} / {{ restriction.min }}</p>
              </div>
            </div>
          </div>


          <div class='col-sm-6'>
            <div class='card text-center'>
              <div class='card-body'>
                <h5 class='card-title text-black-50'><strong> Operador </strong></h5>
                <p class='card-text'>{{ restriction.operator }}</p>
              </div>
            </div>
          </div>
        </div>


      </div>

      <div v-if='this.restriction.restrictionType === 2'>
        <div class='card'>
          <div class='card-body'>
            <h5 class='card-title text-black-50'><strong> SubCondicion </strong></h5>

            <HandleConditions v-bind='this.restriction.subCondition'></HandleConditions>
            <!--            <pre>-->
            <!--                {{ JSON.stringify(this.restriction.subCondition, undefined, 2) }}-->
            <!--              </pre>-->
          </div>
        </div>

        <div class='row py-4'>
          <div class='col-sm-6'>
            <div class='card text-center'>
              <div class='card-body'>
                <h5 class='card-title text-black-50'><strong>Parte</strong></h5>
                <p class='card-text'>{{ restriction.part }}</p>
              </div>
            </div>
          </div>


          <div class='col-sm-6'>
            <div class='card text-center'>
              <div class='card-body'>
                <h5 class='card-title text-black-50'><strong> Operador </strong></h5>
                <p class='card-text'>{{ restriction.operator }}</p>
              </div>
            </div>
          </div>

        </div>


      </div>

      <div v-if='this.restriction.restrictionType === 3'>
        <div class='row py-4'>
          <div class='col-sm-4'>
            <div class='card text-center'>
              <div class='card-body'>
                <h5 class='card-title text-black-50'><strong> Min </strong></h5>
                <p class='card-text'> {{ restriction.min }}</p>
              </div>
            </div>
          </div>


          <div class='col-sm-4'>
            <div class='card text-center'>
              <div class='card-body'>
                <h5 class='card-title text-black-50'><strong> Operador </strong></h5>
                <p class='card-text'>{{ restriction.operator }}</p>
              </div>
            </div>
          </div>


          <div class='col-sm-4'>
            <div class='card text-center'>
              <div class='card-body'>
                <h5 class='card-title text-black-50'><strong> Atributo </strong></h5>
                <p class='card-text'>{{ restriction.attribute }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div v-if='this.restriction.restrictionType === 5'>
        <div class=' row py-4'>

          <div class='col-sm-6'>
            <div class='card text-center'>
              <div class='card-body'>
                <h5 class='card-title text-black-50'><strong> Atributo </strong></h5>
                <p class='card-text'>{{ restriction.attribute }}</p>
              </div>
            </div>
          </div>


          <div class='col-sm-6'>
            <div class='card text-center'>
              <div class='card-body'>
                <h5 class='card-title text-black-50'><strong> Operador </strong></h5>
                <p class='card-text'>{{ restriction.operator }}</p>
              </div>
            </div>
          </div>

        </div>

        <div class='card'>
          <div class='card-body'>
            <h5 class='card-title text-black-50'><strong> SubCondicion </strong></h5>

            <HandleConditions v-bind='this.restriction.subConditions'></HandleConditions>
            <!--            <pre>-->
            <!--                {{ JSON.stringify(this.restriction.subCondition, undefined, 2) }}-->
            <!--              </pre>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Restrictions_type from '@/controllers/Restrictions/restrictions_type';
import HandleConditions from '@/components/Restrictions/HandleConditions';

export default {
  name: 'BreachedRestrictionsDetails',
  components: {
    HandleConditions,
  },
  data() {
    return {
      restriction: {
        id: '',
        restrictionType: '',
        teacherId: {},
        description: '',
      },
      teacher: {},
    };
  },
  methods: {
    loadData() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      switch (parseInt(this.restriction.restrictionType)) {
        case Restrictions_type.SimpleCountRestriction:

          this.$store.state.simpleCountRestrictionsDetails.getData(token, this.restriction.id).then(result => {
            if (result === true) {
              this.restriction = this.$store.state.simpleCountRestrictionsDetails.data;

              this.getTeacher();
            }
          });

          break;
        case Restrictions_type.CountConditionsRestriction:

          this.$store.state.countConditionsRestrictionsDetails.getData(token, this.restriction.id).then(result => {
            if (result === true) {
              this.restriction = this.$store.state.countConditionsRestrictionsDetails.data;

              this.getTeacher();
            }
          });

          break;

        case Restrictions_type.RelationalRestrictions:

          this.$store.state.relationalRestrictionsDetails.getData(token, this.restriction.id).then(result => {
            if (result === true) {
              this.restriction = this.$store.state.relationalRestrictionsDetails.data;

              this.getTeacher();
            }
          });

          break;

        default:
          break;
      }
    },

    getTeacher() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.teacher.getData(token, this.restriction.teacherId.id).then(result => {
        if (result === true) {
          this.teacher = this.$store.state.teacher.data;
        }
      });
    },

    getRestrictionType() {
      return Object.keys(Restrictions_type)[Object.values(Restrictions_type).indexOf(this.restriction.restrictionType)];
    },

  },

  created() {
    this.restriction.id = this.$route.params.restrictionId;
    this.restriction.restrictionType = this.$route.params.restrictionType;

    this.loadData();
  },
};
</script>

<style scoped>

</style>