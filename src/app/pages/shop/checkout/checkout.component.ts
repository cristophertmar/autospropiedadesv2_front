import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { AnuncioService } from 'src/app/services/anuncio.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../../services/shared.service';
import { Facturacion } from '../../../models/facturacion.model';
import { FacturacionService } from '../../../services/facturacion.service';
import { PaymentDatos } from 'src/app/models/payment_datos.model';
import { CustomerPayment } from 'src/app/models/customer_payment.model';

import KRGlue from "@lyracom/embedded-form-glue";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styles: [
  ]
})
export class CheckoutComponent implements OnInit {

  formulario: FormGroup;
  departamentos: Ubigeo[];
  provincias: Ubigeo[];
  distritos: Ubigeo[];

  cantidad_prop: number = 0;
  cantidad_veh: number = 0;
  
  subtotal: number = 0;
  igv: number = 0;
  costo_total: number = 0;

  public payPalConfig?: IPayPalConfig;
  token: string;
  monto: number;

  @ViewChild('cerrar_mdl_pago') cerrar_mdl_pago: ElementRef<HTMLElement>;
  @ViewChild('abrir_mdl_pago') abrir_mdl_pago: ElementRef<HTMLElement>;

  datos_pago: PaymentDatos;

  constructor(
    private _router: Router,
    public _ubigeoService: UbigeoService,
    private _anuncioService: AnuncioService,
    private _spinner: NgxSpinnerService,
    private _shared: SharedService,
    private _facturacionService: FacturacionService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.listarDepartamentos();
    this.DepartamentoListener();
    this.ProvinciaListener();
    this.sumar_planes();
  }

  procesar() {

    if ( this.formulario.invalid) {
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    //this.initConfig(this.monto);
    this.initConfig(1);
    this.abrir_mdl_pago.nativeElement.click();

  }

  sumar_planes() {

    this._anuncioService.ids_propiedades
    .forEach(propiedad => {
      this.cantidad_prop += 1;
      this.costo_total += 129;
    });

    this._anuncioService.ids_autos
    .forEach(vehiculo => {
      this.cantidad_veh += 1;
      this.costo_total += 49;
    });


    this.costo_total = this._anuncioService.esanuncio ? 300 : this.costo_total;

    this.calcular_subtotal_igv();

    this.datos_pago = new PaymentDatos();
    const customer = new CustomerPayment('test@test.com');

    this.datos_pago.amount = Number(((this.costo_total).toFixed(2)).replace('.', ''));
    this.datos_pago.currency = 'PEN';
    this.datos_pago.orderId = 'orderCode';
    this.datos_pago.customer = customer;

    this.obtener_formularioPago(this.datos_pago);

    console.log(this.datos_pago);

  } 

  obtener_formularioPago(datos_pago: PaymentDatos) {
    this._anuncioService.generarFormPago(datos_pago)
    .subscribe( (resp: any) => {
        console.log(resp.data.answer.formToken);
        this.crear_formularioPago(resp.data.answer.formToken);
    });
  }

  crear_formularioPago(formToken: any) {
    const endpoint = "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js";
    const publicKey = "45144874:testpublickey_b5dynPqWER0JLbkwmveBCNCRirZBYW8jfWLsNDcdQaICp";
    
    KRGlue.loadLibrary(endpoint, publicKey)
        .then(({KR}) => KR.setFormConfig({
          formToken: formToken,
          'kr-language': 'es-PE',
        }))
        .then(({KR}) => KR.onSubmit((resp: any) => {
          //console.log(resp.clientAnswer.transactions[0].uuid);
          this.verificar_uuid(resp.clientAnswer.transactions[0].uuid);
          return false
        }))
        .then(({KR}) => KR.addForm('#myPaymentForm'))
        .then(({KR, result}) => KR.showForm(result.formId));
  }

  verificar_uuid(uuid: string) {
    this._anuncioService.verificar_uuid(uuid)
    .subscribe( resp => {
      this.notificar_pago();
    });    
  }

  calcular_subtotal_igv() {
    this.igv = this.costo_total * 0.18;
    this.subtotal = this.costo_total - this.igv;
    this.monto = this.costo_total / 4;
  }

  crearFormulario() {
    this.formulario = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellido: new FormControl(null, [Validators.required]),
      razon_social: new FormControl(null, [Validators.required]),

      departamento: new FormControl('', [Validators.required,Validators.minLength(1)]),
      provincia: new FormControl('', [Validators.required, Validators.minLength(1)]),
      distrito: new FormControl('', [Validators.required, Validators.minLength(6)]),
      direccion: new FormControl(null, [Validators.required]),

      celular: new FormControl(null, [Validators.required]),
      correo: new FormControl(null, [Validators.required]),
      adicional: new FormControl(null)
    });
  }

  get nombreNoValido() {
    return this.formulario.get('nombre').invalid && this.formulario.get('nombre').touched;
  }
  get apellidoNoValido() {
    return this.formulario.get('apellido').invalid && this.formulario.get('apellido').touched;
  }
  get razon_socialNoValido() {
    return this.formulario.get('razon_social').invalid && this.formulario.get('razon_social').touched;
  }
  get departamentoNoValido() {
    return this.formulario.get('departamento').invalid && this.formulario.get('departamento').touched;
  }
  get provinciaNoValido() {
    return this.formulario.get('provincia').invalid && this.formulario.get('provincia').touched;
  }
  get distritoNoValido() {
    return this.formulario.get('distrito').invalid && this.formulario.get('distrito').touched;
  }
  get direccionNoValido() {
    return this.formulario.get('direccion').invalid && this.formulario.get('direccion').touched;
  }
  get celularNoValido() {
    return this.formulario.get('celular').invalid && this.formulario.get('celular').touched;
  }
  get correoNoValido() {
    return this.formulario.get('correo').invalid && this.formulario.get('correo').touched;
  }
  get adicionalNoValido() {
    return this.formulario.get('adicional').invalid && this.formulario.get('adicional').touched;
  }

  DepartamentoListener() {
    this.formulario.get('departamento').valueChanges.subscribe( (valor: string) => {
      this.listarProvincias(valor);
    });
  }

  ProvinciaListener() {
    this.formulario.get('provincia').valueChanges.subscribe( (valor: string) => {
      this.listarDistritos(valor);
    });
  }


  listarDepartamentos() {
    this._ubigeoService.listarDepartamentos()
    .subscribe( (resp: any) => {
      this.departamentos = resp.data;      
    });
  }

  listarProvincias(departamento: string) {
    this._ubigeoService.listarProvincias(departamento)
    .subscribe( (resp: any) => {
      this.provincias = resp.data;
    });
  }

  listarDistritos(provincia: string) {
    this._ubigeoService.listarDistritos(provincia)
    .subscribe( (resp: any) => {
      this.distritos = resp.data;
    });
  }


  private initConfig(monto: number): void {
    this.payPalConfig = {
        currency: 'USD',
        /* clientId: environment.clientId, */
        //clientId: 'AfNOLEiSlYupQk67q9ZGORLfTf_IJljc7uzjIDJIbpDuzP8zY9MO1FZHoofBfS_7mbR7XJU3YCJAFC8f',
        clientId: 'ATRAzp9PsZ1BksKyh30Go8AOk6wHyXoHuRu_E_oq6sWnP8dtx8wRgOkvg5yOXAdHuF9fJB_eCcM8Y_ZR',
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        createOrderOnClient: (data) => < ICreateOrderRequest > <unknown>{
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: monto,
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: monto
                        }
                    }
                },
                items: [{
                    name: 'Proceso de pago publicitario',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'USD',
                        value: monto,
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            // console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details: any) => {
                // console.log('onApprove - you can get full order details inside onApprove: ', details);
                this._spinner.show();
            });

        },
        onClientAuthorization: (data) => {
            // console.log('onClientAuthorization - you should probably
            // inform your server about completed transaction at this point', data);
            if (data.status === 'COMPLETED') {
                this.notificar_pago();
            }
        },
        onCancel: (data, actions) => {
            // console.log('OnCancel', data, actions);
            this._spinner.hide();
        },
        onError: err => {
            // console.log('OnError', err);
            this._spinner.hide();
            this._shared.alert_error('Ocurrió un problema al realizar el pago');
        },
        onClick: (data, actions) => {
            // console.log('onClick', data, actions);
        },
    };
}

  notificar_pago() {

    /* if ( this.formulario.invalid) {
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    } */

    const facturacion = new Facturacion(
      this.formulario.value.nombre,
      this.formulario.value.apellido,
      this.formulario.value.razon_social,
      this.formulario.value.distrito,
      this.formulario.value.direccion,
      this.formulario.value.celular + '',
      this.formulario.value.correo,
      '',
      sessionStorage.getItem('ids_autos') || '[]',
      sessionStorage.getItem('ids_propiedades') || '[]',
      this.costo_total
    )

    console.log(facturacion);

    this._facturacionService.nueva_facturacion(facturacion)
    .subscribe(resp => {

      this._anuncioService.ids_autos.forEach(id => {
        this._anuncioService.activar_anuncio(id, 'auto', true).subscribe();
      });

      this._anuncioService.ids_propiedades.forEach(id => {
        this._anuncioService.activar_anuncio(id, 'propiedad', true).subscribe();
      });

      this.cerrar_mdl_pago.nativeElement.click();
      this._anuncioService.limpiar_storage();
      this._anuncioService.limpiar_carrito();
      this._shared.alert_success('Transacción exitosa');
      this._router.navigate(['/mis-publicaciones']);   

    });


      
        

  }






}
