import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { DatePipe } from '@angular/common';

import { Registro } from 'src/app/interfaces/registro';
import { NotificationsService } from 'src/app/services/notifications.service';
import { RegistroService } from 'src/app/services/registro.service';
import { SearchbarService } from 'src/app/services/searchbar.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  registroList: Registro[] = [];
  registroToEdit: Registro;


  registroFrom: FormGroup;
  constructor(private readonly fb: FormBuilder, private _registroSvc: RegistroService, private _notificationSvc: NotificationsService,
    private _searchbarSvc: SearchbarService) {
    this.registroFrom = this.initForm();
    this.registroToEdit = {} as Registro;
    this._searchbarSvc.searchbarTrigger.subscribe(data => {
      if (data?.length) {
        this.registroList = data;
      } else {
        console.log('update');
        this.updateTableData();
      }
    })
  }

  ngOnInit(): void {
    this.updateTableData();
  }

  initForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      curp: ['', [Validators.required, Validators.pattern('[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$')]]
    })
  }

  onSubmit() {
    console.log(this.registroFrom.value)
    let reg = {} as Registro;
    reg.nombre = this.registroFrom.value.nombre;
    reg.curp = this.registroFrom.value.curp;
    reg.direccion = this.registroFrom.value.direccion;
    reg.telefono = this.registroFrom.value.telefono;
    reg.fechaRegistro = new Date();
    this._registroSvc.postRegistro(reg).subscribe({
      next: (data) => {
        this._notificationSvc.successNotification("Registro añadido");
        this.updateTableData();
      }, error: (e) => {
        this._notificationSvc.failNotification("Ocurrio un error");
      }
    })
  }

  onSubmitEdit() {
    console.log(this.registroFrom.value)
    let reg = {} as Registro;
    reg.nombre = this.registroFrom.value.nombre;
    reg.curp = this.registroFrom.value.curp;
    reg.direccion = this.registroFrom.value.direccion;
    reg.telefono = this.registroFrom.value.telefono;
    reg.id = this.registroToEdit.id;
    reg.fechaRegistro = this.registroToEdit.fechaRegistro;
    this._registroSvc.putRegistro(reg).subscribe({
      next: (data) => {
        this._notificationSvc.successNotification("Registro editado");
        this.updateTableData();
      }, error: (e) => {
        this._notificationSvc.failNotification("Ocurrio un error");
      }
    })

  }

  removeRegistro(id: number) {
    this._notificationSvc.questionNotification('No podrás revertir este cambio').then((result) => {
      if (result.isConfirmed) {
        this._registroSvc.deleteRegistro(id).subscribe({
          next: (data) => {
            this._notificationSvc.successNotification("Registro eliminado");
            this.updateTableData();
          }, error: (e) => {
            this._notificationSvc.failNotification("Ocurrio un error");
          }
        })
      }
    })
  }

  setRegistroToEdit(data: Registro) {
    this.registroToEdit = data;
    this.registroFrom.controls['nombre'].setValue(data.nombre);
    this.registroFrom.controls['curp'].setValue(data.curp)
    this.registroFrom.controls['direccion'].setValue(data.direccion)
    this.registroFrom.controls['telefono'].setValue(data.telefono)
  }

  updateTableData() {
    this._registroSvc.getRegistros().subscribe({
      next: (data) => {
        this.registroList = data;
      }, error: (e) => {
        this._notificationSvc.failNotification("Ocurrio un error al conectarse a la base de datos");
      }
    })
  }
  clearRegistro() {
    this.registroFrom.controls['nombre'].setValue('');
    this.registroFrom.controls['curp'].setValue('')
    this.registroFrom.controls['direccion'].setValue('')
    this.registroFrom.controls['telefono'].setValue('')
  }
}
