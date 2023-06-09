import {
  NGX_MAT_DATE_FORMATS,
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentAdapter } from '@angular-material-components/moment-adapter';
import { CdkScrollable } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ConsultasComponent } from './components/consultas/consultas.component';
import { ModalCreateConsultaComponent } from './components/consultas/modal-create-consulta/modal-create-consulta.component';
import { ModalEditConsultaComponent } from './components/consultas/modal-edit-consulta/modal-edit-consulta.component';
import { HomeComponent } from './components/home/home.component';
import { ListMedicosComponent } from './components/list-medicos/list-medicos.component';
import { ListPacientesComponent } from './components/list-pacientes/list-pacientes.component';
import { LoginComponent } from './components/login/login.component';
import { ModalCreateMedicoComponent } from './components/modal-create-medico/modal-create-medico.component';
import { ModalCreatePacienteComponent } from './components/modal-create-paciente/modal-create-paciente.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ModalCreateUsuarioComponent } from './components/usuarios/modal-create-usuario/modal-create-usuario.component';
import { ModalEditUsuarioComponent } from './components/usuarios/modal-edit-usuario/modal-edit-usuario.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { AuthGuard } from './guard/auth.guard';
import { RoleGuard } from './guard/role.guard';
import { AuthInterceptorProvider } from './interceptors/auth-interceptor';
import { UnauthorizedInterceptorProvider } from './interceptors/unauthorized-interceptor';
import { ModalEditPacienteComponent } from './components/list-pacientes/modal-edit-paciente/modal-edit-paciente.component';
import { CustomMatPaginatorIntl } from './utils/custom-mat-paginator-intl_';
import { ModalEditMedicoComponent } from './components/list-medicos/modal-edit-medico/modal-edit-medico.component';








const MY_NGX_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS"
  },
  display: {
    dateInput: "DD/MM/yyyy - HH:mm",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', component: NavbarComponent, canActivate: [AuthGuard],  children: [
    { path: 'home', component: HomeComponent },
    { path: 'medicos', component: ListMedicosComponent},
    { path: 'pacientes', component: ListPacientesComponent },
    { path: 'consultas', component: ConsultasComponent },
    { path: 'usuarios', component: UsuariosComponent, canActivate: [RoleGuard]},
  ]},

];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ListMedicosComponent,
    ModalCreateMedicoComponent,
    LoginComponent,
    ListPacientesComponent,
    ModalCreatePacienteComponent,
    ConsultasComponent,
    ModalCreateConsultaComponent,
    ModalEditConsultaComponent,
    UsuariosComponent,
    ModalCreateUsuarioComponent,
    ConfirmationDialogComponent,
    ModalEditUsuarioComponent,
    ModalEditPacienteComponent,
    ModalEditMedicoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatGridListModule,
    MatListModule,
    ToastrModule.forRoot(),
    MatProgressSpinnerModule,
    FullCalendarModule,
    MatAutocompleteModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    ImageCropperModule,
    MatMenuModule,
    MatDividerModule,
    MatCheckboxModule,
    MatTooltipModule

  ],
  entryComponents: [ModalCreateConsultaComponent],
  providers: [AuthInterceptorProvider, UnauthorizedInterceptorProvider, CdkScrollable, {
    provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl
  },
  {
    provide: NgxMatDateAdapter,
    useClass: NgxMatMomentAdapter, //Moment adapter
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  },
  { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  { provide: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS], useClass: MomentDateAdapter },
  { provide: NGX_MAT_DATE_FORMATS, useValue: MY_NGX_DATE_FORMATS },
  { provide: LOCALE_ID, useValue: 'pt-BR',}],
  bootstrap: [AppComponent]
})
export class AppModule { }
