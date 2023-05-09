import interactionPlugin from '@fullcalendar/interaction';

import { Component, ChangeDetectorRef, OnInit, ViewEncapsulation, ElementRef, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ConsultaService } from '../../services/consulta.service';
import { Consulta } from 'src/app/models/Consulta';
import { DOCUMENT } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { Medico } from 'src/app/models/medico';
import { ListMedicosService } from 'src/app/services/medico.service';
import { Observable, map, startWith } from 'rxjs';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ModalCreateConsultaComponent } from './modal-create-consulta/modal-create-consulta.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    private elementRef: ElementRef,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    ) {

  }

  ngOnInit(): void {
    this.findAllMedicos();
  }

  ngAfterViewInit() {
    this.styleCalendar();
  }

  openModal(): void {
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
    this.styleCalendar();
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
    this.styleCalendar();
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
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.id}'`)) {
      clickInfo.event.remove();
    }
    this.styleCalendar();
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.cdr.detectChanges();
    this.styleCalendar();
  }

  styleCalendar() {
    const elements_1 = this.elementRef.nativeElement.querySelectorAll('.fc-event-content, .fc-event-time, .fc-event-title, .fc-list-event-time');
    for (const element of elements_1) {
      element.className = "";
      element.classList.add('fc-event');
    }

    const elements_2 = this.elementRef.nativeElement.querySelectorAll('.fc-button-primary');
    for (const element of elements_2) {
      element.classList.add('fc-button-primary');
    }

    const elements_3 = this.elementRef.nativeElement.querySelectorAll('.fc-day-today .fc-daygrid-day-frame, .fc-day-today');
    for (const element of elements_3) {
      element.classList.add('fc-today');
    }

    const elements_4 = this.elementRef.nativeElement.querySelector('.fc-button-active');
    elements_4.classList.add('fc-button-active');

    const elements_5 = this.elementRef.nativeElement.querySelectorAll('.fc-scroller');
    for(const element of elements_5) {
      element.classList.add('fc-custom-scrollbar');
    }

  }
}
