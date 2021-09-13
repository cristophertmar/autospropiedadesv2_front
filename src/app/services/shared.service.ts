import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }


  alert_success(mensaje: string){
    Swal.fire({
      text: mensaje,
      width: 350,
      padding: 5,
      timer: 1000,
      allowOutsideClick: false,
      showConfirmButton: false,
      icon: 'success'
    });
  }

  alert_error(mensaje: string){
    Swal.fire({
      text: mensaje,
      width: 350,
      padding: 5,
      timer: 1500,
      allowOutsideClick: false,
      showConfirmButton: false,
      icon: 'error'
    });
  }

  alert_info_sbutton(mensaje: string){
    Swal.fire({
      text: mensaje,
      width: 350,
      padding: 5,
      timer: 1500,
      allowOutsideClick: false,
      showConfirmButton: false,
      icon: 'info'
    });
  }

  alert_info(mensaje: string){
    Swal.fire({
      text: mensaje,
      width: 350,
      padding: 5,
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: "De acuerdo", 
      icon: 'info',
      confirmButtonColor: "#266CFB",
    });
  }

  alert_toast_success(mensaje: string){
    Swal.fire({
      text: mensaje,
      width: 350,
      padding: 5,
      timer: 1000,
      allowOutsideClick: false,
      showConfirmButton: false,
      position: 'bottom-right',
      toast: true,
      icon: 'success',
      timerProgressBar: true
    });
  }



}
