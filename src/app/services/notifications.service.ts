import { Injectable } from '@angular/core';

import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

  successNotification(text: string) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: text,
      showConfirmButton: false,
      timer: 1500
    })
  }

  failNotification(text: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: text,
      confirmButtonColor: '#d33'
    })
  }

  questionNotification(text: string) {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1B75BC',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    })
    
  }
}
