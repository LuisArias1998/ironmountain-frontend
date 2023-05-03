import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment.prod';
import { Registro } from '../interfaces/registro';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  _URL: string;
  constructor(private http:HttpClient) {
    this._URL = environment.endpoint;
  }

  getRegistros():Observable<Registro[]>{
    return this.http.get<Registro[]>(`${this._URL}get`);
  }

  putRegistro(registro:Registro):Observable<void>{
    return this.http.put<void>(`${this._URL}put`,registro);
  }

  postRegistro(registro:Registro):Observable<void>{
    return this.http.post<void>(`${this._URL}add`,registro);
  }

  postRegistroList(registro:Registro[]):Observable<Registro[]>{
    console.log(registro);
    return this.http.post<Registro[]>(`${this._URL}addList`,registro);
  }


  deleteRegistro(id:number):Observable<void>{
    return this.http.delete<void>(`${this._URL}remove/${id}`)
  }
  
}
