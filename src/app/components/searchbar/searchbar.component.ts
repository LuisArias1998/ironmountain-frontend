import { Component } from '@angular/core';
import { Registro } from 'src/app/interfaces/registro';
import { NotificationsService } from 'src/app/services/notifications.service';
import { RegistroService } from 'src/app/services/registro.service';
import { SearchbarService } from 'src/app/services/searchbar.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {

  curpExpression: RegExp;
  telefonoExpression: RegExp;
  constructor(private _searchbarSvc: SearchbarService, private _registroSvc: RegistroService, private _notificationSvc: NotificationsService) {
    this.curpExpression = new RegExp('[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$');
    this.telefonoExpression = new RegExp('^[0-9]{10}$')
  }

  onKeydown(event: any) {

    let nombre: string = event?.target?.value;
    this._searchbarSvc.getRegistroByName(nombre).subscribe({
      next: (data) => {
        this._searchbarSvc.searchbarTrigger.emit(data);
      }, error: (e) => {
        console.log("error")
      }
    })

  }

  clearData() {
    this._searchbarSvc.searchbarTrigger.emit(null);
  }

  onChange(event: any) {
    let target: FileList = event?.target?.files;
    if (target != null && target.length > 0) {
      let file: File = target.item(0)!;
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: string = reader.result as string;
        let dataToPush = this.csvToArr(csv, ',')
        dataToPush = dataToPush.filter(d => d.nombre && d.curp && d.direccion && d.telefono && d.fechaRegistro)
        if (dataToPush.length > 0) {
          this._registroSvc.postRegistroList(dataToPush).subscribe({
            next: (data) => {
              console.log(data);
              this._notificationSvc.successNotification('Registro(s) añadido(s) exitosamente');
              this._searchbarSvc.searchbarTrigger.emit(null);
            }, error: (e) => {
              this._notificationSvc.failNotification('Ocurrió un error')
            }
          });
        }else{
          this._notificationSvc.failNotification('Registro(s) no valido(s)')
        }

      }
    }
  }
  csvToArr(stringVal: string, splitter: string) {
    const [keys, ...rest] = stringVal.trim().split("\n").map((item) => item.split(splitter));
    let isValid: boolean = true;
    console.log(keys);
    console.log(rest);
    const formedArr = rest.map((item) => {
      const registroRecord: Registro = {} as Registro;
      keys.forEach((key: string, index) => {
        let value = item.at(index)?.replace(/\r?\n|\r/, "")
        console.log(value);
        if (value && key.toUpperCase().includes("NOMBRE")) {
          registroRecord.nombre = value
        } else if (value && key.toUpperCase().includes("CURP")) {
          if (this.curpExpression.test(value)) {
            registroRecord.curp = value
          }
        } else if (value && key.toUpperCase().includes("TELEFONO")) {
          if (this.telefonoExpression.test(value)) {
            registroRecord.telefono = +value
          }
        } else if (value && key.toUpperCase().includes("DIRECCION")) {
          registroRecord.direccion = value
        }
        if (value) {
          registroRecord.fechaRegistro = new Date();
        }
      });
      return registroRecord;
    });
    console.log(formedArr);

    return formedArr;
  }
}
