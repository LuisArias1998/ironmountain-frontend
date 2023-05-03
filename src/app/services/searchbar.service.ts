import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment.prod';
import { Registro } from '../interfaces/registro';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchbarService {

  _URL: string;
  @Output() searchbarTrigger: EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) {
    this._URL = environment.endpoint;
  }

  getRegistroByName(name:string):Observable<Registro[]>{
    console.log(name)
    return this.http.get<Registro[]>(`${this._URL}get/${name}`);
  }

  


}
