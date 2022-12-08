<template>
  <div id='home'>
    <pulse-loader color='#0000FF' style='position: fixed; z-index: 99; width: 100%; height: 100%; left: 50%; top:49%'
                  :loading='loading'></pulse-loader>
    <div class='row'>
      <!-- Asignaturas -->
      <div class='col'>
        <div class='dropdown mb-0'>
          <button class='btn btn-light dropdown-toggle' type='button' id='asignaturas_drop_down' data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
            Asignaturas
          </button>
          <div class='dropdown-menu animated--fade-in ' aria-labelledby='dropdownMenuButton' x-placement='bottom-start'
               style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>

            <div style='display: grid; grid-template-columns: repeat(10, 1fr);'>
              <div class='input-group m-2' v-for='it in lessons' :key='it.id' style='width: 80%; display: inline'>
                <div class='input-group-text bg-white'>
                  <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.selected'>
                  <span class='ml-2' id='basic-'>{{ it.shortName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grupos-->
      <div class='col'>

        <div class='dropdown mb-0'>
          <button class='btn btn-light dropdown-toggle' type='button' id='grupos_drop_down' data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
            Grupos
          </button>
          <div class='dropdown-menu animated--fade-in ' aria-labelledby='dropdownMenuButton' x-placement='bottom-start'
               style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>
            <div style='display: grid; grid-template-columns: repeat(5, 1fr);'>
              <div class='input-group m-2 ' v-for='it in groups' :key='it.id' style='width: 80%; display: inline'>
                <div class='input-group-text bg-white'>
                  <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.selected'>
                  <span class='ml-2' :style='{color: it.color}' id='basi7-addon3'>{{ it.shortName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Locales-->
      <div class='col'>
        <div class='dropdown mb-0'>
          <button class='btn btn-light dropdown-toggle' type='button' id='locales_drop_down' data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
            Locales
          </button>
          <div class='dropdown-menu animated--fade-in ' aria-labelledby='dropdownMenuButton' x-placement='bottom-start'
               style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>
            <div style='display: grid; grid-template-columns: repeat(4, 1fr);'>
              <div class='input-group m-2 ' v-for='it in locals' :key='it.id' style='width: 87%; display: inline'>
                <div class='input-group-text bg-white'>
                  <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.selected'>
                  <span class='ml-2' id='basi3-addon3'>{{ it.shortName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tipos-->
      <div class='col'>
        <div class='dropdown mb-0'>
          <button class='btn btn-light dropdown-toggle' type='button' id='tipos_drop_down' data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
            Tipos
          </button>
          <div class='dropdown-menu animated--fade-in ' aria-labelledby='dropdownMenuButton' x-placement='bottom-start'
               style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>
            <div class='input-group m-2 ' v-for='it in typeClasses' :key='it.id'>
              <div class='input-group-text bg-white'>
                <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.selected'>
                <span class='ml-2' id='basi5-addon3'>{{ it.shortName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--Majors-->
      <div class='col'>
        <div class='dropdown mb-0'>
          <button class='btn btn-light dropdown-toggle' type='button' id='tipos_drop_down' data-toggle='dropdown'
                  aria-haspopup='true' aria-expanded='true'>
            Carreras
          </button>
          <div class='dropdown-menu animated--fade-in ' aria-labelledby='dropdownMenuButton' x-placement='bottom-start'
               style='position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);'>
            <div class='input-group m-2 ' v-for='it in majors' :key='it.id'>
              <div class='input-group-text bg-white'>
                <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.selected'>
                <span class='ml-2' id='basi5-addon3'>{{ it.fullName }}</span>
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

      <div class='col'>
        <button class='btn btn-block btn-outline-dark' @click='download'>
          Descargar
        </button>
      </div>
    </div>

    <!--Fechas-->
    <div class='row'>
      <div class='card-body mt-0' @click.stop style='width: 200px'>
        <div class='row ml-5'>
          <div class='col-1'>
            <h1 class='h5 text-dark mt-1'>Desde:</h1>
          </div>
          <div class='col-5'>
            <datetime style='cursor: pointer' type='datetime' :phrases='phrases' v-model='datetimeStart'></datetime>
          </div>
          <div class='col-1'>
            <h1 class='h5 text-dark mt-1 '>Hasta:</h1>
          </div>
          <div class='col-5'>
            <datetime style='cursor: pointer' type='datetime' :phrases='phrases' v-model='datetimeEnd'></datetime>
          </div>
        </div>
      </div>
    </div>


    <FullCalendar
      :options='config'
    >
      <template v-slot:eventContent='arg'>
        <b> {{ arg.event.title }} ({{ resolveGroupName(arg.event.groupId) }})</b>
        <!--        <b> {{ arg.event.title }} ({{ arg.timeText }})</b>-->
      </template>

    </FullCalendar>


    <!-- Modal show restrictions-->
    <div class='modal fade' id='modalRestrictions' style='margin-left: 25%;' tabindex='-1' role='dialog'
         aria-labelledby='modalRestrictions'
         aria-hidden='true' ref='modalRestrictions'>
      <div class='modal-dialog modal-dialog-scrollable' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title' id='exampleModalLabel'>Restricciones Asociadas</h5>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>

            <ul>
              <li v-for='(r, index) in restrictions' :key='index'>
                {{ r }}
              </li>
            </ul>

          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create-->
    <div class='modal fade' id='modalCreate' autofocus role='dialog' aria-labelledby='modalCreate'
         aria-hidden='true' ref='modalCreate' style='margin-left: -25%;'>
      <div class='modal-dialog modal-dialog-scrollable' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title' id='exampleModalLabel'>Nuevo Turno de Clase</h5>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <form>

              <div class='my-2'>
                <label class='col-form-label'> Elegir Profesores Extras:</label>
                <infinite-scroll ref='infiniteScrollTeachers' :values='this.teachers' :select-multiple='true'
                                 v-model='selectedTeachers'></infinite-scroll>
              </div>

              <div class='my-2'>
                <label class='col-form-label'> Elegir asignatura:</label>
                <label class='col-form-label' :style="{ color: errors & (1 << 2) ? 'red': 'black' }">*</label>
                <infinite-scroll ref='infiniteScrollLesson' :values='this.lessons'
                                 v-model='selectedLesson'></infinite-scroll>
              </div>

              <div class='my-2'>
                <label class='col-form-label'> Elegir local:</label>
                <label class='col-form-label' :style="{ color: errors & (1 << 3) ? 'red': 'black' }">*</label>
                <infinite-scroll ref='infiniteScrollLocal' :values='this.locals'
                                 v-model='selectedLocal'></infinite-scroll>
              </div>

              <div class='my-2'>
                <label class='col-form-label'> Elegir grupo:</label>
                <label class='col-form-label' :style="{ color: errors & (1 << 5) ? 'red': 'black' }">*</label>
                <infinite-scroll ref='infiniteScrollGroup' :values='this.groups'
                                 v-model='selectedGroup'></infinite-scroll>
              </div>

              <div class='my-2 row'>
                <div class='col-md-6'>
                  <label class='col-form-label'> Elegir tipo de clase:</label>
                </div>

                <div class='col-sm-6'>
                  <div class='form-group dropright'>
                    <button
                      :class="{'btn': true, 'btn-secondary': true, 'btn-lg': true, 'bg-white': true, 'dropdown-toggle': true, 'border-danger': errors & (1 << 4)}"
                      type='button'
                      id='input-select-faculty'
                      data-toggle='dropdown'
                      aria-haspopup='true' aria-expanded='false'
                      style='width: 220px; height: 40px; color:black'
                      :disabled='this.typeClasses.length === 0'
                    >
                      {{
                        !(newClass.typeClassId && newClass.typeClassId.id)
                          ? 'Elija de la lista'
                          : typeClasses.find(x => x.id === newClass.typeClassId.id).shortName
                      }}
                    </button>

                    <div class='dropdown-menu'>
                      <a style='cursor: pointer' v-for='l in this.typeClasses' :key='l.id' class='dropdown-item'
                         @click.prevent='newClass.typeClassId = {id: l.id}'>
                        <strong>{{ l.fullName }} </strong>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class='my-2 row'>
                <div class='col col-md-6'>
                  <input type='checkbox'
                         v-model='newClass.inSerie' /> Crear en serie ?
                </div>

                <div class='col col-md-6' v-if='newClass.inSerie'>

                  <div class='form-group dropright'>
                    <button
                      :class="{'btn': true, 'btn-secondary': true, 'btn-lg': true, 'bg-white': true, 'dropdown-toggle': true, 'border-danger': errors & (1 << 6)}"
                      type='button'
                      id='input-select-faculty'
                      data-toggle='dropdown'
                      aria-haspopup='true' aria-expanded='false'
                      style='width: 220px; height: 40px; color: black;'
                      :disabled='this.classFrequency.length === 0'
                    >
                      {{
                        (!selectedClassFrequency.val)
                          ? 'Elija de la lista'
                          : selectedClassFrequency.val
                      }}
                    </button>

                    <div class='dropdown-menu'>
                      <button style='cursor: pointer' v-for='c in this.classFrequency' :key='c.id'
                              class='dropdown-item'
                              @click.prevent='selectedClassFrequency = c'
                      >
                        <strong> {{ c.val }} </strong>
                      </button>
                    </div>
                  </div>

                </div>

                <div v-if='newClass.inSerie' class='col input-group m-2 d-inline' v-for='it in daysOfWeek'
                     :key='it.id'>
                  <div
                    :class="{'input-group-text': true, 'bg-white': true, 'd-inline': true, 'border-danger': errors & (1 << 7)}"
                  >
                    <input type='checkbox' aria-label='Checkbox for following text input' v-model='it.selected'>
                    <span class='ml-1' id='basic-'>{{ it.val }}</span>
                  </div>
                </div>

              </div>

              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='newClass.description'></textarea>
              </div>

            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button>
            <button type='button' class='btn btn-primary' @click='saveClass()'>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Details-->
    <div class='modal fade' id='modalDetails' tabindex='-1' role='dialog' aria-labelledby='modalDetails'
         aria-hidden='true' ref='modalDetails'>
      <div class='modal-dialog modal-dialog-scrollable' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title' id='modalDetailsTitle'>Detalles del Turno</h5>
            <i v-if='viewPanel()' style='cursor:pointer;' class='fa fa-pen mx-3' data-toggle='tooltip'
               title='Editar' @click.prevent='updateClass()'></i>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <form>

              <div class='row'>
                <div class='col-sm-6'> Titulo:</div>

                <div class='col-sm-6'>
                  <p>
                    {{ this.detailsClickedEvent.lesson.fullName }}
                  </p>
                </div>

              </div>

              <div class='row'>

                <div class='col-md-6'>
                  <label class='col-form-label'> Profesores:</label>
                </div>

                <div class='col-sm-6'>

                  <div class='form-group'>

                    <ul v-if='detailsClickedEvent.teachers.length > 0'>
                      <li v-for='it in this.detailsClickedEvent.teachers' :key='it.id'> {{ it.fullName }}</li>
                    </ul>

                  </div>

                </div>

              </div>

              <div class='row'>
                <div class='col-md-6'>
                  <label class='col-form-label'> Asignatura:</label>
                </div>

                <div class='col-sm-6'>

                  <div class='form-group'>

                    <p> {{ this.detailsClickedEvent.lesson.fullName }} </p>

                  </div>

                </div>
              </div>

              <div class='row'>
                <div class='col-md-6'>
                  <label class='col-form-label'> Local: </label>
                </div>

                <div class='col-sm-6'>

                  <div class='form-group'>

                    {{ this.detailsClickedEvent.local.fullName }}

                  </div>

                </div>
              </div>

              <div class='row'>
                <div class='col-md-6'>
                  <label class='col-form-label'> Tipo de Clase:</label>
                </div>

                <div class='col-sm-6'>
                  <div class='form-group'>

                    <p> {{ this.detailsClickedEvent.typeClass.fullName }} </p>

                  </div>
                </div>
              </div>

              <div class='row'>
                <div class='col-md-6'>
                  <label class='col-form-label'> Horario:</label>
                </div>

                <div class='col-md-6'>
                  <p> {{ formatDate(this.detailsClickedEvent.start) }}</p>
                  <p> {{ formatDate(this.detailsClickedEvent.end) }} </p>
                </div>

              </div>

              <div class='row'>
                <div class='col-md-6'>
                  <label class='col-form-label'> Grupo:</label>
                </div>

                <div class='col-md-6'>
                  <p> {{ this.detailsClickedEvent.group.fullName }}</p>
                </div>

              </div>


              <div class='row'>
                <div class='col-sm-6'> Descripcion:</div>

                <div class='col-sm-6'>

                  <p>
                    {{ this.detailsClickedEvent.description }}
                  </p>
                </div>

              </div>

            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cerrar</button>
            <button v-if='this.viewPanel()' type='button' class='btn btn-primary' data-dismiss='modal'
                    @click='deleteAllEventsInSerie(detailsClickedEvent.serieId, detailsClickedEvent.info)'>
              Eliminar todos los eventos de la serie
            </button>
            <button v-if='this.viewPanel()' type='button' class='btn btn-primary' data-dismiss='modal'
                    @click='deleteEvent(detailsClickedEvent.id, detailsClickedEvent.info)'>
              Eliminar solo este evento
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Update-->
    <div class='modal fade' id='modalEdit' tabindex='-1' role='dialog'
         aria-labelledby='modalEdit' aria-hidden='true' ref='modalEdit' style='overflow-y: scroll'>
      <div class='modal-dialog modal-dialog-scrollable' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title' id='modalEditTitle'>Editar Turno de Clase</h5>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <form>

              <div class='my-2'>
                <label class='col-form-label'> Elegir Profesores Extras:</label>
                <infinite-scroll :values='this.teachers' :select-multiple='true'
                                 v-model='selectedTeachers'></infinite-scroll>
              </div>

              <div class='my-2'>
                <label class='col-form-label'> Elegir asignatura:</label>
                <label class='col-form-label' :style="{ color: errors & (1 << 2) ? 'red': 'black' }">*</label>
                <infinite-scroll :values='this.lessons' v-model='selectedLesson'></infinite-scroll>
              </div>

              <div class='my-2'>
                <label class='col-form-label'> Elegir local:</label>
                <label class='col-form-label' :style="{ color: errors & (1 << 3) ? 'red': 'black' }">*</label>
                <infinite-scroll :values='this.locals' v-model='selectedLocal'></infinite-scroll>
              </div>

              <div class='my-2'>
                <label class='col-form-label'> Elegir grupo:</label>
                <label class='col-form-label' :style="{ color: errors & (1 << 5) ? 'red': 'black' }">*</label>
                <infinite-scroll :values='this.groups' v-model='selectedGroup'></infinite-scroll>
              </div>

              <div class='row'>
                <div class='col-md-6'>
                  <label class='col-form-label'> Elegir tipo de clase:</label>
                </div>

                <div class='col-sm-6' v-if='newClass.typeClassId.id'>
                  <div class='form-group dropright'>
                    <button
                      :class="{'btn': true, 'btn-secondary': true, 'btn-lg': true, 'bg-white': true, 'dropdown-toggle': true, 'border-danger': errors & (1 << 4)}"
                      type='button'
                      id='input-select-faculty'
                      data-toggle='dropdown'
                      aria-haspopup='true' aria-expanded='false'
                      style='width: 220px; height: 40px; color:black'
                      :disabled='this.typeClasses.length === 0'
                    >
                      {{ typeClasses.find(x => x.id === newClass.typeClassId.id).shortName }}
                    </button>

                    <div class='dropdown-menu'>
                      <a style='cursor: pointer' v-for='l in this.typeClasses' :key='l.id' class='dropdown-item'
                         @click.prevent='newClass.typeClassId = {id: l.id}'>
                        <strong>{{ l.fullName }} </strong>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class='form-group'>
                <label for='input-description' class='col-form-label'>Descripcion:</label>
                <textarea class='form-control' id='input-description' v-model='newClass.description'></textarea>
              </div>

            </form>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cerrar</button>
            <button v-if='this.viewPanel()' type='button' class='btn btn-primary' data-dismiss='modal'
                    @click='editClass(true)'>
              Editar todos los eventos de la serie
            </button>
            <button v-if='this.viewPanel()' type='button' class='btn btn-primary' data-dismiss='modal'
                    @click='editClass(false)'>
              Editar solo este evento
            </button>
          </div>
        </div>
      </div>
    </div>

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
import moment from 'moment';
import Permission from '@/utils/permission';
import ClassFrequency from '@/utils/class_frequency';
import InfiniteScroll from '@/components/InfiniteScroll';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import Condition_types from '@/controllers/Restrictions/condition_types';

Settings.defaultLocale = 'es';

export default {
  name: 'Home',
  components: {
    Datetime,
    FullCalendar,
    InfiniteScroll,
    PulseLoader,
  },
  data() {
    return {
      loading: false,
      restrictions: [],
      courses: [],
      resources: [],
      tags: [],
      groups: [],
      teachers: [],
      lessons: [],
      semesters: [],
      locals: [],
      events: [],
      classes: [],
      typeClasses: [],
      selectedTeachers: [],
      selectedLesson: '',
      selectedLocal: '',
      selectedGroup: '',
      errors: 0,
      majors: [],
      detailsClickedEvent: {
        id: '',
        description: '',
        localId: {},
        resourceId: '',
        lessonId: {},
        typeClassId: {},
        teacherIds: [],
        teachers: [],
        lesson: {},
        typeClass: {},
        group: {},
        local: {},
        start: '',
        end: '',
        fullName: '',
        shortName: '',
        priority: '',
        serieId: '',
        info: {},
        color: '',
        frequency: 0,
        amountInSerie: 1,
      },
      newClass: {
        serieId: '',
        description: '',
        localId: {},
        lessonId: {},
        typeClassId: {},
        teacherIds: [],
        start: '',
        end: '',
        fullName: '',
        shortName: '',
        priority: '',
        color: '',
        groupId: {},
        inSerie: false,
        frequency: 0,
        resourceId: '',
      },
      actualSelectInfo: {},
      config: {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        defaultView: 'agendaWeek',
        slotMinTime: '08:30:00',
        slotMaxTime: '18:00:00',
        slotDuration: '01:35:00', // tiempo que cubre una celda
        contentHeight: 'auto',
        contentWidth: 'auto',
        businessHours: {
          startTime: '8:00',
          endTime: '18:00',
        },
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
          resourceTimelinePlugin,
        ],
        locale: 'es',
        editable: false, // for edit events
        selectable: false, // for select events [add too]
        navLinks: true,
        weekends: false, // poner fines de semana
        events: [],
        resources: [],
        views: {
          by_resources: {
            type: 'resourceTimeline',
            // duration: { days: 5 },
            buttonText: 'Recursos',
          },
          by_week: {
            type: 'timeGridWeek',
            buttonText: 'Semanal',
          },
          by_month: {
            type: 'dayGridMonth',
            buttonText: 'Mensual',
          },
          by_day: {
            type: 'timeGridDay',
            buttonText: 'Diario',
          },
        },
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'by_day,by_week,by_month,by_resources',
        },
        groupByResourceAndDates: true,
        initialView: 'timeGridWeek',
        // scrollTime: '08:00:00',
        allDaySlot: false, // poner un evento que dura todo el dia
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventSet: this.handleEvents,
        eventDrop: this.eventDrop,
        eventResize: this.eventResize,
        eventOverlap: this.eventOverlap,
      },
      datetimeStart: '',
      datetimeEnd: '',
      phrases: { ok: 'Aceptar', cancel: 'Cancelar' },
      classFrequency: [],
      selectedClassFrequency: {},
      daysOfWeek: [{ id: 1, val: 'L' }, { id: 2, val: 'M' }, { id: 3, val: 'M' }, { id: 4, val: 'J' }, {
        id: 5,
        val: 'V',
      }],
    };
  },

  methods: {
    loadAll() {
      this.loadFrom('typeClasses');
      this.loadFrom('groups');
      this.loadFrom('teachers');
      this.loadFrom('lessons');
      this.loadFrom('locals');
      this.loadFrom('semesters');
      this.loadFrom('majors');
      // this.loadFrom('classes');

      setTimeout(() => {
        let isAuthored = this.viewPanel();

        this.config.selectable = isAuthored;
        this.config.editable = isAuthored;
      }, 750);
    },

    fixHoursInClasses() {
      for (let i = 0; i < this.classes.length; ++i) {
        let element = this.classes[i];

        element.start = moment.utc(element.start).local().toDate();
        element.end = moment.utc(element.end).local().toDate();
      }
    },

    loadResources() {
      this.config.resources = this.locals.map(l => {
        return {
          id: l.id,
          title: l.fullName,
        };
      });
    },

    updateEventsInCalendar() {
      this.config.events = [];
      this.classes.forEach(c => {
        this.config.events.push({
          id: c.id,
          title: c.shortName,
          start: c.start,
          end: c.end,
          color: c.color,
          resourceId: c.resourceId,
          groupId: c.groupId.id,
        });
      });
    },

    clearIntoScrolls() {
      this.$refs.infiniteScrollTeachers.clear();
      this.$refs.infiniteScrollGroup.clear();
      this.$refs.infiniteScrollLesson.clear();
      this.$refs.infiniteScrollLocal.clear();
    },

    loadFrom(arg) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state[arg].getAll(token)
        .then(result => {
          if (result === true) {
            this[arg] = this.$store.state[arg].data;

            this[arg].sort((a, b) => {
              return a.shortName.localeCompare(b.shortName);
            });

            if (arg === 'classes') {
              this.fixHoursInClasses();
              this.updateEventsInCalendar();
            }

            if (arg === 'locals') {
              this.loadResources();
            }
          }
        });
    },

    getMarkedData(to) {
      return (item => {
        if (item.hasOwnProperty('selected') && item.selected) {
          to.push(item.id);
        }
      });
    },

    makeQuery() {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      let toSendTags = [];
      let toSendLessons = [];
      let toSendGroups = [];
      let toSendLocals = [];
      let toSendResources = [];
      let toSendUsers = [];
      let toSendTypes = [];
      let toSendMajors = [];
      let toSendStartDate = null;
      let toSendEndDate = null;

      this.courses.forEach(this.getMarkedData(toSendLessons));
      this.tags.forEach(this.getMarkedData(toSendTags));
      this.groups.forEach(this.getMarkedData(toSendGroups));
      this.locals.forEach(this.getMarkedData(toSendLocals));
      this.resources.forEach(this.getMarkedData(toSendResources));
      this.lessons.forEach(this.getMarkedData(toSendLessons));
      this.typeClasses.forEach(this.getMarkedData(toSendTypes));
      this.majors.forEach(this.getMarkedData(toSendMajors));

      if (this.datetimeStart !== '') {
        toSendStartDate = this.datetimeStart;
      }

      if (this.datetimeEnd !== '') {
        toSendEndDate = this.datetimeEnd;
      }

      this.$store.state.query.makeQuery(
        token,
        toSendLessons,
        toSendLocals,
        toSendGroups,
        toSendTypes,
        toSendMajors,
        toSendStartDate,
        toSendEndDate)
        .then(result => {
          if (result === true) {
            this.classes = this.$store.state.query.data;

            this.fixHoursInClasses();
            this.updateEventsInCalendar();
          }

          // this.loadAll();
        });
    },

    updateClass() {
      this.detailsClickedEvent.teachers.forEach(t => {
        let teacher = this.teachers.find(x => x.id === t.id);
        this.selectedTeachers.push(teacher.id);
      });

      this.selectedGroup = this.detailsClickedEvent.group.id;
      this.selectedLesson = this.detailsClickedEvent.lesson.id;
      this.selectedLocal = this.detailsClickedEvent.resourceId;

      this.newClass = {
        serieId: this.detailsClickedEvent.serieId,
        description: this.detailsClickedEvent.description,
        localId: { id: this.detailsClickedEvent.local.id },
        lessonId: { id: this.detailsClickedEvent.lesson.id },
        typeClassId: { id: this.detailsClickedEvent.typeClass.id },
        teacherIds: this.detailsClickedEvent.teachers.map(t => {
          return { id: t.id };
        }),
        start: this.detailsClickedEvent.start,
        end: this.detailsClickedEvent.end,
        fullName: this.detailsClickedEvent.fullName,
        shortName: this.detailsClickedEvent.shortName,
        priority: this.detailsClickedEvent.priority,
        color: this.detailsClickedEvent.color,
        groupId: { id: this.detailsClickedEvent.group.id },
        inSerie: false,
        frequency: 0,
        resourceId: this.detailsClickedEvent.local.id,
        id: this.detailsClickedEvent.id,
      };

      $('#modalDetails').modal('hide');
      $('#modalEdit').modal('show');
    },

    editClass(updateAllEvents) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.newClass.color = this.groups.find(x => x.id === this.newClass.groupId.id).color;
      this.newClass.fullName = this.lessons.find(x => x.id === this.newClass.lessonId.id).fullName;
      this.newClass.shortName = this.lessons.find(x => x.id === this.newClass.lessonId.id).shortName;

      if (updateAllEvents) {
        this.$store.state.class.editMultipleByFields(token, this.newClass)
          .then(result => {
            if (result === true) {

              this.classes
                .filter(x => x.serieId === this.detailsClickedEvent.serieId)
                .forEach(c => {
                  c.color = this.groups.find(x => x.id === this.newClass.groupId.id).color;
                  c.title = this.newClass.lessonId.shortName;
                  c.resourceId = this.newClass.localId.id;
                  c.description = this.newClass.description;
                  c.shortName = this.lessons.find(x => x.id === this.newClass.lessonId.id).shortName;
                });

              this.updateEventsInCalendar();
              this.emitEventForRefreshingHappiness();

            } else {
              this.displayErrorMessage('Edición múltiple', this.$store.state.class.data.error);
            }
          });
      } else {
        this.$store.state.class.edit(token, this.newClass)
          .then(result => {
            if (result === true) {

              let _class = this.classes.find(x => x.id === this.newClass.id);

              _class.color = this.groups.find(x => x.id === this.newClass.groupId.id).color;
              _class.title = this.newClass.lessonId.shortName;
              _class.resourceId = this.newClass.localId.id;
              _class.description = this.newClass.description;
              _class.shortName = this.lessons.find(x => x.id === this.newClass.lessonId.id).shortName;

              this.updateEventsInCalendar();
              this.emitEventForRefreshingHappiness();

            } else {
              this.displayErrorMessage('Edición', this.$store.state.class.data.error);
            }
          });

        this.clearIntoScrolls();
      }


      $('#modalEdit').modal('hide');
    },

    drop_resize(info, allEvents) {
      const originalEvent = this.classes.find(x => x.id === info.event.id);
      const newStartEvent = info.event.startStr;
      const newEndEvent = info.event.endStr;

      let toUpdate = Object.assign({}, originalEvent);
      toUpdate.start = newStartEvent;
      toUpdate.end = newEndEvent;

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      if (allEvents) {
        this.$store.state.class.editMultiple(token, originalEvent.serieId, originalEvent, toUpdate)
          .then(result => {
            if (result === true) {

              const diffInStartHours =
                moment(toUpdate.start)
                  .diff(moment(originalEvent.start), 'second');

              const diffInEndHours =
                moment(toUpdate.end)
                  .diff(moment(originalEvent.end), 'second');

              this.classes
                .filter(x => x.serieId === originalEvent.serieId)
                .forEach(c => {
                  c.start = moment(c.start).add(diffInStartHours, 'second').toDate();
                  c.end = moment(c.end).add(diffInEndHours, 'second').toDate();
                });

              this.updateEventsInCalendar();


            } else {
              info.revert();
              this.displayErrorMessage('Manejo de turnos', this.$store.state.class.data.error);
            }
          });
      } else {
        this.$store.state.class.edit(token, toUpdate)
          .then(result => {
            if (result === true) {
              originalEvent.start = toUpdate.start;
              originalEvent.end = toUpdate.end;

              this.updateEventsInCalendar();
            } else {
              info.revert();
              this.displayErrorMessage('Manejo de turnos', this.$store.state.class.data.error);
            }
          });
      }
    },

    /**
     * Event has already been dropped on a valid date-time.
     */
    eventDrop(info) {
      this.chooseBetweenTurns(info);
    },

    /**
     * Event has been resized.
     */
    eventResize(info) {
      this.chooseBetweenTurns(info);
    },

    chooseBetweenTurns(info) {
      this.$swal.fire({
        title: 'Seleccione los turnos que desea modificar ',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Todos los turnos de la serie',
        denyButtonText: `Solo el actual`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$swal.fire('Todos los turnos de la serie fueron modificados', '', 'success');
          this.drop_resize(info, true);
        } else if (result.isDenied) {
          this.$swal.fire('Solo se modifico el turno actual', '', 'info');
          this.drop_resize(info, false);
        }
      });
    },

    // eventSelected(event, jsEvent, view) {
    //   this.$router.push({ name: 'eventPage', params: { eventId: event.id } });
    // },

    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends; // update a property
    },

    displayErrorMessage(title, text) {
      this.$swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Oops... ${title}`,
        text,
        footer: 'Facultad de Matemática y Computación. UH.',
        timer: 30000,
      });
    },

    addEvent(id, title, start, end, allDay, data, selectInfo, color) {
      this.classes.push(data);
      // this.classes = this.classes.slice().sort((a, b) => b.shortName - a.shortName);

      let calendarApi = selectInfo.view.calendar;
      calendarApi.unselect(); // clear date selection
      if (title) {
        calendarApi.addEvent({
          id,
          title,
          start,
          end,
          allDay,
          color,
          resourceId: data.resourceId,
        });
      }
    },

    checkErrors() {
      // this.errors |= (!this.teachers.some(x => x.selected === true)) ? (1 << 1) : this.errors;
      this.errors |= (this.selectedLesson === '') ? (1 << 2) : this.errors;
      this.errors |= (this.selectedLocal === '') ? (1 << 3) : this.errors;
      this.errors |= (Object.keys(this.newClass.typeClassId).length === 0) ? (1 << 4) : this.errors;
      this.errors |= (this.selectedGroup === '') ? (1 << 5) : this.errors;
      this.errors |= (this.newClass.inSerie && !this.selectedClassFrequency.val) ? (1 << 6) : this.errors;
      this.errors |= (this.newClass.inSerie && this.daysOfWeek.every(x => !x.selected)) ? (1 << 7) : this.errors;

      setTimeout(() => {
        this.errors = 0;
      }, 3000);

      return this.errors > 0;
    },

    emitEventForRefreshingHappiness() {
      console.log('emit event for refresh happiness');
      this.$root.$emit('refresh_happiness');
    },

    async saveClass() {
      if (this.checkErrors()) return;

      $('#modalCreate').modal('hide');
      $('#modalRestrictions').modal('hide');

      this.newClass.lessonId = { id: this.selectedLesson };
      this.newClass.groupId = { id: this.selectedGroup };
      this.newClass.localId = { id: this.selectedLocal };

      const title = this.lessons.find(x => x.id === this.newClass.lessonId.id).fullName;
      const subTitle = this.lessons.find(x => x.id === this.newClass.lessonId.id).shortName;
      let selectInfo = this.actualSelectInfo;

      const startDate = selectInfo.startStr;
      const endDate = selectInfo.endStr;

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.newClass.fullName = title;
      this.newClass.shortName = subTitle;
      this.newClass.priority = 1; // TODO: check this
      this.newClass.start = startDate;
      this.newClass.end = endDate;
      this.newClass.resourceId = this.newClass.localId.id;

      this.selectedTeachers.forEach(s => {
        this.newClass.teacherIds.push({ id: s });
      });

      if (!this.newClass.inSerie) {

        this.$store.state.class.create(token, this.newClass)
          .then(result => {
            if (result === true) {

              this.classes.push({
                ...this.$store.state.class.data,
                fullName: title,
                shortName: subTitle,
              });

              this.updateEventsInCalendar();
              this.emitEventForRefreshingHappiness();

            } else {
              this.displayErrorMessage('Manejo de turnos', this.$store.state.class.data.error);
            }
          });

      } else {
        let days = [];
        this.daysOfWeek.forEach(this.getMarkedData(days));

        this.newClass.frequency = ClassFrequency[this.selectedClassFrequency.val];
        this.newClass.days = days;

        const freezeClass = Object.assign({}, this.newClass);
        Object.freeze(freezeClass);

        this.$store.state.classes.createInSerie(token, this.newClass)
          .then(result => {
            if (result === true) {

              let data = this.$store.state.classes.data;

              for (let i = 0; i < data.length; ++i) {
                const d = data[i];

                const x = {
                  ...freezeClass,
                  fullName: title,
                  shortName: subTitle,
                  id: d.id,
                  start: d.start,
                  end: d.end,
                  color: d.color,
                };

                this.classes.push(x);

              }
              this.updateEventsInCalendar();
              this.emitEventForRefreshingHappiness();

            } else {
              this.displayErrorMessage('Manejo de turnos', this.$store.state.classes.data.error);
            }
          });

        this.clearIntoScrolls();
      }

      this.restore();

      this.makeQuery(); // TODO: handle this.
    },

    restore() {

      this.selectedTeachers = [];
      this.selectedGroup = '';
      this.selectedLesson = '';
      this.selectedLocal = '';

      this.newClass = {
        description: '',
        localId: {},
        lessonId: {},
        typeClassId: {},
        teacherIds: [],
        start: [],
        end: [],
        fullName: '',
        shortName: '',
        priority: '',
        frequency: 0,
        inSerie: false,
      };
    },

    /**
     * Black Cell has been clicked.
     */
    handleDateSelect(selectInfo) {
      this.actualSelectInfo = selectInfo;

      this.selectedTeachers = [];
      this.selectedGroup = '';
      this.selectedLesson = '';
      this.selectedLocal = '';

      $('#modalRestrictions').modal('show');
      $('#modalCreate').modal('show');
    },

    /**
     * Details of event from calendar.
     */
    handleEventClick(info) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.class.getDetails(token, info.event.id)
        .then(result => {
          if (result === true) {
            this.detailsClickedEvent = this.$store.state.class.data;
            this.detailsClickedEvent.info = info;

            $('#modalDetails').modal('show');

          } else {
            this.displayErrorMessage('Manejo de turnos', 'El evento no fue encontrado. Refresque la página');
          }
        });

      // if (confirm(`Are you sure you want to delete the event '${info.event.title}'`)) {
      //   info.event.remove();
      // }
    },

    deleteAllEventsInSerie(serieId, info) {

      let calendarApi = info.view.calendar;

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.classes.deleteInSerie(token, serieId)
        .then(result => {
          if (result === true) {

            let toRemove = this.classes.filter(x => x.serieId === serieId);
            this.classes = this.classes.filter(x => x.serieId !== serieId);

            toRemove.forEach(e => {

              let event = calendarApi.getEventById(e.id);
              event.remove();

            });

            this.emitEventForRefreshingHappiness();

          } else {
            this.displayErrorMessage('Manejo de turnos', this.$store.state.classes.data.error);
          }
        });

    },

    deleteEvent(id, info) {
      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.classes.delete(token, id)
        .then(result => {
          if (result === true) {

            this.classes = this.classes.filter(x => x.id !== id);
            info.event.remove();

            this.emitEventForRefreshingHappiness();

          } else {
            this.displayErrorMessage('Manejo de turnos', this.$store.state.classes.data.error);
          }
        });

    },

    formatDate(date) {
      return moment(date).format('dddd, MMMM Do YYYY, h:mm:ss a');
    },

    /**
     * Event overlap detected.
     */
    eventOverlap(stillEvent, movingEvent) {
      console.log('into event overlap');

      console.log(stillEvent);
      console.log(movingEvent);

      return true; // allow overlap
    },

    handleEvents(events) {

      console.log('into handle events');
      console.log(events);

      this.currentEvents = events;
    },

    download() {

      this.loading = true;

      this.$store.state.profile.loadMinData();
      let token = this.$store.state.profile.data.token;

      this.$store.state.reports.generateExcelReport(token)
        .then(result => {
          if (result === true) {
            const response = this.$store.state.reports.data.data;

            const url = window
              .URL
              .createObjectURL(
                new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report');
            document.body.appendChild(link);

            link.click();
            link.remove();

            this.loading = false;

          }
        });
    },

    resolveGroupName(groupId) {
      let g = this.groups.find(x => x.id == groupId);
      return g.shortName;
    },

    viewPanel() {
      return this.$store.state.profile.hasRole(Permission.VIEW_PANEL);
    },

    getClassFrequency() {
      this.classFrequency = Object.keys(ClassFrequency).map(c => {
        return {
          val: c,
        };
      });
    },

    isLogued() {
      return this.$store.state.profile.isLogued();
    },
  },
  created() {
    this.loading = true;
    this.getClassFrequency();
    this.loadAll();
    this.makeQuery();
  },
  watch: {
    classes: function() {
      this.loading = false;
    },
    selectedTeachers: function() {

      if (!this.selectedTeachers || this.selectedTeachers.length === 0) {
        this.restrictions = [];
        return;
      }

      this.$store.state.restrictions.getDescriptionRestrictions({
        teachers: this.selectedTeachers,
      })
        .then(result => {
          if (result === true) {

            this.restrictions = this.$store.state.restrictions.data[Condition_types.RESTRICTIONS_DESCRIPTIONS];

          } else {
            this.displayErrorMessage('Obtención de restricciones', this.$store.state.classes.data.error);
          }
        });

    },
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
