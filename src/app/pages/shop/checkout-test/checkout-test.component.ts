import { Component, OnInit } from '@angular/core';
import { AnuncioService } from '../../../services/anuncio.service';
import { PaymentDatos } from '../../../models/payment_datos.model';
import { CustomerPayment } from '../../../models/customer_payment.model';

@Component({
  selector: 'app-checkout-test',
  templateUrl: './checkout-test.component.html',
  styles: [
  ]
})
export class CheckoutTestComponent implements OnInit {

  datos_pago: PaymentDatos = {};
  cliente: CustomerPayment = {};
  token_formulario: string = ''

  constructor(
    private _anuncioService: AnuncioService
  ) { }

  ngOnInit(): void {
    this.generarFormPago();
    // Codificar base64
    //console.log(btoa("45144874:testpassword_uB6CLf1ivL39uJ5Poo0sB2c4hzSTTqyWZhFUvrNm7unns"));
    // Decodificar base64
    //console.log(atob("NDUxNDQ4NzQ6dGVzdHBhc3N3b3JkX3VCNkNMZjFpdkwzOXVKNVBvbzBzQjJjNGh6U1RUcXlXWmhGVXZyTm03dW5ucw==")); 
  }

  generarFormPago() {

  this.datos_pago.amount = 180;
  this.datos_pago.currency = 'PEN';
  this.datos_pago.orderId = 'myOrderId-999999';

  this.cliente.email = 'sample@example.com';

  this.datos_pago.customer = this.cliente;

   /* this._anuncioService.generarFormPago(this.datos_pago)
   .subscribe((resp: any) => {
     this.token_formulario = resp.data.answer.formToken;
     this.displayPaymentForm(resp.data.answer.formToken)
   }) */

  }


  /* displayPaymentForm(formToken: any) {
    // Mostrar el formulario de pago
    document.getElementById('paymentForm').style.display = 'block';

    // Establecer token de formulario
    KR.setFormToken(formToken);

    // Agregar oyente para el evento de envío
    KR.onSubmit(this.onPaid);
  }


  onPaid(event: any) {
    if (event.clientAnswer.orderStatus === "PAID") {
      // Remove the payment form
      KR.removeForms();
  
      // Show success message
      document.getElementById("paymentSuccessful").style.display = "block";
    } else {
      // Show error message to the user
      alert("Payment failed !");
    }
  } */

}
