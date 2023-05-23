import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Consulta } from 'src/app/models/Consulta';
import { Medico } from 'src/app/models/medico';
import { ListMedicosService } from 'src/app/services/medico.service';

import { ConsultaService } from '../../services/consulta.service';
import { ModalCreateConsultaComponent } from './modal-create-consulta/modal-create-consulta.component';
import { ModalEditConsultaComponent } from './modal-edit-consulta/modal-edit-consulta.component';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultasComponent implements OnInit {

  faCirclePlus = faCirclePlus;

  selectInfo!: DateSelectArg;

  consultas: Consulta[] = [];

  medicos: Medico[] = [];

  filteredMedicos: Medico[] = [];

  medicoSelect: FormControl = new FormControl(null, Validators.required);

  medico!: Medico;

  INITIAL_EVENTS: EventInput[] = [];


  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',

    },
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      list: 'Lista'
    },
    allDayText: 'Dia inteiro',
    noEventsText: 'Nenhum evento agendado para exibir.',
    locale: 'pt-br',
    initialView: 'timeGridWeek',
    events: this.INITIAL_EVENTS,
    hiddenDays: [0, 6],
    slotMinTime: '07:00',
    slotMaxTime: '19:00',
    businessHours: {
      startTime: '07:00',
      endTime: '19:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    //eventColor: '#378006',
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private consultaService: ConsultaService,
    private listMedicosService: ListMedicosService,
    public dialog: MatDialog,
    ) {

  }

  ngOnInit(): void {
    this.findAllMedicos();
  }

  openModalCreate(): void {
    this.dialog.open(ModalCreateConsultaComponent, {
      maxWidth: '600px',
      maxHeight: '700px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
    });

    const medicoGlobal = this.listMedicosService.medicoGlobal.getValue().id;
    if(medicoGlobal != undefined) {
      this.dialog.afterAllClosed.subscribe(() => {
        this.findAllConsultasByMedico(medicoGlobal);
      });
    }

  }

  openModalEdit(consultaId: Number | String): void {
    this.dialog.open(ModalEditConsultaComponent, {
      maxWidth: '600px',
      maxHeight: '380px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
      data: { id: consultaId }
    });

  }

  findAllMedicos(): void {
    this.listMedicosService.findAll().subscribe(data => {
      this.medicos = data;
      this.filteredMedicos = this.medicos;
    });
  }

  findAllConsultasByMedico(id: number): void {
    this.listMedicosService.findById(id).subscribe(response => {
      this.listMedicosService.medicoGlobal.next(response);
    });

    this.consultaService.findAllByMedico(id).subscribe(data => {
      this.consultas = data;

      const events = this.consultas.map((c) => {
        return {
          id: c.id.toString(),
          title: c.paciente.nome,
          start: c.data,
          end: c.data_termino,
        };
      });

      this.INITIAL_EVENTS = [];
      this.INITIAL_EVENTS = [...this.INITIAL_EVENTS, ...events];

      this.calendarOptions.events = this.INITIAL_EVENTS;
    });
  }

  changeFilteredMedicos(value: any) {
    console.log(value);
    if(value != '' || value != undefined)
      this.filteredMedicos = this.filterMedico(value);
  }

  filterMedico(nome: string) {
    let filter = nome.toLowerCase();
    return this.medicos.filter(option => option.nome.toLowerCase().startsWith(filter));
  }

  getMedicoAgenda(id: number): void {
    alert(id + ' - FUI SELECIONADO!')
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log(selectInfo)
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: "1111",
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
      setTimeout(() => {
        console.log(this.INITIAL_EVENTS);

      }, 300);
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.openModalEdit(clickInfo.event.id)
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.cdr.detectChanges();
  }

}
