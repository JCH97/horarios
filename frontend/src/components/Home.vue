<template>
  <div id='home'>
    <div class='row'>
      <div class='col'>
        <div class='dropdown mb-0'>
          <button class='btn btn-light dropdown-toggle' type='button' id='asignaturas_drop_down' data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
            Asignaturas
          </button>
          <div class='dropdown-menu animated--fade-in ' aria-labelledby='dropdownMenuButton' x-placement='bottom-start'
               style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>
            <div class='input-group m-2 ' v-for='it in courses' :key='it.id'>
              <div class='input-group-text bg-white'>
                <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.isMarked'>
                <span class='ml-2' id='basic-'>{{ it.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='col'>


        <div class='dropdown mb-0'>
          <button class='btn btn-light dropdown-toggle' type='button' id='grupos_drop_down' data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
            Grupos
          </button>
          <div class='dropdown-menu animated--fade-in ' aria-labelledby='dropdownMenuButton' x-placement='bottom-start'
               style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>
            <div class='input-group m-2 ' v-for='it in groups' :key='it.id'>
              <div class='input-group-text bg-white'>
                <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.isMarked'>
                <span class='ml-2' id='basi7-addon3'>{{ it.shortName }}</span>
              </div>
            </div>
          </div>
        </div>


      </div>
      <div class='col'>
        <div class='dropdown mb-0'>
          <button class='btn btn-light dropdown-toggle' type='button' id='locales_drop_down' data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
            Locales
          </button>
          <div class='dropdown-menu animated--fade-in ' aria-labelledby='dropdownMenuButton' x-placement='bottom-start'
               style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>
            <div class='input-group m-2 ' v-for='it in locals' :key='it.id'>
              <div class='input-group-text bg-white'>
                <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.isMarked'>
                <span class='ml-2' id='basi3-addon3'>{{ it.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='col'>
        <div class='dropdown mb-0'>
          <button class='btn btn-light dropdown-toggle' type='button' id='resources_drop_down' data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
            Recursos
          </button>
          <div class='dropdown-menu animated--fade-in ' aria-labelledby='dropdownMenuButton' x-placement='bottom-start'
               style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>
            <div class='input-group m-2 ' v-for='it in resources' :key='it.id'>
              <div class='input-group-text bg-white'>
                <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.isMarked'>
                <span class='ml-2' id='basi1-addon3'>{{ it.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='col'>
        <div class='dropdown mb-0'>
          <button class='btn btn-light dropdown-toggle' type='button' id='tipos_drop_down' data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
            Tipos
          </button>
          <div class='dropdown-menu animated--fade-in ' aria-labelledby='dropdownMenuButton' x-placement='bottom-start'
               style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>
            <div class='input-group m-2 ' v-for='it in tags' :key='it.id'>
              <div class='input-group-text bg-white'>
                <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.isMarked'>
                <span class='ml-2' id='basi5-addon3'>{{ it.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='col'>
        <button class='btn btn-block btn-outline-dark' @click='makeQuery'>
          Filtrar
        </button>
      </div>
    </div>
    <div class='row'>
      <div class='card-body mt-0' @click.stop style='width: 200px'>
        <div class='row ml-5'>
          <div class='col-1'>
            <h1 class='h5 text-dark mt-1'>Desde:</h1>
          </div>
          <div class='col-5'>
            <datetime type='datetime' :phrases='phrases' v-model='datetimeStart'></datetime>
          </div>
          <div class='col-1'>
            <h1 class='h5 text-dark mt-1 '>Hasta:</h1>
          </div>
          <div class='col-5'>
            <datetime type='datetime' :phrases='phrases' v-model='datetimeEnd'></datetime>
          </div>
        </div>
      </div>
    </div>
    <!--    <full-calendar :events='events' :config='config' @event-selected='eventSelected'></full-calendar>-->

    <FullCalendar
      :options='config'
    >
      <template v-slot:eventContent='arg'>
        <b>{{ arg.event.title }}</b>
        <hr>
        <b>{{ arg.timeText }}</b>
      </template>
    </FullCalendar>

    <!--    Modal Create-->
<!--    <div class='modal fade' id='modalCreate' tabindex='-1' role='dialog' aria-labelledby='modalCreate'-->
<!--         aria-hidden='true' ref='modalEdit'>-->
<!--      <div class='modal-dialog' role='document'>-->
<!--        <div class='modal-content'>-->
<!--          <div class='modal-header'>-->
<!--            <h5 class='modal-title' id='exampleModalLabel'>Nuevo Turno de Clase</h5>-->
<!--            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>-->
<!--              <span aria-hidden='true'>&times;</span>-->
<!--            </button>-->
<!--          </div>-->
<!--          <div class='modal-body'>-->
<!--            <form>-->
<!--              <div class='row'>-->
<!--                <div class='col-md-6'>-->
<!--                  <div class='form-group'>-->
<!--                    <label for='input-fullName' class='col-form-label'>Nombre completo:</label>-->
<!--                    <input type='text' class='form-control' id='input-fullName' v-model='newTeacher.fullName'>-->
<!--                  </div>-->
<!--                  <div class='form-group'>-->
<!--                    <label for='input-shortName' class='col-form-label'>Nombre:</label>-->
<!--                    <input type='text' class='form-control' id='input-shortName' v-model='newTeacher.shortName'>-->
<!--                  </div>-->
<!--                  <div class='form-group'>-->
<!--                    <label for='input-priority' class='col-form-label'>Prioridad:</label>-->
<!--                    <input type='number' class='form-control' id='input-priority' v-model='newTeacher.priority' />-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class='col-md-6'>-->
<!--                  <div class='form-group'>-->
<!--                    <label for='input-description' class='col-form-label'>Email:</label>-->
<!--                    <input class='form-control' id='input-description' v-model='newTeacher.email'>-->
<!--                  </div>-->

<!--&lt;!&ndash;                  <div class='form-group'>&ndash;&gt;-->
<!--&lt;!&ndash;                    <label class='col-form-label'> Elegir univerisidad:</label>&ndash;&gt;-->
<!--&lt;!&ndash;                    <button class='btn btn-secondary btn-lg dropdown-toggle' type='button' id='input-select-university'&ndash;&gt;-->
<!--&lt;!&ndash;                            data-toggle='dropdown'&ndash;&gt;-->
<!--&lt;!&ndash;                            aria-haspopup='true' aria-expanded='false'&ndash;&gt;-->
<!--&lt;!&ndash;                            style='width: 220px; height: 40px;'&ndash;&gt;-->
<!--&lt;!&ndash;                    >&ndash;&gt;-->
<!--&lt;!&ndash;                      {{ btnSelectUniversityText }}&ndash;&gt;-->
<!--&lt;!&ndash;                    </button>&ndash;&gt;-->

<!--&lt;!&ndash;                    <div class='dropdown-menu'>&ndash;&gt;-->
<!--&lt;!&ndash;                      <a v-for='u in this.universities' :key='u.id' class='dropdown-item'&ndash;&gt;-->
<!--&lt;!&ndash;                         @click.prevent='chooseUniversity(u.fullName)'>{{ u.fullName }}</a>&ndash;&gt;-->
<!--&lt;!&ndash;                    </div>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->

<!--&lt;!&ndash;                  <div class='form-group'>&ndash;&gt;-->
<!--&lt;!&ndash;                    <label class='col-form-label'> Elegir facultad:</label>&ndash;&gt;-->
<!--&lt;!&ndash;                    <button class='btn btn-secondary btn-lg dropdown-toggle' type='button' id='input-select-faculty'&ndash;&gt;-->
<!--&lt;!&ndash;                            data-toggle='dropdown'&ndash;&gt;-->
<!--&lt;!&ndash;                            aria-haspopup='true' aria-expanded='false'&ndash;&gt;-->
<!--&lt;!&ndash;                            style='width: 220px; height: 40px;'&ndash;&gt;-->
<!--&lt;!&ndash;                            :disabled='this.faculties.length === 0'&ndash;&gt;-->
<!--&lt;!&ndash;                    >&ndash;&gt;-->
<!--&lt;!&ndash;                      {{ btnSelectFacultyText }}&ndash;&gt;-->
<!--&lt;!&ndash;                    </button>&ndash;&gt;-->

<!--&lt;!&ndash;                    <div class='dropdown-menu'>&ndash;&gt;-->
<!--&lt;!&ndash;                      <a v-for='u in this.faculties' :key='u.id' class='dropdown-item'&ndash;&gt;-->
<!--&lt;!&ndash;                         @click.prevent='chooseFaculty(u.fullName)'>{{ u.fullName }}</a>&ndash;&gt;-->
<!--&lt;!&ndash;                    </div>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->

<!--                </div>-->
<!--              </div>-->

<!--              <div class='form-group'>-->
<!--                <label for='input-description' class='col-form-label'>Descripcion:</label>-->
<!--                <textarea class='form-control' id='input-description' v-model='newTeacher.description'></textarea>-->
<!--              </div>-->

<!--            </form>-->
<!--          </div>-->
<!--          <div class='modal-footer'>-->
<!--            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>-->
<!--            <button type='button' class='btn btn-primary' data-dismiss='modal' @click='saveTeacher()'>-->
<!--              Guardar-->
<!--            </button>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->


  </div>
</template>

<script>
// import { FullCalendar } from 'vue-full-calendar';
// import 'fullcalendar/dist/locale/es';
import { Settings } from 'luxon';
import { Datetime } from 'vue-datetime';

import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

Settings.defaultLocale = 'es';

export default {
  name: 'Home',
  components: {
    Datetime,
    FullCalendar,
  },
  data() {
    return {
      courses: [],
      resources: [],
      tags: [],
      groups: [],
      teachers: [],
      lessons: [],
      locals: [],
      events: [],
      classes: [],
      newClass: {
        description: '',
        localId: '',
        lessonId: '',
        typeClassId: '',
        teachers: [],
        start: [],
        end: [],
      },
      config: {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        defaultView: 'agendaWeek',
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
          resourceTimelinePlugin,
        ],
        locale: 'es',
        editable: true, // change this for update
        selectable: true,
        navLinks: true,
        weekends: false, // poner fines de semana
        events: [],
        resources: [],
        // views: {
        //   timeGridFourDay: {
        //     type: 'timeGrid',
        //     duration: { days: 5 },
        //     buttonText: '4 day',
        //   },
        // },
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,resourceTimelineWeek',
        },
        initialView: 'timeGridWeek',
        slotDuration: '00:30:00', // tiempo que cubre una celda
        scrollTime: '08:00:00',
        businessHours: {
          startTime: '8:00',
          endTime: '17:00',
        },
        minTime: '8:00',
        maxTime: '17:00',
        allDaySlot: false, // poner un evento que dura todo el dia
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventSet: this.handleEvents,
      },
      datetimeStart: '',
      datetimeEnd: '',
      phrases: { ok: 'Aceptar', cancel: 'Cancelar' },
    };
  },
  methods: {
    loadAll() {
      this.loadFrom('groups');
      this.loadFrom('teachers');
      this.loadFrom('lessons');
      this.loadFrom('locals');
      // this.loadFrom('classes');
      // this.loadFrom('courses');
      // this.loadFrom('groups');
      // this.loadFrom('resources');
      // this.loadFrom('tags');
    },
    loadFrom(arg) {
      console.log(arg);
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;
      this.$store.state[arg].getData(token).then(result => {
        this[arg] = this.$store.state[arg].data;
      });
    },
    getMarkedData(to) {
      return (item => {
        if (item.hasOwnProperty('isMarked') && item.isMarked) {
          to.push(item.id);
        }
      });
    },
    makeQuery() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;
      let toSendTags = [];
      let toSendCourses = [];
      let toSendGroups = [];
      let toSendLocals = [];
      let toSendResources = [];
      let toSendUsers = [];
      let toSendStartDate = null;
      let toSendEndDate = null;
      this.courses.forEach(this.getMarkedData(toSendCourses));
      this.tags.forEach(this.getMarkedData(toSendTags));
      this.groups.forEach(this.getMarkedData(toSendGroups));
      this.locals.forEach(this.getMarkedData(toSendLocals));
      this.resources.forEach(this.getMarkedData(toSendResources));
      if (this.datetimeStart !== '') {
        toSendStartDate = this.datetimeStart;
      }
      if (this.datetimeEnd !== '') {
        toSendEndDate = this.datetimeEnd;
      }
      this.$store.state.query.makeQuery(token, toSendCourses, toSendGroups, toSendLocals, toSendTags, toSendResources, toSendUsers, toSendStartDate, toSendEndDate)
        .then(result => {
          if (result === true) {
            this.events = this.$store.state.query.data;
            this.events.forEach(event => {
              event.color = '#428bca';
              event.textColor = '#ffffff';
            });
          }
          this.loadAll();
        });
    },
    eventSelected(event, jsEvent, view) {
      this.$router.push({ name: 'eventPage', params: { eventId: event.id } });
    },


    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends; // update a property
    },

    handleDateSelect(selectInfo) {
      let title = prompt('Please enter a new title for your event');
      let calendarApi = selectInfo.view.calendar;

      calendarApi.unselect(); // clear date selection

      if (title) {
        calendarApi.addEvent({
          id: Math.random(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
        });
      }
    },

    handleEventClick(clickInfo) {
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove();
      }
    },

    handleEvents(events) {
      this.currentEvents = events;
    },


  },
  created() {
    this.makeQuery();
  },
};
</script>

<style>
@import '~fullcalendar/dist/fullcalendar.min.css';
@import '~vue-datetime/dist/vue-datetime.css';

.fc-event {
  cursor: pointer;
}

.fc-list-item {
  cursor: pointer;
}
</style>
