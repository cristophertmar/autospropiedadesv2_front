import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { SharedService } from '../../../services/shared.service';
import { Propiedad } from '../../../models/propiedad.model';
import { PropiedadService } from '../../../services/propiedad.service';

import { Observable, Subject, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as JSZip from 'jszip';
import { ZipFile } from 'src/app/models/zip.model';
import { ZipFilePost } from '../../../models/zip_post.model';
import { Router } from '@angular/router';

/* export interface ZipFile {
  readonly name: string;
  readonly dir: boolean;
  readonly date: Date;
  readonly data: any;
} */

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: [
  ]
})
export class CargaComponent implements OnInit {

  spinnerEnabled = false;
  keys: string[];
  data: any = [];
  registros_nuevos: number = 0;
  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('inputFile2') inputFile2: ElementRef;
  isExcelFile: boolean;

  $zipFiles: Observable<ZipFile[]>;
  files: ZipFile[] = [];
  files_post: ZipFilePost[] = [];

  propiedades: Propiedad[] = [];

  propiedades_admitidas: number = 0;
  imagenes_admitidas: number = 0;

  serial = '';

  constructor(
    private _shared: SharedService,
    private _propiedadService: PropiedadService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.obtener_plan();
    this.construir_serial();
  }

  construir_serial() {
    var d = new Date,
   /*dformat = [d.getMonth()+1, d.getDate(), d.getFullYear()].join('-')+' '+
              [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');*/
    dformat = [d.getDate(), d.getMonth()+1, d.getFullYear(), d.getHours(), d.getMinutes(), d.getSeconds()].join('-');
    this.serial = dformat;
  }

  obtener_plan() {

    const plan = sessionStorage.getItem('anuncio_plan')

    if(plan) {
      switch (plan) {
        case 'premium10':
          this.propiedades_admitidas = 10;
          this.imagenes_admitidas = 100;
          break;
        case 'premium5':
          this.propiedades_admitidas = 5;
          this.imagenes_admitidas = 50;
          break;
        case 'basico10':
          this.propiedades_admitidas = 10;
          this.imagenes_admitidas = 30;
          break;
        case 'basico5':
          this.propiedades_admitidas = 5;
          this.imagenes_admitidas = 15;
          break;      
        default:
          this._router.navigate(['/anuncio/seleccionar']);
          break;
      }

    } else {
      this._router.navigate(['/anuncio/seleccionar']);
    }
    
  }

  ngOnFile(event: any): void {

  setTimeout(() => {
    this.listar_archivos();
  }, 1000);


    const fileList = event.target.files;
    const zipLoaded = new JSZip();
    this.$zipFiles = from(zipLoaded.loadAsync(fileList[0])).pipe(
      switchMap((zip: any):Observable<ZipFile[]> => {
        return of(Object.keys(zip.files).map((key)=>zip.files[key]))
      })
    )
  }

  renderizar_ruta(cadena: string): string {
    var divisiones = cadena.split('/');
    divisiones = divisiones.slice(divisiones.length - 2);
    var ruta = "Resource/PropiedadesFile/" +  divisiones[0] + '/' + divisiones[1];
    return ruta;
  }

  renderizar_carpeta(cadena: string): string {
    var divisiones = cadena.split('/');
    divisiones = divisiones.slice(divisiones.length - 2);
    return divisiones[0];
  }

  listar_archivos() {     

    this.$zipFiles.forEach(files => {   
      this.files = files;
      console.log(this.files);
      this.listar_archivos2();
    });
    
  }

  listar_archivos2() {
    let extension = "";
    this.files.forEach(file => {
      extension = file.name.substring(file.name.length - 4)
      if(extension === '.png' || extension === '.jpg' || extension === '.jpeg') {

        this.construir_serial();
        const ruta = [this.serial, file.name].join('/'); //this.renderizar_ruta(file.name);
        const carpeta = this.renderizar_carpeta(file.name);

        let zip = new ZipFilePost();
        zip.ruta = ruta;
        zip.carpeta = carpeta;

        this.files_post.push(zip);
      }
    });
    
  }


  ngOnUpload(data: any) {}

  onChange(evt: any) {
    let header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.data = XLSX.utils.sheet_to_json(ws, {header: ['titulo', 'descripcion',
                                                          'id_tipo_operacion', 'id_tipo_inmueble', 'antiguedad',
                                                          'departamento', 'provincia', 'distrito', 'direccion', 'piso', 'referencia',
                                                          'tipo_moneda', 'precio',
                                                          'area_total', 'area_contruida', 'dormitorios', 'banios', 'cocheras', 'pisos',
                                                          'ascensores', 'mantenimiento', 'uso_profesional', 'uso_comercial', 'mascotas',
                                                          'nombre_contacto', 'nrotelefono1_contacto', 'nrotelefono2_contacto', 'correo_contacto', 'tipo_anunciante',], raw: false });
        console.log(this.data);
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(this.data[0]);
      }
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  removeData() {
    this.inputFile.nativeElement.value = '';
    this.data = [];
    this.keys = null;
  }

  adjuntar_excel() {
    this.inputFile.nativeElement.click();
  }

  adjuntar_zip() {
    this.inputFile2.nativeElement.click();
  }

  obtener_tipo_operacion() {

  }

  cargar() {
    //this.propiedades_admitidas
    //this.imagenes_admitidas

   /*  if(this.data.length !== this.propiedades_admitidas) {
      this._shared.alert_info('Debe ingresar un total de ' + this.propiedades_admitidas + ' propiedades');
      this.removeData();
      return;
    } */

    if(this.data.length > 0) {
      this.data.splice(0, 1);

      for (let i = 0; i < this.data.length; i++ ) {
        const nro_registro = i + 1;
        const tipo_operacion_validos = ['venta', 'alquiler', 'alquiler temporal', 'proyecto'];
        const tipo_inmueble_validos = ['departamento', 'casa', 'terreno / lote temporal', 'local comercial', 'casa de campo', 'casa de playa', 'cocheras', 'condominio de casas', 'condominio de edificios', 'edificios', 'habitación', 'hotel', 'local industrial', 'proyecto de lotes', 'proyecto horizontal-vertical', 'proyecto vertical', 'terreno agrícola'];
        const antiguedad_valida = ['en construcción', 'a estrenar', 'hasta 5 años', 'entre 5 y 10 años', 'entre 10 y 20 años', 'entre 20 y 25 años', 'más de 50 años'];
        const tipo_moneda_valida = ['PEN', 'USD'];
        const confirmacion_valida = ['sí', 'no'];
        const tipo_anunciante_validos = ['dueño directo', 'empresa'];

        let propiedad = new Propiedad();

        propiedad.id_tarifa = 1;
        propiedad.usuario_id = 1;

        // Validaciones
        if(this.data[i].titulo.length === 0) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' debe tener título');
          this.removeData();
          return;
        } 

        if(this.data[i].descripcion.length === 0) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' debe tener descripción');
          this.removeData();
          return;
        }

        if(!tipo_operacion_validos.includes((this.data[i].id_tipo_operacion).toLowerCase())) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' no poseé un tipo de operación válido. Valores aceptados: ' + tipo_operacion_validos);
          this.removeData();
          return;
        }

        if(!tipo_inmueble_validos.includes((this.data[i].id_tipo_inmueble).toLowerCase())) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' no poseé un tipo de inmueble válido. Valores aceptados: ' + tipo_inmueble_validos);
          this.removeData();
          return;
        }

        if(!antiguedad_valida.includes((this.data[i].antiguedad).toLowerCase())) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' no poseé una antigüedad válida. Valores aceptados: ' + antiguedad_valida);
          this.removeData();
          return;
        }

        const existe_departamento = this.lista_ubigeo.find( ubigeo => (ubigeo.departamento).toLowerCase() === (this.data[i].departamento).toLowerCase());

        if(!existe_departamento) {         
          this._shared.alert_info('Ingrese correctamente el departamento del registro ' + nro_registro);
          this.removeData();
          return;
        }

        const existe_provincia = this.lista_ubigeo.find( ubigeo => (ubigeo.departamento).toLowerCase() === (this.data[i].departamento).toLowerCase() && (ubigeo.provincia).toLowerCase() === (this.data[i].provincia).toLowerCase());
        
        if(!existe_provincia) {
          this._shared.alert_info('Ingrese correctamente la provincia del registro ' + nro_registro);
          this.removeData();
          return;
        }
        
        const existe_distrito = this.lista_ubigeo.find( ubigeo => (ubigeo.departamento).toLowerCase() === (this.data[i].departamento).toLowerCase() && (ubigeo.provincia).toLowerCase() === (this.data[i].provincia).toLowerCase() && (ubigeo.distrito).toLowerCase() === (this.data[i].distrito).toLowerCase());

        if(!existe_distrito) {
          this._shared.alert_info('Ingrese correctamente el distrito del registro ' + nro_registro);
          this.removeData();
          return;
        }

        if(this.data[i].direccion.length === 0) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' debe tener dirección');
          this.removeData();
          return;
        }

        if(this.data[i].piso.length === 0) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' debe tener piso');
          this.removeData();
          return;
        }

        if(!tipo_moneda_valida.includes((this.data[i].tipo_moneda).toUpperCase())) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' no poseé un tipo de moneda válido. Valores aceptados: ' + tipo_moneda_valida);
          this.removeData();
          return;
        }

        if(isNaN(Number(this.data[i].precio))) {
          this._shared.alert_info(`El valor del campo precio perteneciente al registo ${ nro_registro } no tiene un número válido`);
          this.removeData();
          return;
        }


        if(isNaN(Number(this.data[i].area_total))) {
          this._shared.alert_info(`El valor del campo área total perteneciente al registo ${ nro_registro } no tiene un número válido`);
          this.removeData();
          return;
        }

        if(isNaN(Number(this.data[i].area_total))) {
          this._shared.alert_info(`El valor del campo área total perteneciente al registo ${ nro_registro } no tiene un número válido`);
          this.removeData();
          return;
        }

        if(isNaN(Number(this.data[i].area_contruida))) {
          this._shared.alert_info(`El valor del campo área construida perteneciente al registo ${ nro_registro } no tiene un número válido`);
          this.removeData();
          return;
        }

        if(isNaN(Number(this.data[i].dormitorios))) {
          this._shared.alert_info(`El valor del campo dormitorios perteneciente al registo ${ nro_registro } no tiene un número válido`);
          this.removeData();
          return;
        }

        if(isNaN(Number(this.data[i].banios))) {
          this._shared.alert_info(`El valor del campo baños perteneciente al registo ${ nro_registro } no tiene un número válido`);
          this.removeData();
          return;
        }

        if(isNaN(Number(this.data[i].cocheras))) {
          this._shared.alert_info(`El valor del campo cocheras perteneciente al registo ${ nro_registro } no tiene un número válido`);
          this.removeData();
          return;
        }

        if(isNaN(Number(this.data[i].pisos))) {
          this._shared.alert_info(`El valor del campo pisos perteneciente al registo ${ nro_registro } no tiene un número válido`);
          this.removeData();
          return;
        }

        if(!confirmacion_valida.includes((this.data[i].ascensores).toLowerCase())) {
          this._shared.alert_info(`El valor del campo ascensores perteneciente al registo ${ nro_registro } no tiene una confirmación válida, valores aceptados: ${confirmacion_valida}`);
          this.removeData();
          return;
        }

        if(!confirmacion_valida.includes((this.data[i].uso_profesional).toLowerCase())) {
          this._shared.alert_info(`El valor del campo uso profesional perteneciente al registo ${ nro_registro } no tiene una confirmación válida, valores aceptados: ${confirmacion_valida}`);
          this.removeData();
          return;
        }

        if(!confirmacion_valida.includes((this.data[i].mascotas).toLowerCase())) {
          this._shared.alert_info(`El valor del campo mascotas perteneciente al registo ${ nro_registro } no tiene una confirmación válida, valores aceptados: ${confirmacion_valida}`);
          this.removeData();
          return;
        }

        if(isNaN(Number(this.data[i].mantenimiento))) {
          this._shared.alert_info(`El valor del campo mantenimiento perteneciente al registo ${ nro_registro } no tiene un número válido`);
          this.removeData();
          return;
        }


        if(this.data[i].direccion.nombre_contacto === 0) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' debe tener nombre del contacto');
          this.removeData();
          return;
        }

        if(this.data[i].direccion.nrotelefono1_contacto === 0) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' debe tener teléfono del contacto');
          this.removeData();
          return;
        }

        if(this.data[i].direccion.correo_contacto === 0) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' debe tener correo del contacto');
          this.removeData();
          return;
        }

        if(!tipo_anunciante_validos.includes((this.data[i].tipo_anunciante).toLowerCase())) {
          this._shared.alert_info('El registro nro. ' + nro_registro + ' no poseé un tipo de anunciante válido. Valores aceptados: ' + tipo_anunciante_validos);
          this.removeData();
          return;
        }


        propiedad.titulo = this.data[i].titulo; //validado
        propiedad.descripcion = this.data[i].descripcion; //validado

    
        propiedad.id_tipo_operacion = Number(tipo_operacion_validos.indexOf((this.data[i].id_tipo_operacion).toLowerCase())) + 1; //validado
        propiedad.id_tipo_inmueble = Number(tipo_inmueble_validos.indexOf((this.data[i].id_tipo_inmueble).toLowerCase())) + 1; //validado
        propiedad.antiguedad = Number(antiguedad_valida.indexOf((this.data[i].antiguedad).toLowerCase())) + 1; //validado

        const { departamento, provincia, distrito, ubigeo} = existe_distrito;

        propiedad.departamento = departamento; //validado
        propiedad.provincia = provincia; //validado
        propiedad.distrito = distrito; //validado
        propiedad.ubigeo = ubigeo + ''; //validado
        propiedad.direccion = this.data[i].direccion; //validado
        propiedad.piso = this.data[i].piso; //validado
        propiedad.referencia = this.data[i].referencia || '';

        propiedad.tipo_moneda = this.data[i].tipo_moneda; //validado
        propiedad.precio = Number(this.data[i].precio); //validado

        propiedad.area_total = Number(this.data[i].area_total); //validado
        propiedad.area_contruida = Number(this.data[i].area_contruida); //validado
        propiedad.dormitorios = Number(this.data[i].dormitorios); //validado
        propiedad.banios = Number(this.data[i].banios); //validado
        propiedad.cocheras = Number(this.data[i].cocheras); //validado
        propiedad.pisos = Number(this.data[i].pisos); //validado
        propiedad.depa_pisos = Number(this.data[i].pisos); //validado

        propiedad.ascensores =  (this.data[i].ascensores).toLowerCase() === 'sí' ? 1 : 2; //validado
        propiedad.mantenimiento = Number(this.data[i].mantenimiento); //validado
        propiedad.uso_profesional = (this.data[i].uso_profesional).toLowerCase() === 'sí' ? 1 : 2; //validado
        propiedad.uso_comercial = (this.data[i].uso_comercial).toLowerCase() === 'sí' ? 1 : 2; //validado
        propiedad.mascotas = (this.data[i].mascotas).toLowerCase() === 'sí' ? 1 : 2; //validado

        propiedad.nombre_contacto = this.data[i].nombre_contacto; //validado
        propiedad.nrotelefono1_contacto = this.data[i].nrotelefono1_contacto; //validado
        propiedad.nrotelefono2_contacto = this.data[i].nrotelefono2_contacto || ''; //No requiere
        propiedad.correo_contacto = this.data[i].correo_contacto; //validado
        propiedad.tipo_anunciante = (this.data[i].tipo_anunciante).toLowerCase() === 'dueño directo' ? 1 : 2; //validado
                
        propiedad.tags_general = '[]';
        propiedad.tags_ambientes = '[]';
        propiedad.tags_servicios = '[]';
        propiedad.lat = '';
        propiedad.lng = '';
        propiedad.url_video = '';       
        
        this.propiedades.push(propiedad);

      }

      // console.log(this.propiedades);
      console.log(this.files_post);

     /*  this._propiedadService.importar_propiedad(this.propiedades)
        .subscribe((resp: any) => {
            console.log(resp);
            this._shared.alert_success('Propiedades registradas correctamente');
            console.log(this.files_post);
            this.files_post = [];
            this.data = [];            
        }); */


      return;
    }    

  }


lista_ubigeo = 
[
  {
   "ubigeo": 10101,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Chachapoyas"
  },
  {
   "ubigeo": 10102,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Asunción"
  },
  {
   "ubigeo": 10103,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Balsas"
  },
  {
   "ubigeo": 10104,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Cheto"
  },
  {
   "ubigeo": 10105,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Chiliquin"
  },
  {
   "ubigeo": 10106,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Chuquibamba"
  },
  {
   "ubigeo": 10107,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Granada"
  },
  {
   "ubigeo": 10108,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Huancas"
  },
  {
   "ubigeo": 10109,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "La Jalca"
  },
  {
   "ubigeo": 10110,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Leimebamba"
  },
  {
   "ubigeo": 10111,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Levanto"
  },
  {
   "ubigeo": 10112,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Magdalena"
  },
  {
   "ubigeo": 10113,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Mariscal Castilla"
  },
  {
   "ubigeo": 10114,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Molinopampa"
  },
  {
   "ubigeo": 10115,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Montevideo"
  },
  {
   "ubigeo": 10116,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Olleros"
  },
  {
   "ubigeo": 10117,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Quinjalca"
  },
  {
   "ubigeo": 10118,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "San Francisco de Daguas"
  },
  {
   "ubigeo": 10119,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "San Isidro de Maino"
  },
  {
   "ubigeo": 10120,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Soloco"
  },
  {
   "ubigeo": 10121,
   "departamento": "Amazonas",
   "provincia": "Chachapoyas",
   "distrito": "Sonche"
  },
  {
   "ubigeo": 10201,
   "departamento": "Amazonas",
   "provincia": "Bagua",
   "distrito": "Bagua"
  },
  {
   "ubigeo": 10202,
   "departamento": "Amazonas",
   "provincia": "Bagua",
   "distrito": "Aramango"
  },
  {
   "ubigeo": 10203,
   "departamento": "Amazonas",
   "provincia": "Bagua",
   "distrito": "Copallin"
  },
  {
   "ubigeo": 10204,
   "departamento": "Amazonas",
   "provincia": "Bagua",
   "distrito": "El Parco"
  },
  {
   "ubigeo": 10205,
   "departamento": "Amazonas",
   "provincia": "Bagua",
   "distrito": "Imaza"
  },
  {
   "ubigeo": 10206,
   "departamento": "Amazonas",
   "provincia": "Bagua",
   "distrito": "La Peca"
  },
  {
   "ubigeo": 10301,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "Jumbilla"
  },
  {
   "ubigeo": 10302,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "Chisquilla"
  },
  {
   "ubigeo": 10303,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "Churuja"
  },
  {
   "ubigeo": 10304,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "Corosha"
  },
  {
   "ubigeo": 10305,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "Cuispes"
  },
  {
   "ubigeo": 10306,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "Florida"
  },
  {
   "ubigeo": 10307,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "Jazan"
  },
  {
   "ubigeo": 10308,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "Recta"
  },
  {
   "ubigeo": 10309,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "San Carlos"
  },
  {
   "ubigeo": 10310,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "Shipasbamba"
  },
  {
   "ubigeo": 10311,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "Valera"
  },
  {
   "ubigeo": 10312,
   "departamento": "Amazonas",
   "provincia": "Bongará",
   "distrito": "Yambrasbamba"
  },
  {
   "ubigeo": 10401,
   "departamento": "Amazonas",
   "provincia": "Condorcanqui",
   "distrito": "Nieva"
  },
  {
   "ubigeo": 10402,
   "departamento": "Amazonas",
   "provincia": "Condorcanqui",
   "distrito": "El Cenepa"
  },
  {
   "ubigeo": 10403,
   "departamento": "Amazonas",
   "provincia": "Condorcanqui",
   "distrito": "Río Santiago"
  },
  {
   "ubigeo": 10501,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Lamud"
  },
  {
   "ubigeo": 10502,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Camporredondo"
  },
  {
   "ubigeo": 10503,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Cocabamba"
  },
  {
   "ubigeo": 10504,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Colcamar"
  },
  {
   "ubigeo": 10505,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Conila"
  },
  {
   "ubigeo": 10506,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Inguilpata"
  },
  {
   "ubigeo": 10507,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Longuita"
  },
  {
   "ubigeo": 10508,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Lonya Chico"
  },
  {
   "ubigeo": 10509,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Luya"
  },
  {
   "ubigeo": 10510,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Luya Viejo"
  },
  {
   "ubigeo": 10511,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "María"
  },
  {
   "ubigeo": 10512,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Ocalli"
  },
  {
   "ubigeo": 10513,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Ocumal"
  },
  {
   "ubigeo": 10514,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Pisuquia"
  },
  {
   "ubigeo": 10515,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Providencia"
  },
  {
   "ubigeo": 10516,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "San Cristóbal"
  },
  {
   "ubigeo": 10517,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "San Francisco de Yeso"
  },
  {
   "ubigeo": 10518,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "San Jerónimo"
  },
  {
   "ubigeo": 10519,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "San Juan de Lopecancha"
  },
  {
   "ubigeo": 10520,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Santa Catalina"
  },
  {
   "ubigeo": 10521,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Santo Tomas"
  },
  {
   "ubigeo": 10522,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Tingo"
  },
  {
   "ubigeo": 10523,
   "departamento": "Amazonas",
   "provincia": "Luya",
   "distrito": "Trita"
  },
  {
   "ubigeo": 10601,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "San Nicolás"
  },
  {
   "ubigeo": 10602,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "Chirimoto"
  },
  {
   "ubigeo": 10603,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "Cochamal"
  },
  {
   "ubigeo": 10604,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "Huambo"
  },
  {
   "ubigeo": 10605,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "Limabamba"
  },
  {
   "ubigeo": 10606,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "Longar"
  },
  {
   "ubigeo": 10607,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "Mariscal Benavides"
  },
  {
   "ubigeo": 10608,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "Milpuc"
  },
  {
   "ubigeo": 10609,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "Omia"
  },
  {
   "ubigeo": 10610,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "Santa Rosa"
  },
  {
   "ubigeo": 10611,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "Totora"
  },
  {
   "ubigeo": 10612,
   "departamento": "Amazonas",
   "provincia": "Rodríguez de Mendoza",
   "distrito": "Vista Alegre"
  },
  {
   "ubigeo": 10701,
   "departamento": "Amazonas",
   "provincia": "Utcubamba",
   "distrito": "Bagua Grande"
  },
  {
   "ubigeo": 10702,
   "departamento": "Amazonas",
   "provincia": "Utcubamba",
   "distrito": "Cajaruro"
  },
  {
   "ubigeo": 10703,
   "departamento": "Amazonas",
   "provincia": "Utcubamba",
   "distrito": "Cumba"
  },
  {
   "ubigeo": 10704,
   "departamento": "Amazonas",
   "provincia": "Utcubamba",
   "distrito": "El Milagro"
  },
  {
   "ubigeo": 10705,
   "departamento": "Amazonas",
   "provincia": "Utcubamba",
   "distrito": "Jamalca"
  },
  {
   "ubigeo": 10706,
   "departamento": "Amazonas",
   "provincia": "Utcubamba",
   "distrito": "Lonya Grande"
  },
  {
   "ubigeo": 10707,
   "departamento": "Amazonas",
   "provincia": "Utcubamba",
   "distrito": "Yamon"
  },
  {
   "ubigeo": 20101,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "Huaraz"
  },
  {
   "ubigeo": 20102,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "Cochabamba"
  },
  {
   "ubigeo": 20103,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "Colcabamba"
  },
  {
   "ubigeo": 20104,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "Huanchay"
  },
  {
   "ubigeo": 20105,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "Independencia"
  },
  {
   "ubigeo": 20106,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "Jangas"
  },
  {
   "ubigeo": 20107,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "La Libertad"
  },
  {
   "ubigeo": 20108,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "Olleros"
  },
  {
   "ubigeo": 20109,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "Pampas Grande"
  },
  {
   "ubigeo": 20110,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "Pariacoto"
  },
  {
   "ubigeo": 20111,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "Pira"
  },
  {
   "ubigeo": 20112,
   "departamento": "Áncash",
   "provincia": "Huaraz",
   "distrito": "Tarica"
  },
  {
   "ubigeo": 20201,
   "departamento": "Áncash",
   "provincia": "Aija",
   "distrito": "Aija"
  },
  {
   "ubigeo": 20202,
   "departamento": "Áncash",
   "provincia": "Aija",
   "distrito": "Coris"
  },
  {
   "ubigeo": 20203,
   "departamento": "Áncash",
   "provincia": "Aija",
   "distrito": "Huacllan"
  },
  {
   "ubigeo": 20204,
   "departamento": "Áncash",
   "provincia": "Aija",
   "distrito": "La Merced"
  },
  {
   "ubigeo": 20205,
   "departamento": "Áncash",
   "provincia": "Aija",
   "distrito": "Succha"
  },
  {
   "ubigeo": 20301,
   "departamento": "Áncash",
   "provincia": "Antonio Raymondi",
   "distrito": "Llamellin"
  },
  {
   "ubigeo": 20302,
   "departamento": "Áncash",
   "provincia": "Antonio Raymondi",
   "distrito": "Aczo"
  },
  {
   "ubigeo": 20303,
   "departamento": "Áncash",
   "provincia": "Antonio Raymondi",
   "distrito": "Chaccho"
  },
  {
   "ubigeo": 20304,
   "departamento": "Áncash",
   "provincia": "Antonio Raymondi",
   "distrito": "Chingas"
  },
  {
   "ubigeo": 20305,
   "departamento": "Áncash",
   "provincia": "Antonio Raymondi",
   "distrito": "Mirgas"
  },
  {
   "ubigeo": 20306,
   "departamento": "Áncash",
   "provincia": "Antonio Raymondi",
   "distrito": "San Juan de Rontoy"
  },
  {
   "ubigeo": 20401,
   "departamento": "Áncash",
   "provincia": "Asunción",
   "distrito": "Chacas"
  },
  {
   "ubigeo": 20402,
   "departamento": "Áncash",
   "provincia": "Asunción",
   "distrito": "Acochaca"
  },
  {
   "ubigeo": 20501,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Chiquian"
  },
  {
   "ubigeo": 20502,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Abelardo Pardo Lezameta"
  },
  {
   "ubigeo": 20503,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Antonio Raymondi"
  },
  {
   "ubigeo": 20504,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Aquia"
  },
  {
   "ubigeo": 20505,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Cajacay"
  },
  {
   "ubigeo": 20506,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Canis"
  },
  {
   "ubigeo": 20507,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Colquioc"
  },
  {
   "ubigeo": 20508,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Huallanca"
  },
  {
   "ubigeo": 20509,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Huasta"
  },
  {
   "ubigeo": 20510,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Huayllacayan"
  },
  {
   "ubigeo": 20511,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "La Primavera"
  },
  {
   "ubigeo": 20512,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Mangas"
  },
  {
   "ubigeo": 20513,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Pacllon"
  },
  {
   "ubigeo": 20514,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "San Miguel de Corpanqui"
  },
  {
   "ubigeo": 20515,
   "departamento": "Áncash",
   "provincia": "Bolognesi",
   "distrito": "Ticllos"
  },
  {
   "ubigeo": 20601,
   "departamento": "Áncash",
   "provincia": "Carhuaz",
   "distrito": "Carhuaz"
  },
  {
   "ubigeo": 20602,
   "departamento": "Áncash",
   "provincia": "Carhuaz",
   "distrito": "Acopampa"
  },
  {
   "ubigeo": 20603,
   "departamento": "Áncash",
   "provincia": "Carhuaz",
   "distrito": "Amashca"
  },
  {
   "ubigeo": 20604,
   "departamento": "Áncash",
   "provincia": "Carhuaz",
   "distrito": "Anta"
  },
  {
   "ubigeo": 20605,
   "departamento": "Áncash",
   "provincia": "Carhuaz",
   "distrito": "Ataquero"
  },
  {
   "ubigeo": 20606,
   "departamento": "Áncash",
   "provincia": "Carhuaz",
   "distrito": "Marcara"
  },
  {
   "ubigeo": 20607,
   "departamento": "Áncash",
   "provincia": "Carhuaz",
   "distrito": "Pariahuanca"
  },
  {
   "ubigeo": 20608,
   "departamento": "Áncash",
   "provincia": "Carhuaz",
   "distrito": "San Miguel de Aco"
  },
  {
   "ubigeo": 20609,
   "departamento": "Áncash",
   "provincia": "Carhuaz",
   "distrito": "Shilla"
  },
  {
   "ubigeo": 20610,
   "departamento": "Áncash",
   "provincia": "Carhuaz",
   "distrito": "Tinco"
  },
  {
   "ubigeo": 20611,
   "departamento": "Áncash",
   "provincia": "Carhuaz",
   "distrito": "Yungar"
  },
  {
   "ubigeo": 20701,
   "departamento": "Áncash",
   "provincia": "Carlos Fermín Fitzcarrald",
   "distrito": "San Luis"
  },
  {
   "ubigeo": 20702,
   "departamento": "Áncash",
   "provincia": "Carlos Fermín Fitzcarrald",
   "distrito": "San Nicolás"
  },
  {
   "ubigeo": 20703,
   "departamento": "Áncash",
   "provincia": "Carlos Fermín Fitzcarrald",
   "distrito": "Yauya"
  },
  {
   "ubigeo": 20801,
   "departamento": "Áncash",
   "provincia": "Casma",
   "distrito": "Casma"
  },
  {
   "ubigeo": 20802,
   "departamento": "Áncash",
   "provincia": "Casma",
   "distrito": "Buena Vista Alta"
  },
  {
   "ubigeo": 20803,
   "departamento": "Áncash",
   "provincia": "Casma",
   "distrito": "Comandante Noel"
  },
  {
   "ubigeo": 20804,
   "departamento": "Áncash",
   "provincia": "Casma",
   "distrito": "Yautan"
  },
  {
   "ubigeo": 20901,
   "departamento": "Áncash",
   "provincia": "Corongo",
   "distrito": "Corongo"
  },
  {
   "ubigeo": 20902,
   "departamento": "Áncash",
   "provincia": "Corongo",
   "distrito": "Aco"
  },
  {
   "ubigeo": 20903,
   "departamento": "Áncash",
   "provincia": "Corongo",
   "distrito": "Bambas"
  },
  {
   "ubigeo": 20904,
   "departamento": "Áncash",
   "provincia": "Corongo",
   "distrito": "Cusca"
  },
  {
   "ubigeo": 20905,
   "departamento": "Áncash",
   "provincia": "Corongo",
   "distrito": "La Pampa"
  },
  {
   "ubigeo": 20906,
   "departamento": "Áncash",
   "provincia": "Corongo",
   "distrito": "Yanac"
  },
  {
   "ubigeo": 20907,
   "departamento": "Áncash",
   "provincia": "Corongo",
   "distrito": "Yupan"
  },
  {
   "ubigeo": 21001,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Huari"
  },
  {
   "ubigeo": 21002,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Anra"
  },
  {
   "ubigeo": 21003,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Cajay"
  },
  {
   "ubigeo": 21004,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Chavin de Huantar"
  },
  {
   "ubigeo": 21005,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Huacachi"
  },
  {
   "ubigeo": 21006,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Huacchis"
  },
  {
   "ubigeo": 21007,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Huachis"
  },
  {
   "ubigeo": 21008,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Huantar"
  },
  {
   "ubigeo": 21009,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Masin"
  },
  {
   "ubigeo": 21010,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Paucas"
  },
  {
   "ubigeo": 21011,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Ponto"
  },
  {
   "ubigeo": 21012,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Rahuapampa"
  },
  {
   "ubigeo": 21013,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Rapayan"
  },
  {
   "ubigeo": 21014,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "San Marcos"
  },
  {
   "ubigeo": 21015,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "San Pedro de Chana"
  },
  {
   "ubigeo": 21016,
   "departamento": "Áncash",
   "provincia": "Huari",
   "distrito": "Uco"
  },
  {
   "ubigeo": 21101,
   "departamento": "Áncash",
   "provincia": "Huarmey",
   "distrito": "Huarmey"
  },
  {
   "ubigeo": 21102,
   "departamento": "Áncash",
   "provincia": "Huarmey",
   "distrito": "Cochapeti"
  },
  {
   "ubigeo": 21103,
   "departamento": "Áncash",
   "provincia": "Huarmey",
   "distrito": "Culebras"
  },
  {
   "ubigeo": 21104,
   "departamento": "Áncash",
   "provincia": "Huarmey",
   "distrito": "Huayan"
  },
  {
   "ubigeo": 21105,
   "departamento": "Áncash",
   "provincia": "Huarmey",
   "distrito": "Malvas"
  },
  {
   "ubigeo": 21201,
   "departamento": "Áncash",
   "provincia": "Huaylas",
   "distrito": "Caraz"
  },
  {
   "ubigeo": 21202,
   "departamento": "Áncash",
   "provincia": "Huaylas",
   "distrito": "Huallanca"
  },
  {
   "ubigeo": 21203,
   "departamento": "Áncash",
   "provincia": "Huaylas",
   "distrito": "Huata"
  },
  {
   "ubigeo": 21204,
   "departamento": "Áncash",
   "provincia": "Huaylas",
   "distrito": "Huaylas"
  },
  {
   "ubigeo": 21205,
   "departamento": "Áncash",
   "provincia": "Huaylas",
   "distrito": "Mato"
  },
  {
   "ubigeo": 21206,
   "departamento": "Áncash",
   "provincia": "Huaylas",
   "distrito": "Pamparomas"
  },
  {
   "ubigeo": 21207,
   "departamento": "Áncash",
   "provincia": "Huaylas",
   "distrito": "Pueblo Libre"
  },
  {
   "ubigeo": 21208,
   "departamento": "Áncash",
   "provincia": "Huaylas",
   "distrito": "Santa Cruz"
  },
  {
   "ubigeo": 21209,
   "departamento": "Áncash",
   "provincia": "Huaylas",
   "distrito": "Santo Toribio"
  },
  {
   "ubigeo": 21210,
   "departamento": "Áncash",
   "provincia": "Huaylas",
   "distrito": "Yuracmarca"
  },
  {
   "ubigeo": 21301,
   "departamento": "Áncash",
   "provincia": "Mariscal Luzuriaga",
   "distrito": "Piscobamba"
  },
  {
   "ubigeo": 21302,
   "departamento": "Áncash",
   "provincia": "Mariscal Luzuriaga",
   "distrito": "Casca"
  },
  {
   "ubigeo": 21303,
   "departamento": "Áncash",
   "provincia": "Mariscal Luzuriaga",
   "distrito": "Eleazar Guzmán Barron"
  },
  {
   "ubigeo": 21304,
   "departamento": "Áncash",
   "provincia": "Mariscal Luzuriaga",
   "distrito": "Fidel Olivas Escudero"
  },
  {
   "ubigeo": 21305,
   "departamento": "Áncash",
   "provincia": "Mariscal Luzuriaga",
   "distrito": "Llama"
  },
  {
   "ubigeo": 21306,
   "departamento": "Áncash",
   "provincia": "Mariscal Luzuriaga",
   "distrito": "Llumpa"
  },
  {
   "ubigeo": 21307,
   "departamento": "Áncash",
   "provincia": "Mariscal Luzuriaga",
   "distrito": "Lucma"
  },
  {
   "ubigeo": 21308,
   "departamento": "Áncash",
   "provincia": "Mariscal Luzuriaga",
   "distrito": "Musga"
  },
  {
   "ubigeo": 21401,
   "departamento": "Áncash",
   "provincia": "Ocros",
   "distrito": "Ocros"
  },
  {
   "ubigeo": 21402,
   "departamento": "Áncash",
   "provincia": "Ocros",
   "distrito": "Acas"
  },
  {
   "ubigeo": 21403,
   "departamento": "Áncash",
   "provincia": "Ocros",
   "distrito": "Cajamarquilla"
  },
  {
   "ubigeo": 21404,
   "departamento": "Áncash",
   "provincia": "Ocros",
   "distrito": "Carhuapampa"
  },
  {
   "ubigeo": 21405,
   "departamento": "Áncash",
   "provincia": "Ocros",
   "distrito": "Cochas"
  },
  {
   "ubigeo": 21406,
   "departamento": "Áncash",
   "provincia": "Ocros",
   "distrito": "Congas"
  },
  {
   "ubigeo": 21407,
   "departamento": "Áncash",
   "provincia": "Ocros",
   "distrito": "Llipa"
  },
  {
   "ubigeo": 21408,
   "departamento": "Áncash",
   "provincia": "Ocros",
   "distrito": "San Cristóbal de Rajan"
  },
  {
   "ubigeo": 21409,
   "departamento": "Áncash",
   "provincia": "Ocros",
   "distrito": "San Pedro"
  },
  {
   "ubigeo": 21410,
   "departamento": "Áncash",
   "provincia": "Ocros",
   "distrito": "Santiago de Chilcas"
  },
  {
   "ubigeo": 21501,
   "departamento": "Áncash",
   "provincia": "Pallasca",
   "distrito": "Cabana"
  },
  {
   "ubigeo": 21502,
   "departamento": "Áncash",
   "provincia": "Pallasca",
   "distrito": "Bolognesi"
  },
  {
   "ubigeo": 21503,
   "departamento": "Áncash",
   "provincia": "Pallasca",
   "distrito": "Conchucos"
  },
  {
   "ubigeo": 21504,
   "departamento": "Áncash",
   "provincia": "Pallasca",
   "distrito": "Huacaschuque"
  },
  {
   "ubigeo": 21505,
   "departamento": "Áncash",
   "provincia": "Pallasca",
   "distrito": "Huandoval"
  },
  {
   "ubigeo": 21506,
   "departamento": "Áncash",
   "provincia": "Pallasca",
   "distrito": "Lacabamba"
  },
  {
   "ubigeo": 21507,
   "departamento": "Áncash",
   "provincia": "Pallasca",
   "distrito": "Llapo"
  },
  {
   "ubigeo": 21508,
   "departamento": "Áncash",
   "provincia": "Pallasca",
   "distrito": "Pallasca"
  },
  {
   "ubigeo": 21509,
   "departamento": "Áncash",
   "provincia": "Pallasca",
   "distrito": "Pampas"
  },
  {
   "ubigeo": 21510,
   "departamento": "Áncash",
   "provincia": "Pallasca",
   "distrito": "Santa Rosa"
  },
  {
   "ubigeo": 21511,
   "departamento": "Áncash",
   "provincia": "Pallasca",
   "distrito": "Tauca"
  },
  {
   "ubigeo": 21601,
   "departamento": "Áncash",
   "provincia": "Pomabamba",
   "distrito": "Pomabamba"
  },
  {
   "ubigeo": 21602,
   "departamento": "Áncash",
   "provincia": "Pomabamba",
   "distrito": "Huayllan"
  },
  {
   "ubigeo": 21603,
   "departamento": "Áncash",
   "provincia": "Pomabamba",
   "distrito": "Parobamba"
  },
  {
   "ubigeo": 21604,
   "departamento": "Áncash",
   "provincia": "Pomabamba",
   "distrito": "Quinuabamba"
  },
  {
   "ubigeo": 21701,
   "departamento": "Áncash",
   "provincia": "Recuay",
   "distrito": "Recuay"
  },
  {
   "ubigeo": 21702,
   "departamento": "Áncash",
   "provincia": "Recuay",
   "distrito": "Catac"
  },
  {
   "ubigeo": 21703,
   "departamento": "Áncash",
   "provincia": "Recuay",
   "distrito": "Cotaparaco"
  },
  {
   "ubigeo": 21704,
   "departamento": "Áncash",
   "provincia": "Recuay",
   "distrito": "Huayllapampa"
  },
  {
   "ubigeo": 21705,
   "departamento": "Áncash",
   "provincia": "Recuay",
   "distrito": "Llacllin"
  },
  {
   "ubigeo": 21706,
   "departamento": "Áncash",
   "provincia": "Recuay",
   "distrito": "Marca"
  },
  {
   "ubigeo": 21707,
   "departamento": "Áncash",
   "provincia": "Recuay",
   "distrito": "Pampas Chico"
  },
  {
   "ubigeo": 21708,
   "departamento": "Áncash",
   "provincia": "Recuay",
   "distrito": "Pararin"
  },
  {
   "ubigeo": 21709,
   "departamento": "Áncash",
   "provincia": "Recuay",
   "distrito": "Tapacocha"
  },
  {
   "ubigeo": 21710,
   "departamento": "Áncash",
   "provincia": "Recuay",
   "distrito": "Ticapampa"
  },
  {
   "ubigeo": 21801,
   "departamento": "Áncash",
   "provincia": "Santa",
   "distrito": "Chimbote"
  },
  {
   "ubigeo": 21802,
   "departamento": "Áncash",
   "provincia": "Santa",
   "distrito": "Cáceres del Perú"
  },
  {
   "ubigeo": 21803,
   "departamento": "Áncash",
   "provincia": "Santa",
   "distrito": "Coishco"
  },
  {
   "ubigeo": 21804,
   "departamento": "Áncash",
   "provincia": "Santa",
   "distrito": "Macate"
  },
  {
   "ubigeo": 21805,
   "departamento": "Áncash",
   "provincia": "Santa",
   "distrito": "Moro"
  },
  {
   "ubigeo": 21806,
   "departamento": "Áncash",
   "provincia": "Santa",
   "distrito": "Nepeña"
  },
  {
   "ubigeo": 21807,
   "departamento": "Áncash",
   "provincia": "Santa",
   "distrito": "Samanco"
  },
  {
   "ubigeo": 21808,
   "departamento": "Áncash",
   "provincia": "Santa",
   "distrito": "Santa"
  },
  {
   "ubigeo": 21809,
   "departamento": "Áncash",
   "provincia": "Santa",
   "distrito": "Nuevo Chimbote"
  },
  {
   "ubigeo": 21901,
   "departamento": "Áncash",
   "provincia": "Sihuas",
   "distrito": "Sihuas"
  },
  {
   "ubigeo": 21902,
   "departamento": "Áncash",
   "provincia": "Sihuas",
   "distrito": "Acobamba"
  },
  {
   "ubigeo": 21903,
   "departamento": "Áncash",
   "provincia": "Sihuas",
   "distrito": "Alfonso Ugarte"
  },
  {
   "ubigeo": 21904,
   "departamento": "Áncash",
   "provincia": "Sihuas",
   "distrito": "Cashapampa"
  },
  {
   "ubigeo": 21905,
   "departamento": "Áncash",
   "provincia": "Sihuas",
   "distrito": "Chingalpo"
  },
  {
   "ubigeo": 21906,
   "departamento": "Áncash",
   "provincia": "Sihuas",
   "distrito": "Huayllabamba"
  },
  {
   "ubigeo": 21907,
   "departamento": "Áncash",
   "provincia": "Sihuas",
   "distrito": "Quiches"
  },
  {
   "ubigeo": 21908,
   "departamento": "Áncash",
   "provincia": "Sihuas",
   "distrito": "Ragash"
  },
  {
   "ubigeo": 21909,
   "departamento": "Áncash",
   "provincia": "Sihuas",
   "distrito": "San Juan"
  },
  {
   "ubigeo": 21910,
   "departamento": "Áncash",
   "provincia": "Sihuas",
   "distrito": "Sicsibamba"
  },
  {
   "ubigeo": 22001,
   "departamento": "Áncash",
   "provincia": "Yungay",
   "distrito": "Yungay"
  },
  {
   "ubigeo": 22002,
   "departamento": "Áncash",
   "provincia": "Yungay",
   "distrito": "Cascapara"
  },
  {
   "ubigeo": 22003,
   "departamento": "Áncash",
   "provincia": "Yungay",
   "distrito": "Mancos"
  },
  {
   "ubigeo": 22004,
   "departamento": "Áncash",
   "provincia": "Yungay",
   "distrito": "Matacoto"
  },
  {
   "ubigeo": 22005,
   "departamento": "Áncash",
   "provincia": "Yungay",
   "distrito": "Quillo"
  },
  {
   "ubigeo": 22006,
   "departamento": "Áncash",
   "provincia": "Yungay",
   "distrito": "Ranrahirca"
  },
  {
   "ubigeo": 22007,
   "departamento": "Áncash",
   "provincia": "Yungay",
   "distrito": "Shupluy"
  },
  {
   "ubigeo": 22008,
   "departamento": "Áncash",
   "provincia": "Yungay",
   "distrito": "Yanama"
  },
  {
   "ubigeo": 30101,
   "departamento": "Apurímac",
   "provincia": "Abancay",
   "distrito": "Abancay"
  },
  {
   "ubigeo": 30102,
   "departamento": "Apurímac",
   "provincia": "Abancay",
   "distrito": "Chacoche"
  },
  {
   "ubigeo": 30103,
   "departamento": "Apurímac",
   "provincia": "Abancay",
   "distrito": "Circa"
  },
  {
   "ubigeo": 30104,
   "departamento": "Apurímac",
   "provincia": "Abancay",
   "distrito": "Curahuasi"
  },
  {
   "ubigeo": 30105,
   "departamento": "Apurímac",
   "provincia": "Abancay",
   "distrito": "Huanipaca"
  },
  {
   "ubigeo": 30106,
   "departamento": "Apurímac",
   "provincia": "Abancay",
   "distrito": "Lambrama"
  },
  {
   "ubigeo": 30107,
   "departamento": "Apurímac",
   "provincia": "Abancay",
   "distrito": "Pichirhua"
  },
  {
   "ubigeo": 30108,
   "departamento": "Apurímac",
   "provincia": "Abancay",
   "distrito": "San Pedro de Cachora"
  },
  {
   "ubigeo": 30109,
   "departamento": "Apurímac",
   "provincia": "Abancay",
   "distrito": "Tamburco"
  },
  {
   "ubigeo": 30201,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Andahuaylas"
  },
  {
   "ubigeo": 30202,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Andarapa"
  },
  {
   "ubigeo": 30203,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Chiara"
  },
  {
   "ubigeo": 30204,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Huancarama"
  },
  {
   "ubigeo": 30205,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Huancaray"
  },
  {
   "ubigeo": 30206,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Huayana"
  },
  {
   "ubigeo": 30207,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Kishuara"
  },
  {
   "ubigeo": 30208,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Pacobamba"
  },
  {
   "ubigeo": 30209,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Pacucha"
  },
  {
   "ubigeo": 30210,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Pampachiri"
  },
  {
   "ubigeo": 30211,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Pomacocha"
  },
  {
   "ubigeo": 30212,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "San Antonio de Cachi"
  },
  {
   "ubigeo": 30213,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "San Jerónimo"
  },
  {
   "ubigeo": 30214,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "San Miguel de Chaccrampa"
  },
  {
   "ubigeo": 30215,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Santa María de Chicmo"
  },
  {
   "ubigeo": 30216,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Talavera"
  },
  {
   "ubigeo": 30217,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Tumay Huaraca"
  },
  {
   "ubigeo": 30218,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Turpo"
  },
  {
   "ubigeo": 30219,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "Kaquiabamba"
  },
  {
   "ubigeo": 30220,
   "departamento": "Apurímac",
   "provincia": "Andahuaylas",
   "distrito": "José María Arguedas"
  },
  {
   "ubigeo": 30301,
   "departamento": "Apurímac",
   "provincia": "Antabamba",
   "distrito": "Antabamba"
  },
  {
   "ubigeo": 30302,
   "departamento": "Apurímac",
   "provincia": "Antabamba",
   "distrito": "El Oro"
  },
  {
   "ubigeo": 30303,
   "departamento": "Apurímac",
   "provincia": "Antabamba",
   "distrito": "Huaquirca"
  },
  {
   "ubigeo": 30304,
   "departamento": "Apurímac",
   "provincia": "Antabamba",
   "distrito": "Juan Espinoza Medrano"
  },
  {
   "ubigeo": 30305,
   "departamento": "Apurímac",
   "provincia": "Antabamba",
   "distrito": "Oropesa"
  },
  {
   "ubigeo": 30306,
   "departamento": "Apurímac",
   "provincia": "Antabamba",
   "distrito": "Pachaconas"
  },
  {
   "ubigeo": 30307,
   "departamento": "Apurímac",
   "provincia": "Antabamba",
   "distrito": "Sabaino"
  },
  {
   "ubigeo": 30401,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Chalhuanca"
  },
  {
   "ubigeo": 30402,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Capaya"
  },
  {
   "ubigeo": 30403,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Caraybamba"
  },
  {
   "ubigeo": 30404,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Chapimarca"
  },
  {
   "ubigeo": 30405,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Colcabamba"
  },
  {
   "ubigeo": 30406,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Cotaruse"
  },
  {
   "ubigeo": 30407,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Ihuayllo"
  },
  {
   "ubigeo": 30408,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Justo Apu Sahuaraura"
  },
  {
   "ubigeo": 30409,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Lucre"
  },
  {
   "ubigeo": 30410,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Pocohuanca"
  },
  {
   "ubigeo": 30411,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "San Juan de Chacña"
  },
  {
   "ubigeo": 30412,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Sañayca"
  },
  {
   "ubigeo": 30413,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Soraya"
  },
  {
   "ubigeo": 30414,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Tapairihua"
  },
  {
   "ubigeo": 30415,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Tintay"
  },
  {
   "ubigeo": 30416,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Toraya"
  },
  {
   "ubigeo": 30417,
   "departamento": "Apurímac",
   "provincia": "Aymaraes",
   "distrito": "Yanaca"
  },
  {
   "ubigeo": 30501,
   "departamento": "Apurímac",
   "provincia": "Cotabambas",
   "distrito": "Tambobamba"
  },
  {
   "ubigeo": 30502,
   "departamento": "Apurímac",
   "provincia": "Cotabambas",
   "distrito": "Cotabambas"
  },
  {
   "ubigeo": 30503,
   "departamento": "Apurímac",
   "provincia": "Cotabambas",
   "distrito": "Coyllurqui"
  },
  {
   "ubigeo": 30504,
   "departamento": "Apurímac",
   "provincia": "Cotabambas",
   "distrito": "Haquira"
  },
  {
   "ubigeo": 30505,
   "departamento": "Apurímac",
   "provincia": "Cotabambas",
   "distrito": "Mara"
  },
  {
   "ubigeo": 30506,
   "departamento": "Apurímac",
   "provincia": "Cotabambas",
   "distrito": "Challhuahuacho"
  },
  {
   "ubigeo": 30601,
   "departamento": "Apurímac",
   "provincia": "Chincheros",
   "distrito": "Chincheros"
  },
  {
   "ubigeo": 30602,
   "departamento": "Apurímac",
   "provincia": "Chincheros",
   "distrito": "Anco_Huallo"
  },
  {
   "ubigeo": 30603,
   "departamento": "Apurímac",
   "provincia": "Chincheros",
   "distrito": "Cocharcas"
  },
  {
   "ubigeo": 30604,
   "departamento": "Apurímac",
   "provincia": "Chincheros",
   "distrito": "Huaccana"
  },
  {
   "ubigeo": 30605,
   "departamento": "Apurímac",
   "provincia": "Chincheros",
   "distrito": "Ocobamba"
  },
  {
   "ubigeo": 30606,
   "departamento": "Apurímac",
   "provincia": "Chincheros",
   "distrito": "Ongoy"
  },
  {
   "ubigeo": 30607,
   "departamento": "Apurímac",
   "provincia": "Chincheros",
   "distrito": "Uranmarca"
  },
  {
   "ubigeo": 30608,
   "departamento": "Apurímac",
   "provincia": "Chincheros",
   "distrito": "Ranracancha"
  },
  {
   "ubigeo": 30609,
   "departamento": "Apurímac",
   "provincia": "Chincheros",
   "distrito": "Rocchacc"
  },
  {
   "ubigeo": 30610,
   "departamento": "Apurímac",
   "provincia": "Chincheros",
   "distrito": "El Porvenir"
  },
  {
   "ubigeo": 30701,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Chuquibambilla"
  },
  {
   "ubigeo": 30702,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Curpahuasi"
  },
  {
   "ubigeo": 30703,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Gamarra"
  },
  {
   "ubigeo": 30704,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Huayllati"
  },
  {
   "ubigeo": 30705,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Mamara"
  },
  {
   "ubigeo": 30706,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Micaela Bastidas"
  },
  {
   "ubigeo": 30707,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Pataypampa"
  },
  {
   "ubigeo": 30708,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Progreso"
  },
  {
   "ubigeo": 30709,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "San Antonio"
  },
  {
   "ubigeo": 30710,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Santa Rosa"
  },
  {
   "ubigeo": 30711,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Turpay"
  },
  {
   "ubigeo": 30712,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Vilcabamba"
  },
  {
   "ubigeo": 30713,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Virundo"
  },
  {
   "ubigeo": 30714,
   "departamento": "Apurímac",
   "provincia": "Grau",
   "distrito": "Curasco"
  },
  {
   "ubigeo": 40101,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Arequipa"
  },
  {
   "ubigeo": 40102,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Alto Selva Alegre"
  },
  {
   "ubigeo": 40103,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Cayma"
  },
  {
   "ubigeo": 40104,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Cerro Colorado"
  },
  {
   "ubigeo": 40105,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Characato"
  },
  {
   "ubigeo": 40106,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Chiguata"
  },
  {
   "ubigeo": 40107,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Jacobo Hunter"
  },
  {
   "ubigeo": 40108,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "La Joya"
  },
  {
   "ubigeo": 40109,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Mariano Melgar"
  },
  {
   "ubigeo": 40110,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Miraflores"
  },
  {
   "ubigeo": 40111,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Mollebaya"
  },
  {
   "ubigeo": 40112,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Paucarpata"
  },
  {
   "ubigeo": 40113,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Pocsi"
  },
  {
   "ubigeo": 40114,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Polobaya"
  },
  {
   "ubigeo": 40115,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Quequeña"
  },
  {
   "ubigeo": 40116,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Sabandia"
  },
  {
   "ubigeo": 40117,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Sachaca"
  },
  {
   "ubigeo": 40118,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "San Juan de Siguas"
  },
  {
   "ubigeo": 40119,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "San Juan de Tarucani"
  },
  {
   "ubigeo": 40120,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Santa Isabel de Siguas"
  },
  {
   "ubigeo": 40121,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Santa Rita de Siguas"
  },
  {
   "ubigeo": 40122,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Socabaya"
  },
  {
   "ubigeo": 40123,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Tiabaya"
  },
  {
   "ubigeo": 40124,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Uchumayo"
  },
  {
   "ubigeo": 40125,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Vitor"
  },
  {
   "ubigeo": 40126,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Yanahuara"
  },
  {
   "ubigeo": 40127,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Yarabamba"
  },
  {
   "ubigeo": 40128,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "Yura"
  },
  {
   "ubigeo": 40129,
   "departamento": "Arequipa",
   "provincia": "Arequipa",
   "distrito": "José Luis Bustamante Y Rivero"
  },
  {
   "ubigeo": 40201,
   "departamento": "Arequipa",
   "provincia": "Camaná",
   "distrito": "Camaná"
  },
  {
   "ubigeo": 40202,
   "departamento": "Arequipa",
   "provincia": "Camaná",
   "distrito": "José María Quimper"
  },
  {
   "ubigeo": 40203,
   "departamento": "Arequipa",
   "provincia": "Camaná",
   "distrito": "Mariano Nicolás Valcárcel"
  },
  {
   "ubigeo": 40204,
   "departamento": "Arequipa",
   "provincia": "Camaná",
   "distrito": "Mariscal Cáceres"
  },
  {
   "ubigeo": 40205,
   "departamento": "Arequipa",
   "provincia": "Camaná",
   "distrito": "Nicolás de Pierola"
  },
  {
   "ubigeo": 40206,
   "departamento": "Arequipa",
   "provincia": "Camaná",
   "distrito": "Ocoña"
  },
  {
   "ubigeo": 40207,
   "departamento": "Arequipa",
   "provincia": "Camaná",
   "distrito": "Quilca"
  },
  {
   "ubigeo": 40208,
   "departamento": "Arequipa",
   "provincia": "Camaná",
   "distrito": "Samuel Pastor"
  },
  {
   "ubigeo": 40301,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Caravelí"
  },
  {
   "ubigeo": 40302,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Acarí"
  },
  {
   "ubigeo": 40303,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Atico"
  },
  {
   "ubigeo": 40304,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Atiquipa"
  },
  {
   "ubigeo": 40305,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Bella Unión"
  },
  {
   "ubigeo": 40306,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Cahuacho"
  },
  {
   "ubigeo": 40307,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Chala"
  },
  {
   "ubigeo": 40308,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Chaparra"
  },
  {
   "ubigeo": 40309,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Huanuhuanu"
  },
  {
   "ubigeo": 40310,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Jaqui"
  },
  {
   "ubigeo": 40311,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Lomas"
  },
  {
   "ubigeo": 40312,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Quicacha"
  },
  {
   "ubigeo": 40313,
   "departamento": "Arequipa",
   "provincia": "Caravelí",
   "distrito": "Yauca"
  },
  {
   "ubigeo": 40401,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Aplao"
  },
  {
   "ubigeo": 40402,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Andagua"
  },
  {
   "ubigeo": 40403,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Ayo"
  },
  {
   "ubigeo": 40404,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Chachas"
  },
  {
   "ubigeo": 40405,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Chilcaymarca"
  },
  {
   "ubigeo": 40406,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Choco"
  },
  {
   "ubigeo": 40407,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Huancarqui"
  },
  {
   "ubigeo": 40408,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Machaguay"
  },
  {
   "ubigeo": 40409,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Orcopampa"
  },
  {
   "ubigeo": 40410,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Pampacolca"
  },
  {
   "ubigeo": 40411,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Tipan"
  },
  {
   "ubigeo": 40412,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Uñon"
  },
  {
   "ubigeo": 40413,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Uraca"
  },
  {
   "ubigeo": 40414,
   "departamento": "Arequipa",
   "provincia": "Castilla",
   "distrito": "Viraco"
  },
  {
   "ubigeo": 40501,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Chivay"
  },
  {
   "ubigeo": 40502,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Achoma"
  },
  {
   "ubigeo": 40503,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Cabanaconde"
  },
  {
   "ubigeo": 40504,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Callalli"
  },
  {
   "ubigeo": 40505,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Caylloma"
  },
  {
   "ubigeo": 40506,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Coporaque"
  },
  {
   "ubigeo": 40507,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Huambo"
  },
  {
   "ubigeo": 40508,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Huanca"
  },
  {
   "ubigeo": 40509,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Ichupampa"
  },
  {
   "ubigeo": 40510,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Lari"
  },
  {
   "ubigeo": 40511,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Lluta"
  },
  {
   "ubigeo": 40512,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Maca"
  },
  {
   "ubigeo": 40513,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Madrigal"
  },
  {
   "ubigeo": 40514,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "San Antonio de Chuca"
  },
  {
   "ubigeo": 40515,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Sibayo"
  },
  {
   "ubigeo": 40516,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Tapay"
  },
  {
   "ubigeo": 40517,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Tisco"
  },
  {
   "ubigeo": 40518,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Tuti"
  },
  {
   "ubigeo": 40519,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Yanque"
  },
  {
   "ubigeo": 40520,
   "departamento": "Arequipa",
   "provincia": "Caylloma",
   "distrito": "Majes"
  },
  {
   "ubigeo": 40601,
   "departamento": "Arequipa",
   "provincia": "Condesuyos",
   "distrito": "Chuquibamba"
  },
  {
   "ubigeo": 40602,
   "departamento": "Arequipa",
   "provincia": "Condesuyos",
   "distrito": "Andaray"
  },
  {
   "ubigeo": 40603,
   "departamento": "Arequipa",
   "provincia": "Condesuyos",
   "distrito": "Cayarani"
  },
  {
   "ubigeo": 40604,
   "departamento": "Arequipa",
   "provincia": "Condesuyos",
   "distrito": "Chichas"
  },
  {
   "ubigeo": 40605,
   "departamento": "Arequipa",
   "provincia": "Condesuyos",
   "distrito": "Iray"
  },
  {
   "ubigeo": 40606,
   "departamento": "Arequipa",
   "provincia": "Condesuyos",
   "distrito": "Río Grande"
  },
  {
   "ubigeo": 40607,
   "departamento": "Arequipa",
   "provincia": "Condesuyos",
   "distrito": "Salamanca"
  },
  {
   "ubigeo": 40608,
   "departamento": "Arequipa",
   "provincia": "Condesuyos",
   "distrito": "Yanaquihua"
  },
  {
   "ubigeo": 40701,
   "departamento": "Arequipa",
   "provincia": "Islay",
   "distrito": "Mollendo"
  },
  {
   "ubigeo": 40702,
   "departamento": "Arequipa",
   "provincia": "Islay",
   "distrito": "Cocachacra"
  },
  {
   "ubigeo": 40703,
   "departamento": "Arequipa",
   "provincia": "Islay",
   "distrito": "Dean Valdivia"
  },
  {
   "ubigeo": 40704,
   "departamento": "Arequipa",
   "provincia": "Islay",
   "distrito": "Islay"
  },
  {
   "ubigeo": 40705,
   "departamento": "Arequipa",
   "provincia": "Islay",
   "distrito": "Mejia"
  },
  {
   "ubigeo": 40706,
   "departamento": "Arequipa",
   "provincia": "Islay",
   "distrito": "Punta de Bombón"
  },
  {
   "ubigeo": 40801,
   "departamento": "Arequipa",
   "provincia": "La Uniòn",
   "distrito": "Cotahuasi"
  },
  {
   "ubigeo": 40802,
   "departamento": "Arequipa",
   "provincia": "La Uniòn",
   "distrito": "Alca"
  },
  {
   "ubigeo": 40803,
   "departamento": "Arequipa",
   "provincia": "La Uniòn",
   "distrito": "Charcana"
  },
  {
   "ubigeo": 40804,
   "departamento": "Arequipa",
   "provincia": "La Uniòn",
   "distrito": "Huaynacotas"
  },
  {
   "ubigeo": 40805,
   "departamento": "Arequipa",
   "provincia": "La Uniòn",
   "distrito": "Pampamarca"
  },
  {
   "ubigeo": 40806,
   "departamento": "Arequipa",
   "provincia": "La Uniòn",
   "distrito": "Puyca"
  },
  {
   "ubigeo": 40807,
   "departamento": "Arequipa",
   "provincia": "La Uniòn",
   "distrito": "Quechualla"
  },
  {
   "ubigeo": 40808,
   "departamento": "Arequipa",
   "provincia": "La Uniòn",
   "distrito": "Sayla"
  },
  {
   "ubigeo": 40809,
   "departamento": "Arequipa",
   "provincia": "La Uniòn",
   "distrito": "Tauria"
  },
  {
   "ubigeo": 40810,
   "departamento": "Arequipa",
   "provincia": "La Uniòn",
   "distrito": "Tomepampa"
  },
  {
   "ubigeo": 40811,
   "departamento": "Arequipa",
   "provincia": "La Uniòn",
   "distrito": "Toro"
  },
  {
   "ubigeo": 50101,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Ayacucho"
  },
  {
   "ubigeo": 50102,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Acocro"
  },
  {
   "ubigeo": 50103,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Acos Vinchos"
  },
  {
   "ubigeo": 50104,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Carmen Alto"
  },
  {
   "ubigeo": 50105,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Chiara"
  },
  {
   "ubigeo": 50106,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Ocros"
  },
  {
   "ubigeo": 50107,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Pacaycasa"
  },
  {
   "ubigeo": 50108,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Quinua"
  },
  {
   "ubigeo": 50109,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "San José de Ticllas"
  },
  {
   "ubigeo": 50110,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "San Juan Bautista"
  },
  {
   "ubigeo": 50111,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Santiago de Pischa"
  },
  {
   "ubigeo": 50112,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Socos"
  },
  {
   "ubigeo": 50113,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Tambillo"
  },
  {
   "ubigeo": 50114,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Vinchos"
  },
  {
   "ubigeo": 50115,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Jesús Nazareno"
  },
  {
   "ubigeo": 50116,
   "departamento": "Ayacucho",
   "provincia": "Huamanga",
   "distrito": "Andrés Avelino Cáceres Dorregaray"
  },
  {
   "ubigeo": 50201,
   "departamento": "Ayacucho",
   "provincia": "Cangallo",
   "distrito": "Cangallo"
  },
  {
   "ubigeo": 50202,
   "departamento": "Ayacucho",
   "provincia": "Cangallo",
   "distrito": "Chuschi"
  },
  {
   "ubigeo": 50203,
   "departamento": "Ayacucho",
   "provincia": "Cangallo",
   "distrito": "Los Morochucos"
  },
  {
   "ubigeo": 50204,
   "departamento": "Ayacucho",
   "provincia": "Cangallo",
   "distrito": "María Parado de Bellido"
  },
  {
   "ubigeo": 50205,
   "departamento": "Ayacucho",
   "provincia": "Cangallo",
   "distrito": "Paras"
  },
  {
   "ubigeo": 50206,
   "departamento": "Ayacucho",
   "provincia": "Cangallo",
   "distrito": "Totos"
  },
  {
   "ubigeo": 50301,
   "departamento": "Ayacucho",
   "provincia": "Huanca Sancos",
   "distrito": "Sancos"
  },
  {
   "ubigeo": 50302,
   "departamento": "Ayacucho",
   "provincia": "Huanca Sancos",
   "distrito": "Carapo"
  },
  {
   "ubigeo": 50303,
   "departamento": "Ayacucho",
   "provincia": "Huanca Sancos",
   "distrito": "Sacsamarca"
  },
  {
   "ubigeo": 50304,
   "departamento": "Ayacucho",
   "provincia": "Huanca Sancos",
   "distrito": "Santiago de Lucanamarca"
  },
  {
   "ubigeo": 50401,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Huanta"
  },
  {
   "ubigeo": 50402,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Ayahuanco"
  },
  {
   "ubigeo": 50403,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Huamanguilla"
  },
  {
   "ubigeo": 50404,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Iguain"
  },
  {
   "ubigeo": 50405,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Luricocha"
  },
  {
   "ubigeo": 50406,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Santillana"
  },
  {
   "ubigeo": 50407,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Sivia"
  },
  {
   "ubigeo": 50408,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Llochegua"
  },
  {
   "ubigeo": 50409,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Canayre"
  },
  {
   "ubigeo": 50410,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Uchuraccay"
  },
  {
   "ubigeo": 50411,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Pucacolpa"
  },
  {
   "ubigeo": 50412,
   "departamento": "Ayacucho",
   "provincia": "Huanta",
   "distrito": "Chaca"
  },
  {
   "ubigeo": 50501,
   "departamento": "Ayacucho",
   "provincia": "La Mar",
   "distrito": "San Miguel"
  },
  {
   "ubigeo": 50502,
   "departamento": "Ayacucho",
   "provincia": "La Mar",
   "distrito": "Anco"
  },
  {
   "ubigeo": 50503,
   "departamento": "Ayacucho",
   "provincia": "La Mar",
   "distrito": "Ayna"
  },
  {
   "ubigeo": 50504,
   "departamento": "Ayacucho",
   "provincia": "La Mar",
   "distrito": "Chilcas"
  },
  {
   "ubigeo": 50505,
   "departamento": "Ayacucho",
   "provincia": "La Mar",
   "distrito": "Chungui"
  },
  {
   "ubigeo": 50506,
   "departamento": "Ayacucho",
   "provincia": "La Mar",
   "distrito": "Luis Carranza"
  },
  {
   "ubigeo": 50507,
   "departamento": "Ayacucho",
   "provincia": "La Mar",
   "distrito": "Santa Rosa"
  },
  {
   "ubigeo": 50508,
   "departamento": "Ayacucho",
   "provincia": "La Mar",
   "distrito": "Tambo"
  },
  {
   "ubigeo": 50509,
   "departamento": "Ayacucho",
   "provincia": "La Mar",
   "distrito": "Samugari"
  },
  {
   "ubigeo": 50510,
   "departamento": "Ayacucho",
   "provincia": "La Mar",
   "distrito": "Anchihuay"
  },
  {
   "ubigeo": 50601,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Puquio"
  },
  {
   "ubigeo": 50602,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Aucara"
  },
  {
   "ubigeo": 50603,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Cabana"
  },
  {
   "ubigeo": 50604,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Carmen Salcedo"
  },
  {
   "ubigeo": 50605,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Chaviña"
  },
  {
   "ubigeo": 50606,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Chipao"
  },
  {
   "ubigeo": 50607,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Huac-Huas"
  },
  {
   "ubigeo": 50608,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Laramate"
  },
  {
   "ubigeo": 50609,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Leoncio Prado"
  },
  {
   "ubigeo": 50610,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Llauta"
  },
  {
   "ubigeo": 50611,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Lucanas"
  },
  {
   "ubigeo": 50612,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Ocaña"
  },
  {
   "ubigeo": 50613,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Otoca"
  },
  {
   "ubigeo": 50614,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Saisa"
  },
  {
   "ubigeo": 50615,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "San Cristóbal"
  },
  {
   "ubigeo": 50616,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "San Juan"
  },
  {
   "ubigeo": 50617,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "San Pedro"
  },
  {
   "ubigeo": 50618,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "San Pedro de Palco"
  },
  {
   "ubigeo": 50619,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Sancos"
  },
  {
   "ubigeo": 50620,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Santa Ana de Huaycahuacho"
  },
  {
   "ubigeo": 50621,
   "departamento": "Ayacucho",
   "provincia": "Lucanas",
   "distrito": "Santa Lucia"
  },
  {
   "ubigeo": 50701,
   "departamento": "Ayacucho",
   "provincia": "Parinacochas",
   "distrito": "Coracora"
  },
  {
   "ubigeo": 50702,
   "departamento": "Ayacucho",
   "provincia": "Parinacochas",
   "distrito": "Chumpi"
  },
  {
   "ubigeo": 50703,
   "departamento": "Ayacucho",
   "provincia": "Parinacochas",
   "distrito": "Coronel Castañeda"
  },
  {
   "ubigeo": 50704,
   "departamento": "Ayacucho",
   "provincia": "Parinacochas",
   "distrito": "Pacapausa"
  },
  {
   "ubigeo": 50705,
   "departamento": "Ayacucho",
   "provincia": "Parinacochas",
   "distrito": "Pullo"
  },
  {
   "ubigeo": 50706,
   "departamento": "Ayacucho",
   "provincia": "Parinacochas",
   "distrito": "Puyusca"
  },
  {
   "ubigeo": 50707,
   "departamento": "Ayacucho",
   "provincia": "Parinacochas",
   "distrito": "San Francisco de Ravacayco"
  },
  {
   "ubigeo": 50708,
   "departamento": "Ayacucho",
   "provincia": "Parinacochas",
   "distrito": "Upahuacho"
  },
  {
   "ubigeo": 50801,
   "departamento": "Ayacucho",
   "provincia": "Pàucar del Sara Sara",
   "distrito": "Pausa"
  },
  {
   "ubigeo": 50802,
   "departamento": "Ayacucho",
   "provincia": "Pàucar del Sara Sara",
   "distrito": "Colta"
  },
  {
   "ubigeo": 50803,
   "departamento": "Ayacucho",
   "provincia": "Pàucar del Sara Sara",
   "distrito": "Corculla"
  },
  {
   "ubigeo": 50804,
   "departamento": "Ayacucho",
   "provincia": "Pàucar del Sara Sara",
   "distrito": "Lampa"
  },
  {
   "ubigeo": 50805,
   "departamento": "Ayacucho",
   "provincia": "Pàucar del Sara Sara",
   "distrito": "Marcabamba"
  },
  {
   "ubigeo": 50806,
   "departamento": "Ayacucho",
   "provincia": "Pàucar del Sara Sara",
   "distrito": "Oyolo"
  },
  {
   "ubigeo": 50807,
   "departamento": "Ayacucho",
   "provincia": "Pàucar del Sara Sara",
   "distrito": "Pararca"
  },
  {
   "ubigeo": 50808,
   "departamento": "Ayacucho",
   "provincia": "Pàucar del Sara Sara",
   "distrito": "San Javier de Alpabamba"
  },
  {
   "ubigeo": 50809,
   "departamento": "Ayacucho",
   "provincia": "Pàucar del Sara Sara",
   "distrito": "San José de Ushua"
  },
  {
   "ubigeo": 50810,
   "departamento": "Ayacucho",
   "provincia": "Pàucar del Sara Sara",
   "distrito": "Sara Sara"
  },
  {
   "ubigeo": 50901,
   "departamento": "Ayacucho",
   "provincia": "Sucre",
   "distrito": "Querobamba"
  },
  {
   "ubigeo": 50902,
   "departamento": "Ayacucho",
   "provincia": "Sucre",
   "distrito": "Belén"
  },
  {
   "ubigeo": 50903,
   "departamento": "Ayacucho",
   "provincia": "Sucre",
   "distrito": "Chalcos"
  },
  {
   "ubigeo": 50904,
   "departamento": "Ayacucho",
   "provincia": "Sucre",
   "distrito": "Chilcayoc"
  },
  {
   "ubigeo": 50905,
   "departamento": "Ayacucho",
   "provincia": "Sucre",
   "distrito": "Huacaña"
  },
  {
   "ubigeo": 50906,
   "departamento": "Ayacucho",
   "provincia": "Sucre",
   "distrito": "Morcolla"
  },
  {
   "ubigeo": 50907,
   "departamento": "Ayacucho",
   "provincia": "Sucre",
   "distrito": "Paico"
  },
  {
   "ubigeo": 50908,
   "departamento": "Ayacucho",
   "provincia": "Sucre",
   "distrito": "San Pedro de Larcay"
  },
  {
   "ubigeo": 50909,
   "departamento": "Ayacucho",
   "provincia": "Sucre",
   "distrito": "San Salvador de Quije"
  },
  {
   "ubigeo": 50910,
   "departamento": "Ayacucho",
   "provincia": "Sucre",
   "distrito": "Santiago de Paucaray"
  },
  {
   "ubigeo": 50911,
   "departamento": "Ayacucho",
   "provincia": "Sucre",
   "distrito": "Soras"
  },
  {
   "ubigeo": 51001,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Huancapi"
  },
  {
   "ubigeo": 51002,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Alcamenca"
  },
  {
   "ubigeo": 51003,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Apongo"
  },
  {
   "ubigeo": 51004,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Asquipata"
  },
  {
   "ubigeo": 51005,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Canaria"
  },
  {
   "ubigeo": 51006,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Cayara"
  },
  {
   "ubigeo": 51007,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Colca"
  },
  {
   "ubigeo": 51008,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Huamanquiquia"
  },
  {
   "ubigeo": 51009,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Huancaraylla"
  },
  {
   "ubigeo": 51010,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Huaya"
  },
  {
   "ubigeo": 51011,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Sarhua"
  },
  {
   "ubigeo": 51012,
   "departamento": "Ayacucho",
   "provincia": "Víctor Fajardo",
   "distrito": "Vilcanchos"
  },
  {
   "ubigeo": 51101,
   "departamento": "Ayacucho",
   "provincia": "Vilcas Huamán",
   "distrito": "Vilcas Huaman"
  },
  {
   "ubigeo": 51102,
   "departamento": "Ayacucho",
   "provincia": "Vilcas Huamán",
   "distrito": "Accomarca"
  },
  {
   "ubigeo": 51103,
   "departamento": "Ayacucho",
   "provincia": "Vilcas Huamán",
   "distrito": "Carhuanca"
  },
  {
   "ubigeo": 51104,
   "departamento": "Ayacucho",
   "provincia": "Vilcas Huamán",
   "distrito": "Concepción"
  },
  {
   "ubigeo": 51105,
   "departamento": "Ayacucho",
   "provincia": "Vilcas Huamán",
   "distrito": "Huambalpa"
  },
  {
   "ubigeo": 51106,
   "departamento": "Ayacucho",
   "provincia": "Vilcas Huamán",
   "distrito": "Independencia"
  },
  {
   "ubigeo": 51107,
   "departamento": "Ayacucho",
   "provincia": "Vilcas Huamán",
   "distrito": "Saurama"
  },
  {
   "ubigeo": 51108,
   "departamento": "Ayacucho",
   "provincia": "Vilcas Huamán",
   "distrito": "Vischongo"
  },
  {
   "ubigeo": 60101,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "Cajamarca"
  },
  {
   "ubigeo": 60102,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "Asunción"
  },
  {
   "ubigeo": 60103,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "Chetilla"
  },
  {
   "ubigeo": 60104,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "Cospan"
  },
  {
   "ubigeo": 60105,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "Encañada"
  },
  {
   "ubigeo": 60106,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "Jesús"
  },
  {
   "ubigeo": 60107,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "Llacanora"
  },
  {
   "ubigeo": 60108,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "Los Baños del Inca"
  },
  {
   "ubigeo": 60109,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "Magdalena"
  },
  {
   "ubigeo": 60110,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "Matara"
  },
  {
   "ubigeo": 60111,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "Namora"
  },
  {
   "ubigeo": 60112,
   "departamento": "Cajamarca",
   "provincia": "Cajamarca",
   "distrito": "San Juan"
  },
  {
   "ubigeo": 60201,
   "departamento": "Cajamarca",
   "provincia": "Cajabamba",
   "distrito": "Cajabamba"
  },
  {
   "ubigeo": 60202,
   "departamento": "Cajamarca",
   "provincia": "Cajabamba",
   "distrito": "Cachachi"
  },
  {
   "ubigeo": 60203,
   "departamento": "Cajamarca",
   "provincia": "Cajabamba",
   "distrito": "Condebamba"
  },
  {
   "ubigeo": 60204,
   "departamento": "Cajamarca",
   "provincia": "Cajabamba",
   "distrito": "Sitacocha"
  },
  {
   "ubigeo": 60301,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "Celendín"
  },
  {
   "ubigeo": 60302,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "Chumuch"
  },
  {
   "ubigeo": 60303,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "Cortegana"
  },
  {
   "ubigeo": 60304,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "Huasmin"
  },
  {
   "ubigeo": 60305,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "Jorge Chávez"
  },
  {
   "ubigeo": 60306,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "José Gálvez"
  },
  {
   "ubigeo": 60307,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "Miguel Iglesias"
  },
  {
   "ubigeo": 60308,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "Oxamarca"
  },
  {
   "ubigeo": 60309,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "Sorochuco"
  },
  {
   "ubigeo": 60310,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "Sucre"
  },
  {
   "ubigeo": 60311,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "Utco"
  },
  {
   "ubigeo": 60312,
   "departamento": "Cajamarca",
   "provincia": "Celendín",
   "distrito": "La Libertad de Pallan"
  },
  {
   "ubigeo": 60401,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Chota"
  },
  {
   "ubigeo": 60402,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Anguia"
  },
  {
   "ubigeo": 60403,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Chadin"
  },
  {
   "ubigeo": 60404,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Chiguirip"
  },
  {
   "ubigeo": 60405,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Chimban"
  },
  {
   "ubigeo": 60406,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Choropampa"
  },
  {
   "ubigeo": 60407,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Cochabamba"
  },
  {
   "ubigeo": 60408,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Conchan"
  },
  {
   "ubigeo": 60409,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Huambos"
  },
  {
   "ubigeo": 60410,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Lajas"
  },
  {
   "ubigeo": 60411,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Llama"
  },
  {
   "ubigeo": 60412,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Miracosta"
  },
  {
   "ubigeo": 60413,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Paccha"
  },
  {
   "ubigeo": 60414,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Pion"
  },
  {
   "ubigeo": 60415,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Querocoto"
  },
  {
   "ubigeo": 60416,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "San Juan de Licupis"
  },
  {
   "ubigeo": 60417,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Tacabamba"
  },
  {
   "ubigeo": 60418,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Tocmoche"
  },
  {
   "ubigeo": 60419,
   "departamento": "Cajamarca",
   "provincia": "Chota",
   "distrito": "Chalamarca"
  },
  {
   "ubigeo": 60501,
   "departamento": "Cajamarca",
   "provincia": "Contumazá",
   "distrito": "Contumaza"
  },
  {
   "ubigeo": 60502,
   "departamento": "Cajamarca",
   "provincia": "Contumazá",
   "distrito": "Chilete"
  },
  {
   "ubigeo": 60503,
   "departamento": "Cajamarca",
   "provincia": "Contumazá",
   "distrito": "Cupisnique"
  },
  {
   "ubigeo": 60504,
   "departamento": "Cajamarca",
   "provincia": "Contumazá",
   "distrito": "Guzmango"
  },
  {
   "ubigeo": 60505,
   "departamento": "Cajamarca",
   "provincia": "Contumazá",
   "distrito": "San Benito"
  },
  {
   "ubigeo": 60506,
   "departamento": "Cajamarca",
   "provincia": "Contumazá",
   "distrito": "Santa Cruz de Toledo"
  },
  {
   "ubigeo": 60507,
   "departamento": "Cajamarca",
   "provincia": "Contumazá",
   "distrito": "Tantarica"
  },
  {
   "ubigeo": 60508,
   "departamento": "Cajamarca",
   "provincia": "Contumazá",
   "distrito": "Yonan"
  },
  {
   "ubigeo": 60601,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "Cutervo"
  },
  {
   "ubigeo": 60602,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "Callayuc"
  },
  {
   "ubigeo": 60603,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "Choros"
  },
  {
   "ubigeo": 60604,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "Cujillo"
  },
  {
   "ubigeo": 60605,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "La Ramada"
  },
  {
   "ubigeo": 60606,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "Pimpingos"
  },
  {
   "ubigeo": 60607,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "Querocotillo"
  },
  {
   "ubigeo": 60608,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "San Andrés de Cutervo"
  },
  {
   "ubigeo": 60609,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "San Juan de Cutervo"
  },
  {
   "ubigeo": 60610,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "San Luis de Lucma"
  },
  {
   "ubigeo": 60611,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "Santa Cruz"
  },
  {
   "ubigeo": 60612,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "Santo Domingo de la Capilla"
  },
  {
   "ubigeo": 60613,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "Santo Tomas"
  },
  {
   "ubigeo": 60614,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "Socota"
  },
  {
   "ubigeo": 60615,
   "departamento": "Cajamarca",
   "provincia": "Cutervo",
   "distrito": "Toribio Casanova"
  },
  {
   "ubigeo": 60701,
   "departamento": "Cajamarca",
   "provincia": "Hualgayoc",
   "distrito": "Bambamarca"
  },
  {
   "ubigeo": 60702,
   "departamento": "Cajamarca",
   "provincia": "Hualgayoc",
   "distrito": "Chugur"
  },
  {
   "ubigeo": 60703,
   "departamento": "Cajamarca",
   "provincia": "Hualgayoc",
   "distrito": "Hualgayoc"
  },
  {
   "ubigeo": 60801,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "Jaén"
  },
  {
   "ubigeo": 60802,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "Bellavista"
  },
  {
   "ubigeo": 60803,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "Chontali"
  },
  {
   "ubigeo": 60804,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "Colasay"
  },
  {
   "ubigeo": 60805,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "Huabal"
  },
  {
   "ubigeo": 60806,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "Las Pirias"
  },
  {
   "ubigeo": 60807,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "Pomahuaca"
  },
  {
   "ubigeo": 60808,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "Pucara"
  },
  {
   "ubigeo": 60809,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "Sallique"
  },
  {
   "ubigeo": 60810,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "San Felipe"
  },
  {
   "ubigeo": 60811,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "San José del Alto"
  },
  {
   "ubigeo": 60812,
   "departamento": "Cajamarca",
   "provincia": "Jaén",
   "distrito": "Santa Rosa"
  },
  {
   "ubigeo": 60901,
   "departamento": "Cajamarca",
   "provincia": "San Ignacio",
   "distrito": "San Ignacio"
  },
  {
   "ubigeo": 60902,
   "departamento": "Cajamarca",
   "provincia": "San Ignacio",
   "distrito": "Chirinos"
  },
  {
   "ubigeo": 60903,
   "departamento": "Cajamarca",
   "provincia": "San Ignacio",
   "distrito": "Huarango"
  },
  {
   "ubigeo": 60904,
   "departamento": "Cajamarca",
   "provincia": "San Ignacio",
   "distrito": "La Coipa"
  },
  {
   "ubigeo": 60905,
   "departamento": "Cajamarca",
   "provincia": "San Ignacio",
   "distrito": "Namballe"
  },
  {
   "ubigeo": 60906,
   "departamento": "Cajamarca",
   "provincia": "San Ignacio",
   "distrito": "San José de Lourdes"
  },
  {
   "ubigeo": 60907,
   "departamento": "Cajamarca",
   "provincia": "San Ignacio",
   "distrito": "Tabaconas"
  },
  {
   "ubigeo": 61001,
   "departamento": "Cajamarca",
   "provincia": "San Marcos",
   "distrito": "Pedro Gálvez"
  },
  {
   "ubigeo": 61002,
   "departamento": "Cajamarca",
   "provincia": "San Marcos",
   "distrito": "Chancay"
  },
  {
   "ubigeo": 61003,
   "departamento": "Cajamarca",
   "provincia": "San Marcos",
   "distrito": "Eduardo Villanueva"
  },
  {
   "ubigeo": 61004,
   "departamento": "Cajamarca",
   "provincia": "San Marcos",
   "distrito": "Gregorio Pita"
  },
  {
   "ubigeo": 61005,
   "departamento": "Cajamarca",
   "provincia": "San Marcos",
   "distrito": "Ichocan"
  },
  {
   "ubigeo": 61006,
   "departamento": "Cajamarca",
   "provincia": "San Marcos",
   "distrito": "José Manuel Quiroz"
  },
  {
   "ubigeo": 61007,
   "departamento": "Cajamarca",
   "provincia": "San Marcos",
   "distrito": "José Sabogal"
  },
  {
   "ubigeo": 61101,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "San Miguel"
  },
  {
   "ubigeo": 61102,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "Bolívar"
  },
  {
   "ubigeo": 61103,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "Calquis"
  },
  {
   "ubigeo": 61104,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "Catilluc"
  },
  {
   "ubigeo": 61105,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "El Prado"
  },
  {
   "ubigeo": 61106,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "La Florida"
  },
  {
   "ubigeo": 61107,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "Llapa"
  },
  {
   "ubigeo": 61108,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "Nanchoc"
  },
  {
   "ubigeo": 61109,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "Niepos"
  },
  {
   "ubigeo": 61110,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "San Gregorio"
  },
  {
   "ubigeo": 61111,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "San Silvestre de Cochan"
  },
  {
   "ubigeo": 61112,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "Tongod"
  },
  {
   "ubigeo": 61113,
   "departamento": "Cajamarca",
   "provincia": "San Miguel",
   "distrito": "Unión Agua Blanca"
  },
  {
   "ubigeo": 61201,
   "departamento": "Cajamarca",
   "provincia": "San Pablo",
   "distrito": "San Pablo"
  },
  {
   "ubigeo": 61202,
   "departamento": "Cajamarca",
   "provincia": "San Pablo",
   "distrito": "San Bernardino"
  },
  {
   "ubigeo": 61203,
   "departamento": "Cajamarca",
   "provincia": "San Pablo",
   "distrito": "San Luis"
  },
  {
   "ubigeo": 61204,
   "departamento": "Cajamarca",
   "provincia": "San Pablo",
   "distrito": "Tumbaden"
  },
  {
   "ubigeo": 61301,
   "departamento": "Cajamarca",
   "provincia": "Santa Cruz",
   "distrito": "Santa Cruz"
  },
  {
   "ubigeo": 61302,
   "departamento": "Cajamarca",
   "provincia": "Santa Cruz",
   "distrito": "Andabamba"
  },
  {
   "ubigeo": 61303,
   "departamento": "Cajamarca",
   "provincia": "Santa Cruz",
   "distrito": "Catache"
  },
  {
   "ubigeo": 61304,
   "departamento": "Cajamarca",
   "provincia": "Santa Cruz",
   "distrito": "Chancaybaños"
  },
  {
   "ubigeo": 61305,
   "departamento": "Cajamarca",
   "provincia": "Santa Cruz",
   "distrito": "La Esperanza"
  },
  {
   "ubigeo": 61306,
   "departamento": "Cajamarca",
   "provincia": "Santa Cruz",
   "distrito": "Ninabamba"
  },
  {
   "ubigeo": 61307,
   "departamento": "Cajamarca",
   "provincia": "Santa Cruz",
   "distrito": "Pulan"
  },
  {
   "ubigeo": 61308,
   "departamento": "Cajamarca",
   "provincia": "Santa Cruz",
   "distrito": "Saucepampa"
  },
  {
   "ubigeo": 61309,
   "departamento": "Cajamarca",
   "provincia": "Santa Cruz",
   "distrito": "Sexi"
  },
  {
   "ubigeo": 61310,
   "departamento": "Cajamarca",
   "provincia": "Santa Cruz",
   "distrito": "Uticyacu"
  },
  {
   "ubigeo": 61311,
   "departamento": "Cajamarca",
   "provincia": "Santa Cruz",
   "distrito": "Yauyucan"
  },
  {
   "ubigeo": 70101,
   "departamento": "Callao",
   "provincia": "Prov. Const. del Callao",
   "distrito": "Callao"
  },
  {
   "ubigeo": 70102,
   "departamento": "Callao",
   "provincia": "Prov. Const. del Callao",
   "distrito": "Bellavista"
  },
  {
   "ubigeo": 70103,
   "departamento": "Callao",
   "provincia": "Prov. Const. del Callao",
   "distrito": "Carmen de la Legua Reynoso"
  },
  {
   "ubigeo": 70104,
   "departamento": "Callao",
   "provincia": "Prov. Const. del Callao",
   "distrito": "La Perla"
  },
  {
   "ubigeo": 70105,
   "departamento": "Callao",
   "provincia": "Prov. Const. del Callao",
   "distrito": "La Punta"
  },
  {
   "ubigeo": 70106,
   "departamento": "Callao",
   "provincia": "Prov. Const. del Callao",
   "distrito": "Ventanilla"
  },
  {
   "ubigeo": 70107,
   "departamento": "Callao",
   "provincia": "Prov. Const. del Callao",
   "distrito": "Mi Perú"
  },
  {
   "ubigeo": 80101,
   "departamento": "Cusco",
   "provincia": "Cusco",
   "distrito": "Cusco"
  },
  {
   "ubigeo": 80102,
   "departamento": "Cusco",
   "provincia": "Cusco",
   "distrito": "Ccorca"
  },
  {
   "ubigeo": 80103,
   "departamento": "Cusco",
   "provincia": "Cusco",
   "distrito": "Poroy"
  },
  {
   "ubigeo": 80104,
   "departamento": "Cusco",
   "provincia": "Cusco",
   "distrito": "San Jerónimo"
  },
  {
   "ubigeo": 80105,
   "departamento": "Cusco",
   "provincia": "Cusco",
   "distrito": "San Sebastian"
  },
  {
   "ubigeo": 80106,
   "departamento": "Cusco",
   "provincia": "Cusco",
   "distrito": "Santiago"
  },
  {
   "ubigeo": 80107,
   "departamento": "Cusco",
   "provincia": "Cusco",
   "distrito": "Saylla"
  },
  {
   "ubigeo": 80108,
   "departamento": "Cusco",
   "provincia": "Cusco",
   "distrito": "Wanchaq"
  },
  {
   "ubigeo": 80201,
   "departamento": "Cusco",
   "provincia": "Acomayo",
   "distrito": "Acomayo"
  },
  {
   "ubigeo": 80202,
   "departamento": "Cusco",
   "provincia": "Acomayo",
   "distrito": "Acopia"
  },
  {
   "ubigeo": 80203,
   "departamento": "Cusco",
   "provincia": "Acomayo",
   "distrito": "Acos"
  },
  {
   "ubigeo": 80204,
   "departamento": "Cusco",
   "provincia": "Acomayo",
   "distrito": "Mosoc Llacta"
  },
  {
   "ubigeo": 80205,
   "departamento": "Cusco",
   "provincia": "Acomayo",
   "distrito": "Pomacanchi"
  },
  {
   "ubigeo": 80206,
   "departamento": "Cusco",
   "provincia": "Acomayo",
   "distrito": "Rondocan"
  },
  {
   "ubigeo": 80207,
   "departamento": "Cusco",
   "provincia": "Acomayo",
   "distrito": "Sangarara"
  },
  {
   "ubigeo": 80301,
   "departamento": "Cusco",
   "provincia": "Anta",
   "distrito": "Anta"
  },
  {
   "ubigeo": 80302,
   "departamento": "Cusco",
   "provincia": "Anta",
   "distrito": "Ancahuasi"
  },
  {
   "ubigeo": 80303,
   "departamento": "Cusco",
   "provincia": "Anta",
   "distrito": "Cachimayo"
  },
  {
   "ubigeo": 80304,
   "departamento": "Cusco",
   "provincia": "Anta",
   "distrito": "Chinchaypujio"
  },
  {
   "ubigeo": 80305,
   "departamento": "Cusco",
   "provincia": "Anta",
   "distrito": "Huarocondo"
  },
  {
   "ubigeo": 80306,
   "departamento": "Cusco",
   "provincia": "Anta",
   "distrito": "Limatambo"
  },
  {
   "ubigeo": 80307,
   "departamento": "Cusco",
   "provincia": "Anta",
   "distrito": "Mollepata"
  },
  {
   "ubigeo": 80308,
   "departamento": "Cusco",
   "provincia": "Anta",
   "distrito": "Pucyura"
  },
  {
   "ubigeo": 80309,
   "departamento": "Cusco",
   "provincia": "Anta",
   "distrito": "Zurite"
  },
  {
   "ubigeo": 80401,
   "departamento": "Cusco",
   "provincia": "Calca",
   "distrito": "Calca"
  },
  {
   "ubigeo": 80402,
   "departamento": "Cusco",
   "provincia": "Calca",
   "distrito": "Coya"
  },
  {
   "ubigeo": 80403,
   "departamento": "Cusco",
   "provincia": "Calca",
   "distrito": "Lamay"
  },
  {
   "ubigeo": 80404,
   "departamento": "Cusco",
   "provincia": "Calca",
   "distrito": "Lares"
  },
  {
   "ubigeo": 80405,
   "departamento": "Cusco",
   "provincia": "Calca",
   "distrito": "Pisac"
  },
  {
   "ubigeo": 80406,
   "departamento": "Cusco",
   "provincia": "Calca",
   "distrito": "San Salvador"
  },
  {
   "ubigeo": 80407,
   "departamento": "Cusco",
   "provincia": "Calca",
   "distrito": "Taray"
  },
  {
   "ubigeo": 80408,
   "departamento": "Cusco",
   "provincia": "Calca",
   "distrito": "Yanatile"
  },
  {
   "ubigeo": 80501,
   "departamento": "Cusco",
   "provincia": "Canas",
   "distrito": "Yanaoca"
  },
  {
   "ubigeo": 80502,
   "departamento": "Cusco",
   "provincia": "Canas",
   "distrito": "Checca"
  },
  {
   "ubigeo": 80503,
   "departamento": "Cusco",
   "provincia": "Canas",
   "distrito": "Kunturkanki"
  },
  {
   "ubigeo": 80504,
   "departamento": "Cusco",
   "provincia": "Canas",
   "distrito": "Langui"
  },
  {
   "ubigeo": 80505,
   "departamento": "Cusco",
   "provincia": "Canas",
   "distrito": "Layo"
  },
  {
   "ubigeo": 80506,
   "departamento": "Cusco",
   "provincia": "Canas",
   "distrito": "Pampamarca"
  },
  {
   "ubigeo": 80507,
   "departamento": "Cusco",
   "provincia": "Canas",
   "distrito": "Quehue"
  },
  {
   "ubigeo": 80508,
   "departamento": "Cusco",
   "provincia": "Canas",
   "distrito": "Tupac Amaru"
  },
  {
   "ubigeo": 80601,
   "departamento": "Cusco",
   "provincia": "Canchis",
   "distrito": "Sicuani"
  },
  {
   "ubigeo": 80602,
   "departamento": "Cusco",
   "provincia": "Canchis",
   "distrito": "Checacupe"
  },
  {
   "ubigeo": 80603,
   "departamento": "Cusco",
   "provincia": "Canchis",
   "distrito": "Combapata"
  },
  {
   "ubigeo": 80604,
   "departamento": "Cusco",
   "provincia": "Canchis",
   "distrito": "Marangani"
  },
  {
   "ubigeo": 80605,
   "departamento": "Cusco",
   "provincia": "Canchis",
   "distrito": "Pitumarca"
  },
  {
   "ubigeo": 80606,
   "departamento": "Cusco",
   "provincia": "Canchis",
   "distrito": "San Pablo"
  },
  {
   "ubigeo": 80607,
   "departamento": "Cusco",
   "provincia": "Canchis",
   "distrito": "San Pedro"
  },
  {
   "ubigeo": 80608,
   "departamento": "Cusco",
   "provincia": "Canchis",
   "distrito": "Tinta"
  },
  {
   "ubigeo": 80701,
   "departamento": "Cusco",
   "provincia": "Chumbivilcas",
   "distrito": "Santo Tomas"
  },
  {
   "ubigeo": 80702,
   "departamento": "Cusco",
   "provincia": "Chumbivilcas",
   "distrito": "Capacmarca"
  },
  {
   "ubigeo": 80703,
   "departamento": "Cusco",
   "provincia": "Chumbivilcas",
   "distrito": "Chamaca"
  },
  {
   "ubigeo": 80704,
   "departamento": "Cusco",
   "provincia": "Chumbivilcas",
   "distrito": "Colquemarca"
  },
  {
   "ubigeo": 80705,
   "departamento": "Cusco",
   "provincia": "Chumbivilcas",
   "distrito": "Livitaca"
  },
  {
   "ubigeo": 80706,
   "departamento": "Cusco",
   "provincia": "Chumbivilcas",
   "distrito": "Llusco"
  },
  {
   "ubigeo": 80707,
   "departamento": "Cusco",
   "provincia": "Chumbivilcas",
   "distrito": "Quiñota"
  },
  {
   "ubigeo": 80708,
   "departamento": "Cusco",
   "provincia": "Chumbivilcas",
   "distrito": "Velille"
  },
  {
   "ubigeo": 80801,
   "departamento": "Cusco",
   "provincia": "Espinar",
   "distrito": "Espinar"
  },
  {
   "ubigeo": 80802,
   "departamento": "Cusco",
   "provincia": "Espinar",
   "distrito": "Condoroma"
  },
  {
   "ubigeo": 80803,
   "departamento": "Cusco",
   "provincia": "Espinar",
   "distrito": "Coporaque"
  },
  {
   "ubigeo": 80804,
   "departamento": "Cusco",
   "provincia": "Espinar",
   "distrito": "Ocoruro"
  },
  {
   "ubigeo": 80805,
   "departamento": "Cusco",
   "provincia": "Espinar",
   "distrito": "Pallpata"
  },
  {
   "ubigeo": 80806,
   "departamento": "Cusco",
   "provincia": "Espinar",
   "distrito": "Pichigua"
  },
  {
   "ubigeo": 80807,
   "departamento": "Cusco",
   "provincia": "Espinar",
   "distrito": "Suyckutambo"
  },
  {
   "ubigeo": 80808,
   "departamento": "Cusco",
   "provincia": "Espinar",
   "distrito": "Alto Pichigua"
  },
  {
   "ubigeo": 80901,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Santa Ana"
  },
  {
   "ubigeo": 80902,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Echarate"
  },
  {
   "ubigeo": 80903,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Huayopata"
  },
  {
   "ubigeo": 80904,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Maranura"
  },
  {
   "ubigeo": 80905,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Ocobamba"
  },
  {
   "ubigeo": 80906,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Quellouno"
  },
  {
   "ubigeo": 80907,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Kimbiri"
  },
  {
   "ubigeo": 80908,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Santa Teresa"
  },
  {
   "ubigeo": 80909,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Vilcabamba"
  },
  {
   "ubigeo": 80910,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Pichari"
  },
  {
   "ubigeo": 80911,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Inkawasi"
  },
  {
   "ubigeo": 80912,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Villa Virgen"
  },
  {
   "ubigeo": 80913,
   "departamento": "Cusco",
   "provincia": "La Convención",
   "distrito": "Villa Kintiarina"
  },
  {
   "ubigeo": 81001,
   "departamento": "Cusco",
   "provincia": "Paruro",
   "distrito": "Paruro"
  },
  {
   "ubigeo": 81002,
   "departamento": "Cusco",
   "provincia": "Paruro",
   "distrito": "Accha"
  },
  {
   "ubigeo": 81003,
   "departamento": "Cusco",
   "provincia": "Paruro",
   "distrito": "Ccapi"
  },
  {
   "ubigeo": 81004,
   "departamento": "Cusco",
   "provincia": "Paruro",
   "distrito": "Colcha"
  },
  {
   "ubigeo": 81005,
   "departamento": "Cusco",
   "provincia": "Paruro",
   "distrito": "Huanoquite"
  },
  {
   "ubigeo": 81006,
   "departamento": "Cusco",
   "provincia": "Paruro",
   "distrito": "Omacha"
  },
  {
   "ubigeo": 81007,
   "departamento": "Cusco",
   "provincia": "Paruro",
   "distrito": "Paccaritambo"
  },
  {
   "ubigeo": 81008,
   "departamento": "Cusco",
   "provincia": "Paruro",
   "distrito": "Pillpinto"
  },
  {
   "ubigeo": 81009,
   "departamento": "Cusco",
   "provincia": "Paruro",
   "distrito": "Yaurisque"
  },
  {
   "ubigeo": 81101,
   "departamento": "Cusco",
   "provincia": "Paucartambo",
   "distrito": "Paucartambo"
  },
  {
   "ubigeo": 81102,
   "departamento": "Cusco",
   "provincia": "Paucartambo",
   "distrito": "Caicay"
  },
  {
   "ubigeo": 81103,
   "departamento": "Cusco",
   "provincia": "Paucartambo",
   "distrito": "Challabamba"
  },
  {
   "ubigeo": 81104,
   "departamento": "Cusco",
   "provincia": "Paucartambo",
   "distrito": "Colquepata"
  },
  {
   "ubigeo": 81105,
   "departamento": "Cusco",
   "provincia": "Paucartambo",
   "distrito": "Huancarani"
  },
  {
   "ubigeo": 81106,
   "departamento": "Cusco",
   "provincia": "Paucartambo",
   "distrito": "Kosñipata"
  },
  {
   "ubigeo": 81201,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Urcos"
  },
  {
   "ubigeo": 81202,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Andahuaylillas"
  },
  {
   "ubigeo": 81203,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Camanti"
  },
  {
   "ubigeo": 81204,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Ccarhuayo"
  },
  {
   "ubigeo": 81205,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Ccatca"
  },
  {
   "ubigeo": 81206,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Cusipata"
  },
  {
   "ubigeo": 81207,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Huaro"
  },
  {
   "ubigeo": 81208,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Lucre"
  },
  {
   "ubigeo": 81209,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Marcapata"
  },
  {
   "ubigeo": 81210,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Ocongate"
  },
  {
   "ubigeo": 81211,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Oropesa"
  },
  {
   "ubigeo": 81212,
   "departamento": "Cusco",
   "provincia": "Quispicanchi",
   "distrito": "Quiquijana"
  },
  {
   "ubigeo": 81301,
   "departamento": "Cusco",
   "provincia": "Urubamba",
   "distrito": "Urubamba"
  },
  {
   "ubigeo": 81302,
   "departamento": "Cusco",
   "provincia": "Urubamba",
   "distrito": "Chinchero"
  },
  {
   "ubigeo": 81303,
   "departamento": "Cusco",
   "provincia": "Urubamba",
   "distrito": "Huayllabamba"
  },
  {
   "ubigeo": 81304,
   "departamento": "Cusco",
   "provincia": "Urubamba",
   "distrito": "Machupicchu"
  },
  {
   "ubigeo": 81305,
   "departamento": "Cusco",
   "provincia": "Urubamba",
   "distrito": "Maras"
  },
  {
   "ubigeo": 81306,
   "departamento": "Cusco",
   "provincia": "Urubamba",
   "distrito": "Ollantaytambo"
  },
  {
   "ubigeo": 81307,
   "departamento": "Cusco",
   "provincia": "Urubamba",
   "distrito": "Yucay"
  },
  {
   "ubigeo": 90101,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Huancavelica"
  },
  {
   "ubigeo": 90102,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Acobambilla"
  },
  {
   "ubigeo": 90103,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Acoria"
  },
  {
   "ubigeo": 90104,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Conayca"
  },
  {
   "ubigeo": 90105,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Cuenca"
  },
  {
   "ubigeo": 90106,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Huachocolpa"
  },
  {
   "ubigeo": 90107,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Huayllahuara"
  },
  {
   "ubigeo": 90108,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Izcuchaca"
  },
  {
   "ubigeo": 90109,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Laria"
  },
  {
   "ubigeo": 90110,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Manta"
  },
  {
   "ubigeo": 90111,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Mariscal Cáceres"
  },
  {
   "ubigeo": 90112,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Moya"
  },
  {
   "ubigeo": 90113,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Nuevo Occoro"
  },
  {
   "ubigeo": 90114,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Palca"
  },
  {
   "ubigeo": 90115,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Pilchaca"
  },
  {
   "ubigeo": 90116,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Vilca"
  },
  {
   "ubigeo": 90117,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Yauli"
  },
  {
   "ubigeo": 90118,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Ascensión"
  },
  {
   "ubigeo": 90119,
   "departamento": "Huancavelica",
   "provincia": "Huancavelica",
   "distrito": "Huando"
  },
  {
   "ubigeo": 90201,
   "departamento": "Huancavelica",
   "provincia": "Acobamba",
   "distrito": "Acobamba"
  },
  {
   "ubigeo": 90202,
   "departamento": "Huancavelica",
   "provincia": "Acobamba",
   "distrito": "Andabamba"
  },
  {
   "ubigeo": 90203,
   "departamento": "Huancavelica",
   "provincia": "Acobamba",
   "distrito": "Anta"
  },
  {
   "ubigeo": 90204,
   "departamento": "Huancavelica",
   "provincia": "Acobamba",
   "distrito": "Caja"
  },
  {
   "ubigeo": 90205,
   "departamento": "Huancavelica",
   "provincia": "Acobamba",
   "distrito": "Marcas"
  },
  {
   "ubigeo": 90206,
   "departamento": "Huancavelica",
   "provincia": "Acobamba",
   "distrito": "Paucara"
  },
  {
   "ubigeo": 90207,
   "departamento": "Huancavelica",
   "provincia": "Acobamba",
   "distrito": "Pomacocha"
  },
  {
   "ubigeo": 90208,
   "departamento": "Huancavelica",
   "provincia": "Acobamba",
   "distrito": "Rosario"
  },
  {
   "ubigeo": 90301,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "Lircay"
  },
  {
   "ubigeo": 90302,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "Anchonga"
  },
  {
   "ubigeo": 90303,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "Callanmarca"
  },
  {
   "ubigeo": 90304,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "Ccochaccasa"
  },
  {
   "ubigeo": 90305,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "Chincho"
  },
  {
   "ubigeo": 90306,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "Congalla"
  },
  {
   "ubigeo": 90307,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "Huanca-Huanca"
  },
  {
   "ubigeo": 90308,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "Huayllay Grande"
  },
  {
   "ubigeo": 90309,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "Julcamarca"
  },
  {
   "ubigeo": 90310,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "San Antonio de Antaparco"
  },
  {
   "ubigeo": 90311,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "Santo Tomas de Pata"
  },
  {
   "ubigeo": 90312,
   "departamento": "Huancavelica",
   "provincia": "Angaraes",
   "distrito": "Secclla"
  },
  {
   "ubigeo": 90401,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Castrovirreyna"
  },
  {
   "ubigeo": 90402,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Arma"
  },
  {
   "ubigeo": 90403,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Aurahua"
  },
  {
   "ubigeo": 90404,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Capillas"
  },
  {
   "ubigeo": 90405,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Chupamarca"
  },
  {
   "ubigeo": 90406,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Cocas"
  },
  {
   "ubigeo": 90407,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Huachos"
  },
  {
   "ubigeo": 90408,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Huamatambo"
  },
  {
   "ubigeo": 90409,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Mollepampa"
  },
  {
   "ubigeo": 90410,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "San Juan"
  },
  {
   "ubigeo": 90411,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Santa Ana"
  },
  {
   "ubigeo": 90412,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Tantara"
  },
  {
   "ubigeo": 90413,
   "departamento": "Huancavelica",
   "provincia": "Castrovirreyna",
   "distrito": "Ticrapo"
  },
  {
   "ubigeo": 90501,
   "departamento": "Huancavelica",
   "provincia": "Churcampa",
   "distrito": "Churcampa"
  },
  {
   "ubigeo": 90502,
   "departamento": "Huancavelica",
   "provincia": "Churcampa",
   "distrito": "Anco"
  },
  {
   "ubigeo": 90503,
   "departamento": "Huancavelica",
   "provincia": "Churcampa",
   "distrito": "Chinchihuasi"
  },
  {
   "ubigeo": 90504,
   "departamento": "Huancavelica",
   "provincia": "Churcampa",
   "distrito": "El Carmen"
  },
  {
   "ubigeo": 90505,
   "departamento": "Huancavelica",
   "provincia": "Churcampa",
   "distrito": "La Merced"
  },
  {
   "ubigeo": 90506,
   "departamento": "Huancavelica",
   "provincia": "Churcampa",
   "distrito": "Locroja"
  },
  {
   "ubigeo": 90507,
   "departamento": "Huancavelica",
   "provincia": "Churcampa",
   "distrito": "Paucarbamba"
  },
  {
   "ubigeo": 90508,
   "departamento": "Huancavelica",
   "provincia": "Churcampa",
   "distrito": "San Miguel de Mayocc"
  },
  {
   "ubigeo": 90509,
   "departamento": "Huancavelica",
   "provincia": "Churcampa",
   "distrito": "San Pedro de Coris"
  },
  {
   "ubigeo": 90510,
   "departamento": "Huancavelica",
   "provincia": "Churcampa",
   "distrito": "Pachamarca"
  },
  {
   "ubigeo": 90511,
   "departamento": "Huancavelica",
   "provincia": "Churcampa",
   "distrito": "Cosme"
  },
  {
   "ubigeo": 90601,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Huaytara"
  },
  {
   "ubigeo": 90602,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Ayavi"
  },
  {
   "ubigeo": 90603,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Córdova"
  },
  {
   "ubigeo": 90604,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Huayacundo Arma"
  },
  {
   "ubigeo": 90605,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Laramarca"
  },
  {
   "ubigeo": 90606,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Ocoyo"
  },
  {
   "ubigeo": 90607,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Pilpichaca"
  },
  {
   "ubigeo": 90608,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Querco"
  },
  {
   "ubigeo": 90609,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Quito-Arma"
  },
  {
   "ubigeo": 90610,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "San Antonio de Cusicancha"
  },
  {
   "ubigeo": 90611,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "San Francisco de Sangayaico"
  },
  {
   "ubigeo": 90612,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "San Isidro"
  },
  {
   "ubigeo": 90613,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Santiago de Chocorvos"
  },
  {
   "ubigeo": 90614,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Santiago de Quirahuara"
  },
  {
   "ubigeo": 90615,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Santo Domingo de Capillas"
  },
  {
   "ubigeo": 90616,
   "departamento": "Huancavelica",
   "provincia": "Huaytará",
   "distrito": "Tambo"
  },
  {
   "ubigeo": 90701,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Pampas"
  },
  {
   "ubigeo": 90702,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Acostambo"
  },
  {
   "ubigeo": 90703,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Acraquia"
  },
  {
   "ubigeo": 90704,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Ahuaycha"
  },
  {
   "ubigeo": 90705,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Colcabamba"
  },
  {
   "ubigeo": 90706,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Daniel Hernández"
  },
  {
   "ubigeo": 90707,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Huachocolpa"
  },
  {
   "ubigeo": 90709,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Huaribamba"
  },
  {
   "ubigeo": 90710,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Ñahuimpuquio"
  },
  {
   "ubigeo": 90711,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Pazos"
  },
  {
   "ubigeo": 90713,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Quishuar"
  },
  {
   "ubigeo": 90714,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Salcabamba"
  },
  {
   "ubigeo": 90715,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Salcahuasi"
  },
  {
   "ubigeo": 90716,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "San Marcos de Rocchac"
  },
  {
   "ubigeo": 90717,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Surcubamba"
  },
  {
   "ubigeo": 90718,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Tintay Puncu"
  },
  {
   "ubigeo": 90719,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Quichuas"
  },
  {
   "ubigeo": 90720,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Andaymarca"
  },
  {
   "ubigeo": 90721,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Roble"
  },
  {
   "ubigeo": 90722,
   "departamento": "Huancavelica",
   "provincia": "Tayacaja",
   "distrito": "Pichos"
  },
  {
   "ubigeo": 100101,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "Huanuco"
  },
  {
   "ubigeo": 100102,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "Amarilis"
  },
  {
   "ubigeo": 100103,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "Chinchao"
  },
  {
   "ubigeo": 100104,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "Churubamba"
  },
  {
   "ubigeo": 100105,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "Margos"
  },
  {
   "ubigeo": 100106,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "Quisqui (Kichki)"
  },
  {
   "ubigeo": 100107,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "San Francisco de Cayran"
  },
  {
   "ubigeo": 100108,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "San Pedro de Chaulan"
  },
  {
   "ubigeo": 100109,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "Santa María del Valle"
  },
  {
   "ubigeo": 100110,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "Yarumayo"
  },
  {
   "ubigeo": 100111,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "Pillco Marca"
  },
  {
   "ubigeo": 100112,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "Yacus"
  },
  {
   "ubigeo": 100113,
   "departamento": "Huánuco",
   "provincia": "Huánuco",
   "distrito": "San Pablo de Pillao"
  },
  {
   "ubigeo": 100201,
   "departamento": "Huánuco",
   "provincia": "Ambo",
   "distrito": "Ambo"
  },
  {
   "ubigeo": 100202,
   "departamento": "Huánuco",
   "provincia": "Ambo",
   "distrito": "Cayna"
  },
  {
   "ubigeo": 100203,
   "departamento": "Huánuco",
   "provincia": "Ambo",
   "distrito": "Colpas"
  },
  {
   "ubigeo": 100204,
   "departamento": "Huánuco",
   "provincia": "Ambo",
   "distrito": "Conchamarca"
  },
  {
   "ubigeo": 100205,
   "departamento": "Huánuco",
   "provincia": "Ambo",
   "distrito": "Huacar"
  },
  {
   "ubigeo": 100206,
   "departamento": "Huánuco",
   "provincia": "Ambo",
   "distrito": "San Francisco"
  },
  {
   "ubigeo": 100207,
   "departamento": "Huánuco",
   "provincia": "Ambo",
   "distrito": "San Rafael"
  },
  {
   "ubigeo": 100208,
   "departamento": "Huánuco",
   "provincia": "Ambo",
   "distrito": "Tomay Kichwa"
  },
  {
   "ubigeo": 100301,
   "departamento": "Huánuco",
   "provincia": "Dos de Mayo",
   "distrito": "La Unión"
  },
  {
   "ubigeo": 100307,
   "departamento": "Huánuco",
   "provincia": "Dos de Mayo",
   "distrito": "Chuquis"
  },
  {
   "ubigeo": 100311,
   "departamento": "Huánuco",
   "provincia": "Dos de Mayo",
   "distrito": "Marías"
  },
  {
   "ubigeo": 100313,
   "departamento": "Huánuco",
   "provincia": "Dos de Mayo",
   "distrito": "Pachas"
  },
  {
   "ubigeo": 100316,
   "departamento": "Huánuco",
   "provincia": "Dos de Mayo",
   "distrito": "Quivilla"
  },
  {
   "ubigeo": 100317,
   "departamento": "Huánuco",
   "provincia": "Dos de Mayo",
   "distrito": "Ripan"
  },
  {
   "ubigeo": 100321,
   "departamento": "Huánuco",
   "provincia": "Dos de Mayo",
   "distrito": "Shunqui"
  },
  {
   "ubigeo": 100322,
   "departamento": "Huánuco",
   "provincia": "Dos de Mayo",
   "distrito": "Sillapata"
  },
  {
   "ubigeo": 100323,
   "departamento": "Huánuco",
   "provincia": "Dos de Mayo",
   "distrito": "Yanas"
  },
  {
   "ubigeo": 100401,
   "departamento": "Huánuco",
   "provincia": "Huacaybamba",
   "distrito": "Huacaybamba"
  },
  {
   "ubigeo": 100402,
   "departamento": "Huánuco",
   "provincia": "Huacaybamba",
   "distrito": "Canchabamba"
  },
  {
   "ubigeo": 100403,
   "departamento": "Huánuco",
   "provincia": "Huacaybamba",
   "distrito": "Cochabamba"
  },
  {
   "ubigeo": 100404,
   "departamento": "Huánuco",
   "provincia": "Huacaybamba",
   "distrito": "Pinra"
  },
  {
   "ubigeo": 100501,
   "departamento": "Huánuco",
   "provincia": "Huamalíes",
   "distrito": "Llata"
  },
  {
   "ubigeo": 100502,
   "departamento": "Huánuco",
   "provincia": "Huamalíes",
   "distrito": "Arancay"
  },
  {
   "ubigeo": 100503,
   "departamento": "Huánuco",
   "provincia": "Huamalíes",
   "distrito": "Chavín de Pariarca"
  },
  {
   "ubigeo": 100504,
   "departamento": "Huánuco",
   "provincia": "Huamalíes",
   "distrito": "Jacas Grande"
  },
  {
   "ubigeo": 100505,
   "departamento": "Huánuco",
   "provincia": "Huamalíes",
   "distrito": "Jircan"
  },
  {
   "ubigeo": 100506,
   "departamento": "Huánuco",
   "provincia": "Huamalíes",
   "distrito": "Miraflores"
  },
  {
   "ubigeo": 100507,
   "departamento": "Huánuco",
   "provincia": "Huamalíes",
   "distrito": "Monzón"
  },
  {
   "ubigeo": 100508,
   "departamento": "Huánuco",
   "provincia": "Huamalíes",
   "distrito": "Punchao"
  },
  {
   "ubigeo": 100509,
   "departamento": "Huánuco",
   "provincia": "Huamalíes",
   "distrito": "Puños"
  },
  {
   "ubigeo": 100510,
   "departamento": "Huánuco",
   "provincia": "Huamalíes",
   "distrito": "Singa"
  },
  {
   "ubigeo": 100511,
   "departamento": "Huánuco",
   "provincia": "Huamalíes",
   "distrito": "Tantamayo"
  },
  {
   "ubigeo": 100601,
   "departamento": "Huánuco",
   "provincia": "Leoncio Prado",
   "distrito": "Rupa-Rupa"
  },
  {
   "ubigeo": 100602,
   "departamento": "Huánuco",
   "provincia": "Leoncio Prado",
   "distrito": "Daniel Alomía Robles"
  },
  {
   "ubigeo": 100603,
   "departamento": "Huánuco",
   "provincia": "Leoncio Prado",
   "distrito": "Hermílio Valdizan"
  },
  {
   "ubigeo": 100604,
   "departamento": "Huánuco",
   "provincia": "Leoncio Prado",
   "distrito": "José Crespo y Castillo"
  },
  {
   "ubigeo": 100605,
   "departamento": "Huánuco",
   "provincia": "Leoncio Prado",
   "distrito": "Luyando"
  },
  {
   "ubigeo": 100606,
   "departamento": "Huánuco",
   "provincia": "Leoncio Prado",
   "distrito": "Mariano Damaso Beraun"
  },
  {
   "ubigeo": 100607,
   "departamento": "Huánuco",
   "provincia": "Leoncio Prado",
   "distrito": "Pucayacu"
  },
  {
   "ubigeo": 100608,
   "departamento": "Huánuco",
   "provincia": "Leoncio Prado",
   "distrito": "Castillo Grande"
  },
  {
   "ubigeo": 100701,
   "departamento": "Huánuco",
   "provincia": "Marañón",
   "distrito": "Huacrachuco"
  },
  {
   "ubigeo": 100702,
   "departamento": "Huánuco",
   "provincia": "Marañón",
   "distrito": "Cholon"
  },
  {
   "ubigeo": 100703,
   "departamento": "Huánuco",
   "provincia": "Marañón",
   "distrito": "San Buenaventura"
  },
  {
   "ubigeo": 100704,
   "departamento": "Huánuco",
   "provincia": "Marañón",
   "distrito": "La Morada"
  },
  {
   "ubigeo": 100705,
   "departamento": "Huánuco",
   "provincia": "Marañón",
   "distrito": "Santa Rosa de Alto Yanajanca"
  },
  {
   "ubigeo": 100801,
   "departamento": "Huánuco",
   "provincia": "Pachitea",
   "distrito": "Panao"
  },
  {
   "ubigeo": 100802,
   "departamento": "Huánuco",
   "provincia": "Pachitea",
   "distrito": "Chaglla"
  },
  {
   "ubigeo": 100803,
   "departamento": "Huánuco",
   "provincia": "Pachitea",
   "distrito": "Molino"
  },
  {
   "ubigeo": 100804,
   "departamento": "Huánuco",
   "provincia": "Pachitea",
   "distrito": "Umari"
  },
  {
   "ubigeo": 100901,
   "departamento": "Huánuco",
   "provincia": "Puerto Inca",
   "distrito": "Puerto Inca"
  },
  {
   "ubigeo": 100902,
   "departamento": "Huánuco",
   "provincia": "Puerto Inca",
   "distrito": "Codo del Pozuzo"
  },
  {
   "ubigeo": 100903,
   "departamento": "Huánuco",
   "provincia": "Puerto Inca",
   "distrito": "Honoria"
  },
  {
   "ubigeo": 100904,
   "departamento": "Huánuco",
   "provincia": "Puerto Inca",
   "distrito": "Tournavista"
  },
  {
   "ubigeo": 100905,
   "departamento": "Huánuco",
   "provincia": "Puerto Inca",
   "distrito": "Yuyapichis"
  },
  {
   "ubigeo": 101001,
   "departamento": "Huánuco",
   "provincia": "Lauricocha ",
   "distrito": "Jesús"
  },
  {
   "ubigeo": 101002,
   "departamento": "Huánuco",
   "provincia": "Lauricocha ",
   "distrito": "Baños"
  },
  {
   "ubigeo": 101003,
   "departamento": "Huánuco",
   "provincia": "Lauricocha ",
   "distrito": "Jivia"
  },
  {
   "ubigeo": 101004,
   "departamento": "Huánuco",
   "provincia": "Lauricocha ",
   "distrito": "Queropalca"
  },
  {
   "ubigeo": 101005,
   "departamento": "Huánuco",
   "provincia": "Lauricocha ",
   "distrito": "Rondos"
  },
  {
   "ubigeo": 101006,
   "departamento": "Huánuco",
   "provincia": "Lauricocha ",
   "distrito": "San Francisco de Asís"
  },
  {
   "ubigeo": 101007,
   "departamento": "Huánuco",
   "provincia": "Lauricocha ",
   "distrito": "San Miguel de Cauri"
  },
  {
   "ubigeo": 101101,
   "departamento": "Huánuco",
   "provincia": "Yarowilca ",
   "distrito": "Chavinillo"
  },
  {
   "ubigeo": 101102,
   "departamento": "Huánuco",
   "provincia": "Yarowilca ",
   "distrito": "Cahuac"
  },
  {
   "ubigeo": 101103,
   "departamento": "Huánuco",
   "provincia": "Yarowilca ",
   "distrito": "Chacabamba"
  },
  {
   "ubigeo": 101104,
   "departamento": "Huánuco",
   "provincia": "Yarowilca ",
   "distrito": "Aparicio Pomares"
  },
  {
   "ubigeo": 101105,
   "departamento": "Huánuco",
   "provincia": "Yarowilca ",
   "distrito": "Jacas Chico"
  },
  {
   "ubigeo": 101106,
   "departamento": "Huánuco",
   "provincia": "Yarowilca ",
   "distrito": "Obas"
  },
  {
   "ubigeo": 101107,
   "departamento": "Huánuco",
   "provincia": "Yarowilca ",
   "distrito": "Pampamarca"
  },
  {
   "ubigeo": 101108,
   "departamento": "Huánuco",
   "provincia": "Yarowilca ",
   "distrito": "Choras"
  },
  {
   "ubigeo": 110101,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "Ica"
  },
  {
   "ubigeo": 110102,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "La Tinguiña"
  },
  {
   "ubigeo": 110103,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "Los Aquijes"
  },
  {
   "ubigeo": 110104,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "Ocucaje"
  },
  {
   "ubigeo": 110105,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "Pachacutec"
  },
  {
   "ubigeo": 110106,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "Parcona"
  },
  {
   "ubigeo": 110107,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "Pueblo Nuevo"
  },
  {
   "ubigeo": 110108,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "Salas"
  },
  {
   "ubigeo": 110109,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "San José de Los Molinos"
  },
  {
   "ubigeo": 110110,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "San Juan Bautista"
  },
  {
   "ubigeo": 110111,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "Santiago"
  },
  {
   "ubigeo": 110112,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "Subtanjalla"
  },
  {
   "ubigeo": 110113,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "Tate"
  },
  {
   "ubigeo": 110114,
   "departamento": "Ica",
   "provincia": "Ica ",
   "distrito": "Yauca del Rosario"
  },
  {
   "ubigeo": 110201,
   "departamento": "Ica",
   "provincia": "Chincha ",
   "distrito": "Chincha Alta"
  },
  {
   "ubigeo": 110202,
   "departamento": "Ica",
   "provincia": "Chincha ",
   "distrito": "Alto Laran"
  },
  {
   "ubigeo": 110203,
   "departamento": "Ica",
   "provincia": "Chincha ",
   "distrito": "Chavin"
  },
  {
   "ubigeo": 110204,
   "departamento": "Ica",
   "provincia": "Chincha ",
   "distrito": "Chincha Baja"
  },
  {
   "ubigeo": 110205,
   "departamento": "Ica",
   "provincia": "Chincha ",
   "distrito": "El Carmen"
  },
  {
   "ubigeo": 110206,
   "departamento": "Ica",
   "provincia": "Chincha ",
   "distrito": "Grocio Prado"
  },
  {
   "ubigeo": 110207,
   "departamento": "Ica",
   "provincia": "Chincha ",
   "distrito": "Pueblo Nuevo"
  },
  {
   "ubigeo": 110208,
   "departamento": "Ica",
   "provincia": "Chincha ",
   "distrito": "San Juan de Yanac"
  },
  {
   "ubigeo": 110209,
   "departamento": "Ica",
   "provincia": "Chincha ",
   "distrito": "San Pedro de Huacarpana"
  },
  {
   "ubigeo": 110210,
   "departamento": "Ica",
   "provincia": "Chincha ",
   "distrito": "Sunampe"
  },
  {
   "ubigeo": 110211,
   "departamento": "Ica",
   "provincia": "Chincha ",
   "distrito": "Tambo de Mora"
  },
  {
   "ubigeo": 110301,
   "departamento": "Ica",
   "provincia": "Nasca ",
   "distrito": "Nasca"
  },
  {
   "ubigeo": 110302,
   "departamento": "Ica",
   "provincia": "Nasca ",
   "distrito": "Changuillo"
  },
  {
   "ubigeo": 110303,
   "departamento": "Ica",
   "provincia": "Nasca ",
   "distrito": "El Ingenio"
  },
  {
   "ubigeo": 110304,
   "departamento": "Ica",
   "provincia": "Nasca ",
   "distrito": "Marcona"
  },
  {
   "ubigeo": 110305,
   "departamento": "Ica",
   "provincia": "Nasca ",
   "distrito": "Vista Alegre"
  },
  {
   "ubigeo": 110401,
   "departamento": "Ica",
   "provincia": "Palpa ",
   "distrito": "Palpa"
  },
  {
   "ubigeo": 110402,
   "departamento": "Ica",
   "provincia": "Palpa ",
   "distrito": "Llipata"
  },
  {
   "ubigeo": 110403,
   "departamento": "Ica",
   "provincia": "Palpa ",
   "distrito": "Río Grande"
  },
  {
   "ubigeo": 110404,
   "departamento": "Ica",
   "provincia": "Palpa ",
   "distrito": "Santa Cruz"
  },
  {
   "ubigeo": 110405,
   "departamento": "Ica",
   "provincia": "Palpa ",
   "distrito": "Tibillo"
  },
  {
   "ubigeo": 110501,
   "departamento": "Ica",
   "provincia": "Pisco ",
   "distrito": "Pisco"
  },
  {
   "ubigeo": 110502,
   "departamento": "Ica",
   "provincia": "Pisco ",
   "distrito": "Huancano"
  },
  {
   "ubigeo": 110503,
   "departamento": "Ica",
   "provincia": "Pisco ",
   "distrito": "Humay"
  },
  {
   "ubigeo": 110504,
   "departamento": "Ica",
   "provincia": "Pisco ",
   "distrito": "Independencia"
  },
  {
   "ubigeo": 110505,
   "departamento": "Ica",
   "provincia": "Pisco ",
   "distrito": "Paracas"
  },
  {
   "ubigeo": 110506,
   "departamento": "Ica",
   "provincia": "Pisco ",
   "distrito": "San Andrés"
  },
  {
   "ubigeo": 110507,
   "departamento": "Ica",
   "provincia": "Pisco ",
   "distrito": "San Clemente"
  },
  {
   "ubigeo": 110508,
   "departamento": "Ica",
   "provincia": "Pisco ",
   "distrito": "Tupac Amaru Inca"
  },
  {
   "ubigeo": 120101,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Huancayo"
  },
  {
   "ubigeo": 120104,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Carhuacallanga"
  },
  {
   "ubigeo": 120105,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Chacapampa"
  },
  {
   "ubigeo": 120106,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Chicche"
  },
  {
   "ubigeo": 120107,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Chilca"
  },
  {
   "ubigeo": 120108,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Chongos Alto"
  },
  {
   "ubigeo": 120111,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Chupuro"
  },
  {
   "ubigeo": 120112,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Colca"
  },
  {
   "ubigeo": 120113,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Cullhuas"
  },
  {
   "ubigeo": 120114,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "El Tambo"
  },
  {
   "ubigeo": 120116,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Huacrapuquio"
  },
  {
   "ubigeo": 120117,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Hualhuas"
  },
  {
   "ubigeo": 120119,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Huancan"
  },
  {
   "ubigeo": 120120,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Huasicancha"
  },
  {
   "ubigeo": 120121,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Huayucachi"
  },
  {
   "ubigeo": 120122,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Ingenio"
  },
  {
   "ubigeo": 120124,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Pariahuanca"
  },
  {
   "ubigeo": 120125,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Pilcomayo"
  },
  {
   "ubigeo": 120126,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Pucara"
  },
  {
   "ubigeo": 120127,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Quichuay"
  },
  {
   "ubigeo": 120128,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Quilcas"
  },
  {
   "ubigeo": 120129,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "San Agustín"
  },
  {
   "ubigeo": 120130,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "San Jerónimo de Tunan"
  },
  {
   "ubigeo": 120132,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Saño"
  },
  {
   "ubigeo": 120133,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Sapallanga"
  },
  {
   "ubigeo": 120134,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Sicaya"
  },
  {
   "ubigeo": 120135,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Santo Domingo de Acobamba"
  },
  {
   "ubigeo": 120136,
   "departamento": "Junín",
   "provincia": "Huancayo ",
   "distrito": "Viques"
  },
  {
   "ubigeo": 120201,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Concepción"
  },
  {
   "ubigeo": 120202,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Aco"
  },
  {
   "ubigeo": 120203,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Andamarca"
  },
  {
   "ubigeo": 120204,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Chambara"
  },
  {
   "ubigeo": 120205,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Cochas"
  },
  {
   "ubigeo": 120206,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Comas"
  },
  {
   "ubigeo": 120207,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Heroínas Toledo"
  },
  {
   "ubigeo": 120208,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Manzanares"
  },
  {
   "ubigeo": 120209,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Mariscal Castilla"
  },
  {
   "ubigeo": 120210,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Matahuasi"
  },
  {
   "ubigeo": 120211,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Mito"
  },
  {
   "ubigeo": 120212,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Nueve de Julio"
  },
  {
   "ubigeo": 120213,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Orcotuna"
  },
  {
   "ubigeo": 120214,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "San José de Quero"
  },
  {
   "ubigeo": 120215,
   "departamento": "Junín",
   "provincia": "Concepción ",
   "distrito": "Santa Rosa de Ocopa"
  },
  {
   "ubigeo": 120301,
   "departamento": "Junín",
   "provincia": "Chanchamayo ",
   "distrito": "Chanchamayo"
  },
  {
   "ubigeo": 120302,
   "departamento": "Junín",
   "provincia": "Chanchamayo ",
   "distrito": "Perene"
  },
  {
   "ubigeo": 120303,
   "departamento": "Junín",
   "provincia": "Chanchamayo ",
   "distrito": "Pichanaqui"
  },
  {
   "ubigeo": 120304,
   "departamento": "Junín",
   "provincia": "Chanchamayo ",
   "distrito": "San Luis de Shuaro"
  },
  {
   "ubigeo": 120305,
   "departamento": "Junín",
   "provincia": "Chanchamayo ",
   "distrito": "San Ramón"
  },
  {
   "ubigeo": 120306,
   "departamento": "Junín",
   "provincia": "Chanchamayo ",
   "distrito": "Vitoc"
  },
  {
   "ubigeo": 120401,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Jauja"
  },
  {
   "ubigeo": 120402,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Acolla"
  },
  {
   "ubigeo": 120403,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Apata"
  },
  {
   "ubigeo": 120404,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Ataura"
  },
  {
   "ubigeo": 120405,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Canchayllo"
  },
  {
   "ubigeo": 120406,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Curicaca"
  },
  {
   "ubigeo": 120407,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "El Mantaro"
  },
  {
   "ubigeo": 120408,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Huamali"
  },
  {
   "ubigeo": 120409,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Huaripampa"
  },
  {
   "ubigeo": 120410,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Huertas"
  },
  {
   "ubigeo": 120411,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Janjaillo"
  },
  {
   "ubigeo": 120412,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Julcán"
  },
  {
   "ubigeo": 120413,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Leonor Ordóñez"
  },
  {
   "ubigeo": 120414,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Llocllapampa"
  },
  {
   "ubigeo": 120415,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Marco"
  },
  {
   "ubigeo": 120416,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Masma"
  },
  {
   "ubigeo": 120417,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Masma Chicche"
  },
  {
   "ubigeo": 120418,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Molinos"
  },
  {
   "ubigeo": 120419,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Monobamba"
  },
  {
   "ubigeo": 120420,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Muqui"
  },
  {
   "ubigeo": 120421,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Muquiyauyo"
  },
  {
   "ubigeo": 120422,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Paca"
  },
  {
   "ubigeo": 120423,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Paccha"
  },
  {
   "ubigeo": 120424,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Pancan"
  },
  {
   "ubigeo": 120425,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Parco"
  },
  {
   "ubigeo": 120426,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Pomacancha"
  },
  {
   "ubigeo": 120427,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Ricran"
  },
  {
   "ubigeo": 120428,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "San Lorenzo"
  },
  {
   "ubigeo": 120429,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "San Pedro de Chunan"
  },
  {
   "ubigeo": 120430,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Sausa"
  },
  {
   "ubigeo": 120431,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Sincos"
  },
  {
   "ubigeo": 120432,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Tunan Marca"
  },
  {
   "ubigeo": 120433,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Yauli"
  },
  {
   "ubigeo": 120434,
   "departamento": "Junín",
   "provincia": "Jauja ",
   "distrito": "Yauyos"
  },
  {
   "ubigeo": 120501,
   "departamento": "Junín",
   "provincia": "Junín ",
   "distrito": "Junin"
  },
  {
   "ubigeo": 120502,
   "departamento": "Junín",
   "provincia": "Junín ",
   "distrito": "Carhuamayo"
  },
  {
   "ubigeo": 120503,
   "departamento": "Junín",
   "provincia": "Junín ",
   "distrito": "Ondores"
  },
  {
   "ubigeo": 120504,
   "departamento": "Junín",
   "provincia": "Junín ",
   "distrito": "Ulcumayo"
  },
  {
   "ubigeo": 120601,
   "departamento": "Junín",
   "provincia": "Satipo ",
   "distrito": "Satipo"
  },
  {
   "ubigeo": 120602,
   "departamento": "Junín",
   "provincia": "Satipo ",
   "distrito": "Coviriali"
  },
  {
   "ubigeo": 120603,
   "departamento": "Junín",
   "provincia": "Satipo ",
   "distrito": "Llaylla"
  },
  {
   "ubigeo": 120604,
   "departamento": "Junín",
   "provincia": "Satipo ",
   "distrito": "Mazamari"
  },
  {
   "ubigeo": 120605,
   "departamento": "Junín",
   "provincia": "Satipo ",
   "distrito": "Pampa Hermosa"
  },
  {
   "ubigeo": 120606,
   "departamento": "Junín",
   "provincia": "Satipo ",
   "distrito": "Pangoa"
  },
  {
   "ubigeo": 120607,
   "departamento": "Junín",
   "provincia": "Satipo ",
   "distrito": "Río Negro"
  },
  {
   "ubigeo": 120608,
   "departamento": "Junín",
   "provincia": "Satipo ",
   "distrito": "Río Tambo"
  },
  {
   "ubigeo": 120609,
   "departamento": "Junín",
   "provincia": "Satipo ",
   "distrito": "Vizcatan del Ene"
  },
  {
   "ubigeo": 120701,
   "departamento": "Junín",
   "provincia": "Tarma ",
   "distrito": "Tarma"
  },
  {
   "ubigeo": 120702,
   "departamento": "Junín",
   "provincia": "Tarma ",
   "distrito": "Acobamba"
  },
  {
   "ubigeo": 120703,
   "departamento": "Junín",
   "provincia": "Tarma ",
   "distrito": "Huaricolca"
  },
  {
   "ubigeo": 120704,
   "departamento": "Junín",
   "provincia": "Tarma ",
   "distrito": "Huasahuasi"
  },
  {
   "ubigeo": 120705,
   "departamento": "Junín",
   "provincia": "Tarma ",
   "distrito": "La Unión"
  },
  {
   "ubigeo": 120706,
   "departamento": "Junín",
   "provincia": "Tarma ",
   "distrito": "Palca"
  },
  {
   "ubigeo": 120707,
   "departamento": "Junín",
   "provincia": "Tarma ",
   "distrito": "Palcamayo"
  },
  {
   "ubigeo": 120708,
   "departamento": "Junín",
   "provincia": "Tarma ",
   "distrito": "San Pedro de Cajas"
  },
  {
   "ubigeo": 120709,
   "departamento": "Junín",
   "provincia": "Tarma ",
   "distrito": "Tapo"
  },
  {
   "ubigeo": 120801,
   "departamento": "Junín",
   "provincia": "Yauli ",
   "distrito": "La Oroya"
  },
  {
   "ubigeo": 120802,
   "departamento": "Junín",
   "provincia": "Yauli ",
   "distrito": "Chacapalpa"
  },
  {
   "ubigeo": 120803,
   "departamento": "Junín",
   "provincia": "Yauli ",
   "distrito": "Huay-Huay"
  },
  {
   "ubigeo": 120804,
   "departamento": "Junín",
   "provincia": "Yauli ",
   "distrito": "Marcapomacocha"
  },
  {
   "ubigeo": 120805,
   "departamento": "Junín",
   "provincia": "Yauli ",
   "distrito": "Morococha"
  },
  {
   "ubigeo": 120806,
   "departamento": "Junín",
   "provincia": "Yauli ",
   "distrito": "Paccha"
  },
  {
   "ubigeo": 120807,
   "departamento": "Junín",
   "provincia": "Yauli ",
   "distrito": "Santa Bárbara de Carhuacayan"
  },
  {
   "ubigeo": 120808,
   "departamento": "Junín",
   "provincia": "Yauli ",
   "distrito": "Santa Rosa de Sacco"
  },
  {
   "ubigeo": 120809,
   "departamento": "Junín",
   "provincia": "Yauli ",
   "distrito": "Suitucancha"
  },
  {
   "ubigeo": 120810,
   "departamento": "Junín",
   "provincia": "Yauli ",
   "distrito": "Yauli"
  },
  {
   "ubigeo": 120901,
   "departamento": "Junín",
   "provincia": "Chupaca ",
   "distrito": "Chupaca"
  },
  {
   "ubigeo": 120902,
   "departamento": "Junín",
   "provincia": "Chupaca ",
   "distrito": "Ahuac"
  },
  {
   "ubigeo": 120903,
   "departamento": "Junín",
   "provincia": "Chupaca ",
   "distrito": "Chongos Bajo"
  },
  {
   "ubigeo": 120904,
   "departamento": "Junín",
   "provincia": "Chupaca ",
   "distrito": "Huachac"
  },
  {
   "ubigeo": 120905,
   "departamento": "Junín",
   "provincia": "Chupaca ",
   "distrito": "Huamancaca Chico"
  },
  {
   "ubigeo": 120906,
   "departamento": "Junín",
   "provincia": "Chupaca ",
   "distrito": "San Juan de Iscos"
  },
  {
   "ubigeo": 120907,
   "departamento": "Junín",
   "provincia": "Chupaca ",
   "distrito": "San Juan de Jarpa"
  },
  {
   "ubigeo": 120908,
   "departamento": "Junín",
   "provincia": "Chupaca ",
   "distrito": "Tres de Diciembre"
  },
  {
   "ubigeo": 120909,
   "departamento": "Junín",
   "provincia": "Chupaca ",
   "distrito": "Yanacancha"
  },
  {
   "ubigeo": 130101,
   "departamento": "La Libertad",
   "provincia": "Trujillo ",
   "distrito": "Trujillo"
  },
  {
   "ubigeo": 130102,
   "departamento": "La Libertad",
   "provincia": "Trujillo ",
   "distrito": "El Porvenir"
  },
  {
   "ubigeo": 130103,
   "departamento": "La Libertad",
   "provincia": "Trujillo ",
   "distrito": "Florencia de Mora"
  },
  {
   "ubigeo": 130104,
   "departamento": "La Libertad",
   "provincia": "Trujillo ",
   "distrito": "Huanchaco"
  },
  {
   "ubigeo": 130105,
   "departamento": "La Libertad",
   "provincia": "Trujillo ",
   "distrito": "La Esperanza"
  },
  {
   "ubigeo": 130106,
   "departamento": "La Libertad",
   "provincia": "Trujillo ",
   "distrito": "Laredo"
  },
  {
   "ubigeo": 130107,
   "departamento": "La Libertad",
   "provincia": "Trujillo ",
   "distrito": "Moche"
  },
  {
   "ubigeo": 130108,
   "departamento": "La Libertad",
   "provincia": "Trujillo ",
   "distrito": "Poroto"
  },
  {
   "ubigeo": 130109,
   "departamento": "La Libertad",
   "provincia": "Trujillo ",
   "distrito": "Salaverry"
  },
  {
   "ubigeo": 130110,
   "departamento": "La Libertad",
   "provincia": "Trujillo ",
   "distrito": "Simbal"
  },
  {
   "ubigeo": 130111,
   "departamento": "La Libertad",
   "provincia": "Trujillo ",
   "distrito": "Victor Larco Herrera"
  },
  {
   "ubigeo": 130201,
   "departamento": "La Libertad",
   "provincia": "Ascope ",
   "distrito": "Ascope"
  },
  {
   "ubigeo": 130202,
   "departamento": "La Libertad",
   "provincia": "Ascope ",
   "distrito": "Chicama"
  },
  {
   "ubigeo": 130203,
   "departamento": "La Libertad",
   "provincia": "Ascope ",
   "distrito": "Chocope"
  },
  {
   "ubigeo": 130204,
   "departamento": "La Libertad",
   "provincia": "Ascope ",
   "distrito": "Magdalena de Cao"
  },
  {
   "ubigeo": 130205,
   "departamento": "La Libertad",
   "provincia": "Ascope ",
   "distrito": "Paijan"
  },
  {
   "ubigeo": 130206,
   "departamento": "La Libertad",
   "provincia": "Ascope ",
   "distrito": "Rázuri"
  },
  {
   "ubigeo": 130207,
   "departamento": "La Libertad",
   "provincia": "Ascope ",
   "distrito": "Santiago de Cao"
  },
  {
   "ubigeo": 130208,
   "departamento": "La Libertad",
   "provincia": "Ascope ",
   "distrito": "Casa Grande"
  },
  {
   "ubigeo": 130301,
   "departamento": "La Libertad",
   "provincia": "Bolívar ",
   "distrito": "Bolívar"
  },
  {
   "ubigeo": 130302,
   "departamento": "La Libertad",
   "provincia": "Bolívar ",
   "distrito": "Bambamarca"
  },
  {
   "ubigeo": 130303,
   "departamento": "La Libertad",
   "provincia": "Bolívar ",
   "distrito": "Condormarca"
  },
  {
   "ubigeo": 130304,
   "departamento": "La Libertad",
   "provincia": "Bolívar ",
   "distrito": "Longotea"
  },
  {
   "ubigeo": 130305,
   "departamento": "La Libertad",
   "provincia": "Bolívar ",
   "distrito": "Uchumarca"
  },
  {
   "ubigeo": 130306,
   "departamento": "La Libertad",
   "provincia": "Bolívar ",
   "distrito": "Ucuncha"
  },
  {
   "ubigeo": 130401,
   "departamento": "La Libertad",
   "provincia": "Chepén ",
   "distrito": "Chepen"
  },
  {
   "ubigeo": 130402,
   "departamento": "La Libertad",
   "provincia": "Chepén ",
   "distrito": "Pacanga"
  },
  {
   "ubigeo": 130403,
   "departamento": "La Libertad",
   "provincia": "Chepén ",
   "distrito": "Pueblo Nuevo"
  },
  {
   "ubigeo": 130501,
   "departamento": "La Libertad",
   "provincia": "Julcán ",
   "distrito": "Julcan"
  },
  {
   "ubigeo": 130502,
   "departamento": "La Libertad",
   "provincia": "Julcán ",
   "distrito": "Calamarca"
  },
  {
   "ubigeo": 130503,
   "departamento": "La Libertad",
   "provincia": "Julcán ",
   "distrito": "Carabamba"
  },
  {
   "ubigeo": 130504,
   "departamento": "La Libertad",
   "provincia": "Julcán ",
   "distrito": "Huaso"
  },
  {
   "ubigeo": 130601,
   "departamento": "La Libertad",
   "provincia": "Otuzco ",
   "distrito": "Otuzco"
  },
  {
   "ubigeo": 130602,
   "departamento": "La Libertad",
   "provincia": "Otuzco ",
   "distrito": "Agallpampa"
  },
  {
   "ubigeo": 130604,
   "departamento": "La Libertad",
   "provincia": "Otuzco ",
   "distrito": "Charat"
  },
  {
   "ubigeo": 130605,
   "departamento": "La Libertad",
   "provincia": "Otuzco ",
   "distrito": "Huaranchal"
  },
  {
   "ubigeo": 130606,
   "departamento": "La Libertad",
   "provincia": "Otuzco ",
   "distrito": "La Cuesta"
  },
  {
   "ubigeo": 130608,
   "departamento": "La Libertad",
   "provincia": "Otuzco ",
   "distrito": "Mache"
  },
  {
   "ubigeo": 130610,
   "departamento": "La Libertad",
   "provincia": "Otuzco ",
   "distrito": "Paranday"
  },
  {
   "ubigeo": 130611,
   "departamento": "La Libertad",
   "provincia": "Otuzco ",
   "distrito": "Salpo"
  },
  {
   "ubigeo": 130613,
   "departamento": "La Libertad",
   "provincia": "Otuzco ",
   "distrito": "Sinsicap"
  },
  {
   "ubigeo": 130614,
   "departamento": "La Libertad",
   "provincia": "Otuzco ",
   "distrito": "Usquil"
  },
  {
   "ubigeo": 130701,
   "departamento": "La Libertad",
   "provincia": "Pacasmayo ",
   "distrito": "San Pedro de Lloc"
  },
  {
   "ubigeo": 130702,
   "departamento": "La Libertad",
   "provincia": "Pacasmayo ",
   "distrito": "Guadalupe"
  },
  {
   "ubigeo": 130703,
   "departamento": "La Libertad",
   "provincia": "Pacasmayo ",
   "distrito": "Jequetepeque"
  },
  {
   "ubigeo": 130704,
   "departamento": "La Libertad",
   "provincia": "Pacasmayo ",
   "distrito": "Pacasmayo"
  },
  {
   "ubigeo": 130705,
   "departamento": "La Libertad",
   "provincia": "Pacasmayo ",
   "distrito": "San José"
  },
  {
   "ubigeo": 130801,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Tayabamba"
  },
  {
   "ubigeo": 130802,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Buldibuyo"
  },
  {
   "ubigeo": 130803,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Chillia"
  },
  {
   "ubigeo": 130804,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Huancaspata"
  },
  {
   "ubigeo": 130805,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Huaylillas"
  },
  {
   "ubigeo": 130806,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Huayo"
  },
  {
   "ubigeo": 130807,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Ongon"
  },
  {
   "ubigeo": 130808,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Parcoy"
  },
  {
   "ubigeo": 130809,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Pataz"
  },
  {
   "ubigeo": 130810,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Pias"
  },
  {
   "ubigeo": 130811,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Santiago de Challas"
  },
  {
   "ubigeo": 130812,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Taurija"
  },
  {
   "ubigeo": 130813,
   "departamento": "La Libertad",
   "provincia": "Pataz ",
   "distrito": "Urpay"
  },
  {
   "ubigeo": 130901,
   "departamento": "La Libertad",
   "provincia": "Sánchez Carrión ",
   "distrito": "Huamachuco"
  },
  {
   "ubigeo": 130902,
   "departamento": "La Libertad",
   "provincia": "Sánchez Carrión ",
   "distrito": "Chugay"
  },
  {
   "ubigeo": 130903,
   "departamento": "La Libertad",
   "provincia": "Sánchez Carrión ",
   "distrito": "Cochorco"
  },
  {
   "ubigeo": 130904,
   "departamento": "La Libertad",
   "provincia": "Sánchez Carrión ",
   "distrito": "Curgos"
  },
  {
   "ubigeo": 130905,
   "departamento": "La Libertad",
   "provincia": "Sánchez Carrión ",
   "distrito": "Marcabal"
  },
  {
   "ubigeo": 130906,
   "departamento": "La Libertad",
   "provincia": "Sánchez Carrión ",
   "distrito": "Sanagoran"
  },
  {
   "ubigeo": 130907,
   "departamento": "La Libertad",
   "provincia": "Sánchez Carrión ",
   "distrito": "Sarin"
  },
  {
   "ubigeo": 130908,
   "departamento": "La Libertad",
   "provincia": "Sánchez Carrión ",
   "distrito": "Sartimbamba"
  },
  {
   "ubigeo": 131001,
   "departamento": "La Libertad",
   "provincia": "Santiago de Chuco ",
   "distrito": "Santiago de Chuco"
  },
  {
   "ubigeo": 131002,
   "departamento": "La Libertad",
   "provincia": "Santiago de Chuco ",
   "distrito": "Angasmarca"
  },
  {
   "ubigeo": 131003,
   "departamento": "La Libertad",
   "provincia": "Santiago de Chuco ",
   "distrito": "Cachicadan"
  },
  {
   "ubigeo": 131004,
   "departamento": "La Libertad",
   "provincia": "Santiago de Chuco ",
   "distrito": "Mollebamba"
  },
  {
   "ubigeo": 131005,
   "departamento": "La Libertad",
   "provincia": "Santiago de Chuco ",
   "distrito": "Mollepata"
  },
  {
   "ubigeo": 131006,
   "departamento": "La Libertad",
   "provincia": "Santiago de Chuco ",
   "distrito": "Quiruvilca"
  },
  {
   "ubigeo": 131007,
   "departamento": "La Libertad",
   "provincia": "Santiago de Chuco ",
   "distrito": "Santa Cruz de Chuca"
  },
  {
   "ubigeo": 131008,
   "departamento": "La Libertad",
   "provincia": "Santiago de Chuco ",
   "distrito": "Sitabamba"
  },
  {
   "ubigeo": 131101,
   "departamento": "La Libertad",
   "provincia": "Gran Chimú ",
   "distrito": "Cascas"
  },
  {
   "ubigeo": 131102,
   "departamento": "La Libertad",
   "provincia": "Gran Chimú ",
   "distrito": "Lucma"
  },
  {
   "ubigeo": 131103,
   "departamento": "La Libertad",
   "provincia": "Gran Chimú ",
   "distrito": "Marmot"
  },
  {
   "ubigeo": 131104,
   "departamento": "La Libertad",
   "provincia": "Gran Chimú ",
   "distrito": "Sayapullo"
  },
  {
   "ubigeo": 131201,
   "departamento": "La Libertad",
   "provincia": "Virú ",
   "distrito": "Viru"
  },
  {
   "ubigeo": 131202,
   "departamento": "La Libertad",
   "provincia": "Virú ",
   "distrito": "Chao"
  },
  {
   "ubigeo": 131203,
   "departamento": "La Libertad",
   "provincia": "Virú ",
   "distrito": "Guadalupito"
  },
  {
   "ubigeo": 140101,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Chiclayo"
  },
  {
   "ubigeo": 140102,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Chongoyape"
  },
  {
   "ubigeo": 140103,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Eten"
  },
  {
   "ubigeo": 140104,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Eten Puerto"
  },
  {
   "ubigeo": 140105,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "José Leonardo Ortiz"
  },
  {
   "ubigeo": 140106,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "La Victoria"
  },
  {
   "ubigeo": 140107,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Lagunas"
  },
  {
   "ubigeo": 140108,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Monsefu"
  },
  {
   "ubigeo": 140109,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Nueva Arica"
  },
  {
   "ubigeo": 140110,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Oyotun"
  },
  {
   "ubigeo": 140111,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Picsi"
  },
  {
   "ubigeo": 140112,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Pimentel"
  },
  {
   "ubigeo": 140113,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Reque"
  },
  {
   "ubigeo": 140114,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Santa Rosa"
  },
  {
   "ubigeo": 140115,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Saña"
  },
  {
   "ubigeo": 140116,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Cayalti"
  },
  {
   "ubigeo": 140117,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Patapo"
  },
  {
   "ubigeo": 140118,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Pomalca"
  },
  {
   "ubigeo": 140119,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Pucala"
  },
  {
   "ubigeo": 140120,
   "departamento": "Lambayeque",
   "provincia": "Chiclayo ",
   "distrito": "Tuman"
  },
  {
   "ubigeo": 140201,
   "departamento": "Lambayeque",
   "provincia": "Ferreñafe ",
   "distrito": "Ferreñafe"
  },
  {
   "ubigeo": 140202,
   "departamento": "Lambayeque",
   "provincia": "Ferreñafe ",
   "distrito": "Cañaris"
  },
  {
   "ubigeo": 140203,
   "departamento": "Lambayeque",
   "provincia": "Ferreñafe ",
   "distrito": "Incahuasi"
  },
  {
   "ubigeo": 140204,
   "departamento": "Lambayeque",
   "provincia": "Ferreñafe ",
   "distrito": "Manuel Antonio Mesones Muro"
  },
  {
   "ubigeo": 140205,
   "departamento": "Lambayeque",
   "provincia": "Ferreñafe ",
   "distrito": "Pitipo"
  },
  {
   "ubigeo": 140206,
   "departamento": "Lambayeque",
   "provincia": "Ferreñafe ",
   "distrito": "Pueblo Nuevo"
  },
  {
   "ubigeo": 140301,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "Lambayeque"
  },
  {
   "ubigeo": 140302,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "Chochope"
  },
  {
   "ubigeo": 140303,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "Illimo"
  },
  {
   "ubigeo": 140304,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "Jayanca"
  },
  {
   "ubigeo": 140305,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "Mochumi"
  },
  {
   "ubigeo": 140306,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "Morrope"
  },
  {
   "ubigeo": 140307,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "Motupe"
  },
  {
   "ubigeo": 140308,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "Olmos"
  },
  {
   "ubigeo": 140309,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "Pacora"
  },
  {
   "ubigeo": 140310,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "Salas"
  },
  {
   "ubigeo": 140311,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "San José"
  },
  {
   "ubigeo": 140312,
   "departamento": "Lambayeque",
   "provincia": "Lambayeque ",
   "distrito": "Tucume"
  },
  {
   "ubigeo": 150101,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Lima"
  },
  {
   "ubigeo": 150102,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Ancón"
  },
  {
   "ubigeo": 150103,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Ate"
  },
  {
   "ubigeo": 150104,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Barranco"
  },
  {
   "ubigeo": 150105,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Breña"
  },
  {
   "ubigeo": 150106,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Carabayllo"
  },
  {
   "ubigeo": 150107,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Chaclacayo"
  },
  {
   "ubigeo": 150108,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Chorrillos"
  },
  {
   "ubigeo": 150109,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Cieneguilla"
  },
  {
   "ubigeo": 150110,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Comas"
  },
  {
   "ubigeo": 150111,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "El Agustino"
  },
  {
   "ubigeo": 150112,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Independencia"
  },
  {
   "ubigeo": 150113,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Jesús María"
  },
  {
   "ubigeo": 150114,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "La Molina"
  },
  {
   "ubigeo": 150115,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "La Victoria"
  },
  {
   "ubigeo": 150116,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Lince"
  },
  {
   "ubigeo": 150117,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Los Olivos"
  },
  {
   "ubigeo": 150118,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Lurigancho"
  },
  {
   "ubigeo": 150119,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Lurin"
  },
  {
   "ubigeo": 150120,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Magdalena del Mar"
  },
  {
   "ubigeo": 150121,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Pueblo Libre"
  },
  {
   "ubigeo": 150122,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Miraflores"
  },
  {
   "ubigeo": 150123,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Pachacamac"
  },
  {
   "ubigeo": 150124,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Pucusana"
  },
  {
   "ubigeo": 150125,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Puente Piedra"
  },
  {
   "ubigeo": 150126,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Punta Hermosa"
  },
  {
   "ubigeo": 150127,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Punta Negra"
  },
  {
   "ubigeo": 150128,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Rímac"
  },
  {
   "ubigeo": 150129,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "San Bartolo"
  },
  {
   "ubigeo": 150130,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "San Borja"
  },
  {
   "ubigeo": 150131,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "San Isidro"
  },
  {
   "ubigeo": 150132,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "San Juan de Lurigancho"
  },
  {
   "ubigeo": 150133,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "San Juan de Miraflores"
  },
  {
   "ubigeo": 150134,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "San Luis"
  },
  {
   "ubigeo": 150135,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "San Martín de Porres"
  },
  {
   "ubigeo": 150136,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "San Miguel"
  },
  {
   "ubigeo": 150137,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Santa Anita"
  },
  {
   "ubigeo": 150138,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Santa María del Mar"
  },
  {
   "ubigeo": 150139,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Santa Rosa"
  },
  {
   "ubigeo": 150140,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Santiago de Surco"
  },
  {
   "ubigeo": 150141,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Surquillo"
  },
  {
   "ubigeo": 150142,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Villa El Salvador"
  },
  {
   "ubigeo": 150143,
   "departamento": "Lima",
   "provincia": "Lima",
   "distrito": "Villa María del Triunfo"
  },
  {
   "ubigeo": 150201,
   "departamento": "Lima",
   "provincia": "Barranca ",
   "distrito": "Barranca"
  },
  {
   "ubigeo": 150202,
   "departamento": "Lima",
   "provincia": "Barranca ",
   "distrito": "Paramonga"
  },
  {
   "ubigeo": 150203,
   "departamento": "Lima",
   "provincia": "Barranca ",
   "distrito": "Pativilca"
  },
  {
   "ubigeo": 150204,
   "departamento": "Lima",
   "provincia": "Barranca ",
   "distrito": "Supe"
  },
  {
   "ubigeo": 150205,
   "departamento": "Lima",
   "provincia": "Barranca ",
   "distrito": "Supe Puerto"
  },
  {
   "ubigeo": 150301,
   "departamento": "Lima",
   "provincia": "Cajatambo ",
   "distrito": "Cajatambo"
  },
  {
   "ubigeo": 150302,
   "departamento": "Lima",
   "provincia": "Cajatambo ",
   "distrito": "Copa"
  },
  {
   "ubigeo": 150303,
   "departamento": "Lima",
   "provincia": "Cajatambo ",
   "distrito": "Gorgor"
  },
  {
   "ubigeo": 150304,
   "departamento": "Lima",
   "provincia": "Cajatambo ",
   "distrito": "Huancapon"
  },
  {
   "ubigeo": 150305,
   "departamento": "Lima",
   "provincia": "Cajatambo ",
   "distrito": "Manas"
  },
  {
   "ubigeo": 150401,
   "departamento": "Lima",
   "provincia": "Canta ",
   "distrito": "Canta"
  },
  {
   "ubigeo": 150402,
   "departamento": "Lima",
   "provincia": "Canta ",
   "distrito": "Arahuay"
  },
  {
   "ubigeo": 150403,
   "departamento": "Lima",
   "provincia": "Canta ",
   "distrito": "Huamantanga"
  },
  {
   "ubigeo": 150404,
   "departamento": "Lima",
   "provincia": "Canta ",
   "distrito": "Huaros"
  },
  {
   "ubigeo": 150405,
   "departamento": "Lima",
   "provincia": "Canta ",
   "distrito": "Lachaqui"
  },
  {
   "ubigeo": 150406,
   "departamento": "Lima",
   "provincia": "Canta ",
   "distrito": "San Buenaventura"
  },
  {
   "ubigeo": 150407,
   "departamento": "Lima",
   "provincia": "Canta ",
   "distrito": "Santa Rosa de Quives"
  },
  {
   "ubigeo": 150501,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "San Vicente de Cañete"
  },
  {
   "ubigeo": 150502,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Asia"
  },
  {
   "ubigeo": 150503,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Calango"
  },
  {
   "ubigeo": 150504,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Cerro Azul"
  },
  {
   "ubigeo": 150505,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Chilca"
  },
  {
   "ubigeo": 150506,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Coayllo"
  },
  {
   "ubigeo": 150507,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Imperial"
  },
  {
   "ubigeo": 150508,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Lunahuana"
  },
  {
   "ubigeo": 150509,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Mala"
  },
  {
   "ubigeo": 150510,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Nuevo Imperial"
  },
  {
   "ubigeo": 150511,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Pacaran"
  },
  {
   "ubigeo": 150512,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Quilmana"
  },
  {
   "ubigeo": 150513,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "San Antonio"
  },
  {
   "ubigeo": 150514,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "San Luis"
  },
  {
   "ubigeo": 150515,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Santa Cruz de Flores"
  },
  {
   "ubigeo": 150516,
   "departamento": "Lima",
   "provincia": "Cañete ",
   "distrito": "Zúñiga"
  },
  {
   "ubigeo": 150601,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "Huaral"
  },
  {
   "ubigeo": 150602,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "Atavillos Alto"
  },
  {
   "ubigeo": 150603,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "Atavillos Bajo"
  },
  {
   "ubigeo": 150604,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "Aucallama"
  },
  {
   "ubigeo": 150605,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "Chancay"
  },
  {
   "ubigeo": 150606,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "Ihuari"
  },
  {
   "ubigeo": 150607,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "Lampian"
  },
  {
   "ubigeo": 150608,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "Pacaraos"
  },
  {
   "ubigeo": 150609,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "San Miguel de Acos"
  },
  {
   "ubigeo": 150610,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "Santa Cruz de Andamarca"
  },
  {
   "ubigeo": 150611,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "Sumbilca"
  },
  {
   "ubigeo": 150612,
   "departamento": "Lima",
   "provincia": "Huaral ",
   "distrito": "Veintisiete de Noviembre"
  },
  {
   "ubigeo": 150701,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Matucana"
  },
  {
   "ubigeo": 150702,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Antioquia"
  },
  {
   "ubigeo": 150703,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Callahuanca"
  },
  {
   "ubigeo": 150704,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Carampoma"
  },
  {
   "ubigeo": 150705,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Chicla"
  },
  {
   "ubigeo": 150706,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Cuenca"
  },
  {
   "ubigeo": 150707,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Huachupampa"
  },
  {
   "ubigeo": 150708,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Huanza"
  },
  {
   "ubigeo": 150709,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Huarochiri"
  },
  {
   "ubigeo": 150710,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Lahuaytambo"
  },
  {
   "ubigeo": 150711,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Langa"
  },
  {
   "ubigeo": 150712,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Laraos"
  },
  {
   "ubigeo": 150713,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Mariatana"
  },
  {
   "ubigeo": 150714,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Ricardo Palma"
  },
  {
   "ubigeo": 150715,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "San Andrés de Tupicocha"
  },
  {
   "ubigeo": 150716,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "San Antonio"
  },
  {
   "ubigeo": 150717,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "San Bartolomé"
  },
  {
   "ubigeo": 150718,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "San Damian"
  },
  {
   "ubigeo": 150719,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "San Juan de Iris"
  },
  {
   "ubigeo": 150720,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "San Juan de Tantaranche"
  },
  {
   "ubigeo": 150721,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "San Lorenzo de Quinti"
  },
  {
   "ubigeo": 150722,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "San Mateo"
  },
  {
   "ubigeo": 150723,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "San Mateo de Otao"
  },
  {
   "ubigeo": 150724,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "San Pedro de Casta"
  },
  {
   "ubigeo": 150725,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "San Pedro de Huancayre"
  },
  {
   "ubigeo": 150726,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Sangallaya"
  },
  {
   "ubigeo": 150727,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Santa Cruz de Cocachacra"
  },
  {
   "ubigeo": 150728,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Santa Eulalia"
  },
  {
   "ubigeo": 150729,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Santiago de Anchucaya"
  },
  {
   "ubigeo": 150730,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Santiago de Tuna"
  },
  {
   "ubigeo": 150731,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Santo Domingo de Los Olleros"
  },
  {
   "ubigeo": 150732,
   "departamento": "Lima",
   "provincia": "Huarochirí ",
   "distrito": "Surco"
  },
  {
   "ubigeo": 150801,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Huacho"
  },
  {
   "ubigeo": 150802,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Ambar"
  },
  {
   "ubigeo": 150803,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Caleta de Carquin"
  },
  {
   "ubigeo": 150804,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Checras"
  },
  {
   "ubigeo": 150805,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Hualmay"
  },
  {
   "ubigeo": 150806,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Huaura"
  },
  {
   "ubigeo": 150807,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Leoncio Prado"
  },
  {
   "ubigeo": 150808,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Paccho"
  },
  {
   "ubigeo": 150809,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Santa Leonor"
  },
  {
   "ubigeo": 150810,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Santa María"
  },
  {
   "ubigeo": 150811,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Sayan"
  },
  {
   "ubigeo": 150812,
   "departamento": "Lima",
   "provincia": "Huaura ",
   "distrito": "Vegueta"
  },
  {
   "ubigeo": 150901,
   "departamento": "Lima",
   "provincia": "Oyón ",
   "distrito": "Oyon"
  },
  {
   "ubigeo": 150902,
   "departamento": "Lima",
   "provincia": "Oyón ",
   "distrito": "Andajes"
  },
  {
   "ubigeo": 150903,
   "departamento": "Lima",
   "provincia": "Oyón ",
   "distrito": "Caujul"
  },
  {
   "ubigeo": 150904,
   "departamento": "Lima",
   "provincia": "Oyón ",
   "distrito": "Cochamarca"
  },
  {
   "ubigeo": 150905,
   "departamento": "Lima",
   "provincia": "Oyón ",
   "distrito": "Navan"
  },
  {
   "ubigeo": 150906,
   "departamento": "Lima",
   "provincia": "Oyón ",
   "distrito": "Pachangara"
  },
  {
   "ubigeo": 151001,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Yauyos"
  },
  {
   "ubigeo": 151002,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Alis"
  },
  {
   "ubigeo": 151003,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Allauca"
  },
  {
   "ubigeo": 151004,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Ayaviri"
  },
  {
   "ubigeo": 151005,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Azángaro"
  },
  {
   "ubigeo": 151006,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Cacra"
  },
  {
   "ubigeo": 151007,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Carania"
  },
  {
   "ubigeo": 151008,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Catahuasi"
  },
  {
   "ubigeo": 151009,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Chocos"
  },
  {
   "ubigeo": 151010,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Cochas"
  },
  {
   "ubigeo": 151011,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Colonia"
  },
  {
   "ubigeo": 151012,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Hongos"
  },
  {
   "ubigeo": 151013,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Huampara"
  },
  {
   "ubigeo": 151014,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Huancaya"
  },
  {
   "ubigeo": 151015,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Huangascar"
  },
  {
   "ubigeo": 151016,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Huantan"
  },
  {
   "ubigeo": 151017,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Huañec"
  },
  {
   "ubigeo": 151018,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Laraos"
  },
  {
   "ubigeo": 151019,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Lincha"
  },
  {
   "ubigeo": 151020,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Madean"
  },
  {
   "ubigeo": 151021,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Miraflores"
  },
  {
   "ubigeo": 151022,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Omas"
  },
  {
   "ubigeo": 151023,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Putinza"
  },
  {
   "ubigeo": 151024,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Quinches"
  },
  {
   "ubigeo": 151025,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Quinocay"
  },
  {
   "ubigeo": 151026,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "San Joaquín"
  },
  {
   "ubigeo": 151027,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "San Pedro de Pilas"
  },
  {
   "ubigeo": 151028,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Tanta"
  },
  {
   "ubigeo": 151029,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Tauripampa"
  },
  {
   "ubigeo": 151030,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Tomas"
  },
  {
   "ubigeo": 151031,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Tupe"
  },
  {
   "ubigeo": 151032,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Viñac"
  },
  {
   "ubigeo": 151033,
   "departamento": "Lima",
   "provincia": "Yauyos ",
   "distrito": "Vitis"
  },
  {
   "ubigeo": 160101,
   "departamento": "Loreto",
   "provincia": "Maynas ",
   "distrito": "Iquitos"
  },
  {
   "ubigeo": 160102,
   "departamento": "Loreto",
   "provincia": "Maynas ",
   "distrito": "Alto Nanay"
  },
  {
   "ubigeo": 160103,
   "departamento": "Loreto",
   "provincia": "Maynas ",
   "distrito": "Fernando Lores"
  },
  {
   "ubigeo": 160104,
   "departamento": "Loreto",
   "provincia": "Maynas ",
   "distrito": "Indiana"
  },
  {
   "ubigeo": 160105,
   "departamento": "Loreto",
   "provincia": "Maynas ",
   "distrito": "Las Amazonas"
  },
  {
   "ubigeo": 160106,
   "departamento": "Loreto",
   "provincia": "Maynas ",
   "distrito": "Mazan"
  },
  {
   "ubigeo": 160107,
   "departamento": "Loreto",
   "provincia": "Maynas ",
   "distrito": "Napo"
  },
  {
   "ubigeo": 160108,
   "departamento": "Loreto",
   "provincia": "Maynas ",
   "distrito": "Punchana"
  },
  {
   "ubigeo": 160110,
   "departamento": "Loreto",
   "provincia": "Maynas ",
   "distrito": "Torres Causana"
  },
  {
   "ubigeo": 160112,
   "departamento": "Loreto",
   "provincia": "Maynas ",
   "distrito": "Belén"
  },
  {
   "ubigeo": 160113,
   "departamento": "Loreto",
   "provincia": "Maynas ",
   "distrito": "San Juan Bautista"
  },
  {
   "ubigeo": 160201,
   "departamento": "Loreto",
   "provincia": "Alto Amazonas ",
   "distrito": "Yurimaguas"
  },
  {
   "ubigeo": 160202,
   "departamento": "Loreto",
   "provincia": "Alto Amazonas ",
   "distrito": "Balsapuerto"
  },
  {
   "ubigeo": 160205,
   "departamento": "Loreto",
   "provincia": "Alto Amazonas ",
   "distrito": "Jeberos"
  },
  {
   "ubigeo": 160206,
   "departamento": "Loreto",
   "provincia": "Alto Amazonas ",
   "distrito": "Lagunas"
  },
  {
   "ubigeo": 160210,
   "departamento": "Loreto",
   "provincia": "Alto Amazonas ",
   "distrito": "Santa Cruz"
  },
  {
   "ubigeo": 160211,
   "departamento": "Loreto",
   "provincia": "Alto Amazonas ",
   "distrito": "Teniente Cesar López Rojas"
  },
  {
   "ubigeo": 160301,
   "departamento": "Loreto",
   "provincia": "Loreto ",
   "distrito": "Nauta"
  },
  {
   "ubigeo": 160302,
   "departamento": "Loreto",
   "provincia": "Loreto ",
   "distrito": "Parinari"
  },
  {
   "ubigeo": 160303,
   "departamento": "Loreto",
   "provincia": "Loreto ",
   "distrito": "Tigre"
  },
  {
   "ubigeo": 160304,
   "departamento": "Loreto",
   "provincia": "Loreto ",
   "distrito": "Trompeteros"
  },
  {
   "ubigeo": 160305,
   "departamento": "Loreto",
   "provincia": "Loreto ",
   "distrito": "Urarinas"
  },
  {
   "ubigeo": 160401,
   "departamento": "Loreto",
   "provincia": "Mariscal Ramón Castilla ",
   "distrito": "Ramón Castilla"
  },
  {
   "ubigeo": 160402,
   "departamento": "Loreto",
   "provincia": "Mariscal Ramón Castilla ",
   "distrito": "Pebas"
  },
  {
   "ubigeo": 160403,
   "departamento": "Loreto",
   "provincia": "Mariscal Ramón Castilla ",
   "distrito": "Yavari"
  },
  {
   "ubigeo": 160404,
   "departamento": "Loreto",
   "provincia": "Mariscal Ramón Castilla ",
   "distrito": "San Pablo"
  },
  {
   "ubigeo": 160501,
   "departamento": "Loreto",
   "provincia": "Requena ",
   "distrito": "Requena"
  },
  {
   "ubigeo": 160502,
   "departamento": "Loreto",
   "provincia": "Requena ",
   "distrito": "Alto Tapiche"
  },
  {
   "ubigeo": 160503,
   "departamento": "Loreto",
   "provincia": "Requena ",
   "distrito": "Capelo"
  },
  {
   "ubigeo": 160504,
   "departamento": "Loreto",
   "provincia": "Requena ",
   "distrito": "Emilio San Martín"
  },
  {
   "ubigeo": 160505,
   "departamento": "Loreto",
   "provincia": "Requena ",
   "distrito": "Maquia"
  },
  {
   "ubigeo": 160506,
   "departamento": "Loreto",
   "provincia": "Requena ",
   "distrito": "Puinahua"
  },
  {
   "ubigeo": 160507,
   "departamento": "Loreto",
   "provincia": "Requena ",
   "distrito": "Saquena"
  },
  {
   "ubigeo": 160508,
   "departamento": "Loreto",
   "provincia": "Requena ",
   "distrito": "Soplin"
  },
  {
   "ubigeo": 160509,
   "departamento": "Loreto",
   "provincia": "Requena ",
   "distrito": "Tapiche"
  },
  {
   "ubigeo": 160510,
   "departamento": "Loreto",
   "provincia": "Requena ",
   "distrito": "Jenaro Herrera"
  },
  {
   "ubigeo": 160511,
   "departamento": "Loreto",
   "provincia": "Requena ",
   "distrito": "Yaquerana"
  },
  {
   "ubigeo": 160601,
   "departamento": "Loreto",
   "provincia": "Ucayali ",
   "distrito": "Contamana"
  },
  {
   "ubigeo": 160602,
   "departamento": "Loreto",
   "provincia": "Ucayali ",
   "distrito": "Inahuaya"
  },
  {
   "ubigeo": 160603,
   "departamento": "Loreto",
   "provincia": "Ucayali ",
   "distrito": "Padre Márquez"
  },
  {
   "ubigeo": 160604,
   "departamento": "Loreto",
   "provincia": "Ucayali ",
   "distrito": "Pampa Hermosa"
  },
  {
   "ubigeo": 160605,
   "departamento": "Loreto",
   "provincia": "Ucayali ",
   "distrito": "Sarayacu"
  },
  {
   "ubigeo": 160606,
   "departamento": "Loreto",
   "provincia": "Ucayali ",
   "distrito": "Vargas Guerra"
  },
  {
   "ubigeo": 160701,
   "departamento": "Loreto",
   "provincia": "Datem del Marañón ",
   "distrito": "Barranca"
  },
  {
   "ubigeo": 160702,
   "departamento": "Loreto",
   "provincia": "Datem del Marañón ",
   "distrito": "Cahuapanas"
  },
  {
   "ubigeo": 160703,
   "departamento": "Loreto",
   "provincia": "Datem del Marañón ",
   "distrito": "Manseriche"
  },
  {
   "ubigeo": 160704,
   "departamento": "Loreto",
   "provincia": "Datem del Marañón ",
   "distrito": "Morona"
  },
  {
   "ubigeo": 160705,
   "departamento": "Loreto",
   "provincia": "Datem del Marañón ",
   "distrito": "Pastaza"
  },
  {
   "ubigeo": 160706,
   "departamento": "Loreto",
   "provincia": "Datem del Marañón ",
   "distrito": "Andoas"
  },
  {
   "ubigeo": 160801,
   "departamento": "Loreto",
   "provincia": "Putumayo",
   "distrito": "Putumayo"
  },
  {
   "ubigeo": 160802,
   "departamento": "Loreto",
   "provincia": "Putumayo",
   "distrito": "Rosa Panduro"
  },
  {
   "ubigeo": 160803,
   "departamento": "Loreto",
   "provincia": "Putumayo",
   "distrito": "Teniente Manuel Clavero"
  },
  {
   "ubigeo": 160804,
   "departamento": "Loreto",
   "provincia": "Putumayo",
   "distrito": "Yaguas"
  },
  {
   "ubigeo": 170101,
   "departamento": "Madre de Dios",
   "provincia": "Tambopata ",
   "distrito": "Tambopata"
  },
  {
   "ubigeo": 170102,
   "departamento": "Madre de Dios",
   "provincia": "Tambopata ",
   "distrito": "Inambari"
  },
  {
   "ubigeo": 170103,
   "departamento": "Madre de Dios",
   "provincia": "Tambopata ",
   "distrito": "Las Piedras"
  },
  {
   "ubigeo": 170104,
   "departamento": "Madre de Dios",
   "provincia": "Tambopata ",
   "distrito": "Laberinto"
  },
  {
   "ubigeo": 170201,
   "departamento": "Madre de Dios",
   "provincia": "Manu ",
   "distrito": "Manu"
  },
  {
   "ubigeo": 170202,
   "departamento": "Madre de Dios",
   "provincia": "Manu ",
   "distrito": "Fitzcarrald"
  },
  {
   "ubigeo": 170203,
   "departamento": "Madre de Dios",
   "provincia": "Manu ",
   "distrito": "Madre de Dios"
  },
  {
   "ubigeo": 170204,
   "departamento": "Madre de Dios",
   "provincia": "Manu ",
   "distrito": "Huepetuhe"
  },
  {
   "ubigeo": 170301,
   "departamento": "Madre de Dios",
   "provincia": "Tahuamanu ",
   "distrito": "Iñapari"
  },
  {
   "ubigeo": 170302,
   "departamento": "Madre de Dios",
   "provincia": "Tahuamanu ",
   "distrito": "Iberia"
  },
  {
   "ubigeo": 170303,
   "departamento": "Madre de Dios",
   "provincia": "Tahuamanu ",
   "distrito": "Tahuamanu"
  },
  {
   "ubigeo": 180101,
   "departamento": "Moquegua",
   "provincia": "Mariscal Nieto ",
   "distrito": "Moquegua"
  },
  {
   "ubigeo": 180102,
   "departamento": "Moquegua",
   "provincia": "Mariscal Nieto ",
   "distrito": "Carumas"
  },
  {
   "ubigeo": 180103,
   "departamento": "Moquegua",
   "provincia": "Mariscal Nieto ",
   "distrito": "Cuchumbaya"
  },
  {
   "ubigeo": 180104,
   "departamento": "Moquegua",
   "provincia": "Mariscal Nieto ",
   "distrito": "Samegua"
  },
  {
   "ubigeo": 180105,
   "departamento": "Moquegua",
   "provincia": "Mariscal Nieto ",
   "distrito": "San Cristóbal"
  },
  {
   "ubigeo": 180106,
   "departamento": "Moquegua",
   "provincia": "Mariscal Nieto ",
   "distrito": "Torata"
  },
  {
   "ubigeo": 180201,
   "departamento": "Moquegua",
   "provincia": "General Sánchez Cerro ",
   "distrito": "Omate"
  },
  {
   "ubigeo": 180202,
   "departamento": "Moquegua",
   "provincia": "General Sánchez Cerro ",
   "distrito": "Chojata"
  },
  {
   "ubigeo": 180203,
   "departamento": "Moquegua",
   "provincia": "General Sánchez Cerro ",
   "distrito": "Coalaque"
  },
  {
   "ubigeo": 180204,
   "departamento": "Moquegua",
   "provincia": "General Sánchez Cerro ",
   "distrito": "Ichuña"
  },
  {
   "ubigeo": 180205,
   "departamento": "Moquegua",
   "provincia": "General Sánchez Cerro ",
   "distrito": "La Capilla"
  },
  {
   "ubigeo": 180206,
   "departamento": "Moquegua",
   "provincia": "General Sánchez Cerro ",
   "distrito": "Lloque"
  },
  {
   "ubigeo": 180207,
   "departamento": "Moquegua",
   "provincia": "General Sánchez Cerro ",
   "distrito": "Matalaque"
  },
  {
   "ubigeo": 180208,
   "departamento": "Moquegua",
   "provincia": "General Sánchez Cerro ",
   "distrito": "Puquina"
  },
  {
   "ubigeo": 180209,
   "departamento": "Moquegua",
   "provincia": "General Sánchez Cerro ",
   "distrito": "Quinistaquillas"
  },
  {
   "ubigeo": 180210,
   "departamento": "Moquegua",
   "provincia": "General Sánchez Cerro ",
   "distrito": "Ubinas"
  },
  {
   "ubigeo": 180211,
   "departamento": "Moquegua",
   "provincia": "General Sánchez Cerro ",
   "distrito": "Yunga"
  },
  {
   "ubigeo": 180301,
   "departamento": "Moquegua",
   "provincia": "Ilo ",
   "distrito": "Ilo"
  },
  {
   "ubigeo": 180302,
   "departamento": "Moquegua",
   "provincia": "Ilo ",
   "distrito": "El Algarrobal"
  },
  {
   "ubigeo": 180303,
   "departamento": "Moquegua",
   "provincia": "Ilo ",
   "distrito": "Pacocha"
  },
  {
   "ubigeo": 190101,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Chaupimarca"
  },
  {
   "ubigeo": 190102,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Huachon"
  },
  {
   "ubigeo": 190103,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Huariaca"
  },
  {
   "ubigeo": 190104,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Huayllay"
  },
  {
   "ubigeo": 190105,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Ninacaca"
  },
  {
   "ubigeo": 190106,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Pallanchacra"
  },
  {
   "ubigeo": 190107,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Paucartambo"
  },
  {
   "ubigeo": 190108,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "San Francisco de Asís de Yarusyacan"
  },
  {
   "ubigeo": 190109,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Simon Bolívar"
  },
  {
   "ubigeo": 190110,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Ticlacayan"
  },
  {
   "ubigeo": 190111,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Tinyahuarco"
  },
  {
   "ubigeo": 190112,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Vicco"
  },
  {
   "ubigeo": 190113,
   "departamento": "Pasco",
   "provincia": "Pasco ",
   "distrito": "Yanacancha"
  },
  {
   "ubigeo": 190201,
   "departamento": "Pasco",
   "provincia": "Daniel Alcides Carrión ",
   "distrito": "Yanahuanca"
  },
  {
   "ubigeo": 190202,
   "departamento": "Pasco",
   "provincia": "Daniel Alcides Carrión ",
   "distrito": "Chacayan"
  },
  {
   "ubigeo": 190203,
   "departamento": "Pasco",
   "provincia": "Daniel Alcides Carrión ",
   "distrito": "Goyllarisquizga"
  },
  {
   "ubigeo": 190204,
   "departamento": "Pasco",
   "provincia": "Daniel Alcides Carrión ",
   "distrito": "Paucar"
  },
  {
   "ubigeo": 190205,
   "departamento": "Pasco",
   "provincia": "Daniel Alcides Carrión ",
   "distrito": "San Pedro de Pillao"
  },
  {
   "ubigeo": 190206,
   "departamento": "Pasco",
   "provincia": "Daniel Alcides Carrión ",
   "distrito": "Santa Ana de Tusi"
  },
  {
   "ubigeo": 190207,
   "departamento": "Pasco",
   "provincia": "Daniel Alcides Carrión ",
   "distrito": "Tapuc"
  },
  {
   "ubigeo": 190208,
   "departamento": "Pasco",
   "provincia": "Daniel Alcides Carrión ",
   "distrito": "Vilcabamba"
  },
  {
   "ubigeo": 190301,
   "departamento": "Pasco",
   "provincia": "Oxapampa ",
   "distrito": "Oxapampa"
  },
  {
   "ubigeo": 190302,
   "departamento": "Pasco",
   "provincia": "Oxapampa ",
   "distrito": "Chontabamba"
  },
  {
   "ubigeo": 190303,
   "departamento": "Pasco",
   "provincia": "Oxapampa ",
   "distrito": "Huancabamba"
  },
  {
   "ubigeo": 190304,
   "departamento": "Pasco",
   "provincia": "Oxapampa ",
   "distrito": "Palcazu"
  },
  {
   "ubigeo": 190305,
   "departamento": "Pasco",
   "provincia": "Oxapampa ",
   "distrito": "Pozuzo"
  },
  {
   "ubigeo": 190306,
   "departamento": "Pasco",
   "provincia": "Oxapampa ",
   "distrito": "Puerto Bermúdez"
  },
  {
   "ubigeo": 190307,
   "departamento": "Pasco",
   "provincia": "Oxapampa ",
   "distrito": "Villa Rica"
  },
  {
   "ubigeo": 190308,
   "departamento": "Pasco",
   "provincia": "Oxapampa ",
   "distrito": "Constitución"
  },
  {
   "ubigeo": 200101,
   "departamento": "Piura",
   "provincia": "Piura ",
   "distrito": "Piura"
  },
  {
   "ubigeo": 200104,
   "departamento": "Piura",
   "provincia": "Piura ",
   "distrito": "Castilla"
  },
  {
   "ubigeo": 200105,
   "departamento": "Piura",
   "provincia": "Piura ",
   "distrito": "Catacaos"
  },
  {
   "ubigeo": 200107,
   "departamento": "Piura",
   "provincia": "Piura ",
   "distrito": "Cura Mori"
  },
  {
   "ubigeo": 200108,
   "departamento": "Piura",
   "provincia": "Piura ",
   "distrito": "El Tallan"
  },
  {
   "ubigeo": 200109,
   "departamento": "Piura",
   "provincia": "Piura ",
   "distrito": "La Arena"
  },
  {
   "ubigeo": 200110,
   "departamento": "Piura",
   "provincia": "Piura ",
   "distrito": "La Unión"
  },
  {
   "ubigeo": 200111,
   "departamento": "Piura",
   "provincia": "Piura ",
   "distrito": "Las Lomas"
  },
  {
   "ubigeo": 200114,
   "departamento": "Piura",
   "provincia": "Piura ",
   "distrito": "Tambo Grande"
  },
  {
   "ubigeo": 200115,
   "departamento": "Piura",
   "provincia": "Piura ",
   "distrito": "Veintiseis de Octubre"
  },
  {
   "ubigeo": 200201,
   "departamento": "Piura",
   "provincia": "Ayabaca ",
   "distrito": "Ayabaca"
  },
  {
   "ubigeo": 200202,
   "departamento": "Piura",
   "provincia": "Ayabaca ",
   "distrito": "Frias"
  },
  {
   "ubigeo": 200203,
   "departamento": "Piura",
   "provincia": "Ayabaca ",
   "distrito": "Jilili"
  },
  {
   "ubigeo": 200204,
   "departamento": "Piura",
   "provincia": "Ayabaca ",
   "distrito": "Lagunas"
  },
  {
   "ubigeo": 200205,
   "departamento": "Piura",
   "provincia": "Ayabaca ",
   "distrito": "Montero"
  },
  {
   "ubigeo": 200206,
   "departamento": "Piura",
   "provincia": "Ayabaca ",
   "distrito": "Pacaipampa"
  },
  {
   "ubigeo": 200207,
   "departamento": "Piura",
   "provincia": "Ayabaca ",
   "distrito": "Paimas"
  },
  {
   "ubigeo": 200208,
   "departamento": "Piura",
   "provincia": "Ayabaca ",
   "distrito": "Sapillica"
  },
  {
   "ubigeo": 200209,
   "departamento": "Piura",
   "provincia": "Ayabaca ",
   "distrito": "Sicchez"
  },
  {
   "ubigeo": 200210,
   "departamento": "Piura",
   "provincia": "Ayabaca ",
   "distrito": "Suyo"
  },
  {
   "ubigeo": 200301,
   "departamento": "Piura",
   "provincia": "Huancabamba ",
   "distrito": "Huancabamba"
  },
  {
   "ubigeo": 200302,
   "departamento": "Piura",
   "provincia": "Huancabamba ",
   "distrito": "Canchaque"
  },
  {
   "ubigeo": 200303,
   "departamento": "Piura",
   "provincia": "Huancabamba ",
   "distrito": "El Carmen de la Frontera"
  },
  {
   "ubigeo": 200304,
   "departamento": "Piura",
   "provincia": "Huancabamba ",
   "distrito": "Huarmaca"
  },
  {
   "ubigeo": 200305,
   "departamento": "Piura",
   "provincia": "Huancabamba ",
   "distrito": "Lalaquiz"
  },
  {
   "ubigeo": 200306,
   "departamento": "Piura",
   "provincia": "Huancabamba ",
   "distrito": "San Miguel de El Faique"
  },
  {
   "ubigeo": 200307,
   "departamento": "Piura",
   "provincia": "Huancabamba ",
   "distrito": "Sondor"
  },
  {
   "ubigeo": 200308,
   "departamento": "Piura",
   "provincia": "Huancabamba ",
   "distrito": "Sondorillo"
  },
  {
   "ubigeo": 200401,
   "departamento": "Piura",
   "provincia": "Morropón ",
   "distrito": "Chulucanas"
  },
  {
   "ubigeo": 200402,
   "departamento": "Piura",
   "provincia": "Morropón ",
   "distrito": "Buenos Aires"
  },
  {
   "ubigeo": 200403,
   "departamento": "Piura",
   "provincia": "Morropón ",
   "distrito": "Chalaco"
  },
  {
   "ubigeo": 200404,
   "departamento": "Piura",
   "provincia": "Morropón ",
   "distrito": "La Matanza"
  },
  {
   "ubigeo": 200405,
   "departamento": "Piura",
   "provincia": "Morropón ",
   "distrito": "Morropon"
  },
  {
   "ubigeo": 200406,
   "departamento": "Piura",
   "provincia": "Morropón ",
   "distrito": "Salitral"
  },
  {
   "ubigeo": 200407,
   "departamento": "Piura",
   "provincia": "Morropón ",
   "distrito": "San Juan de Bigote"
  },
  {
   "ubigeo": 200408,
   "departamento": "Piura",
   "provincia": "Morropón ",
   "distrito": "Santa Catalina de Mossa"
  },
  {
   "ubigeo": 200409,
   "departamento": "Piura",
   "provincia": "Morropón ",
   "distrito": "Santo Domingo"
  },
  {
   "ubigeo": 200410,
   "departamento": "Piura",
   "provincia": "Morropón ",
   "distrito": "Yamango"
  },
  {
   "ubigeo": 200501,
   "departamento": "Piura",
   "provincia": "Paita ",
   "distrito": "Paita"
  },
  {
   "ubigeo": 200502,
   "departamento": "Piura",
   "provincia": "Paita ",
   "distrito": "Amotape"
  },
  {
   "ubigeo": 200503,
   "departamento": "Piura",
   "provincia": "Paita ",
   "distrito": "Arenal"
  },
  {
   "ubigeo": 200504,
   "departamento": "Piura",
   "provincia": "Paita ",
   "distrito": "Colan"
  },
  {
   "ubigeo": 200505,
   "departamento": "Piura",
   "provincia": "Paita ",
   "distrito": "La Huaca"
  },
  {
   "ubigeo": 200506,
   "departamento": "Piura",
   "provincia": "Paita ",
   "distrito": "Tamarindo"
  },
  {
   "ubigeo": 200507,
   "departamento": "Piura",
   "provincia": "Paita ",
   "distrito": "Vichayal"
  },
  {
   "ubigeo": 200601,
   "departamento": "Piura",
   "provincia": "Sullana ",
   "distrito": "Sullana"
  },
  {
   "ubigeo": 200602,
   "departamento": "Piura",
   "provincia": "Sullana ",
   "distrito": "Bellavista"
  },
  {
   "ubigeo": 200603,
   "departamento": "Piura",
   "provincia": "Sullana ",
   "distrito": "Ignacio Escudero"
  },
  {
   "ubigeo": 200604,
   "departamento": "Piura",
   "provincia": "Sullana ",
   "distrito": "Lancones"
  },
  {
   "ubigeo": 200605,
   "departamento": "Piura",
   "provincia": "Sullana ",
   "distrito": "Marcavelica"
  },
  {
   "ubigeo": 200606,
   "departamento": "Piura",
   "provincia": "Sullana ",
   "distrito": "Miguel Checa"
  },
  {
   "ubigeo": 200607,
   "departamento": "Piura",
   "provincia": "Sullana ",
   "distrito": "Querecotillo"
  },
  {
   "ubigeo": 200608,
   "departamento": "Piura",
   "provincia": "Sullana ",
   "distrito": "Salitral"
  },
  {
   "ubigeo": 200701,
   "departamento": "Piura",
   "provincia": "Talara ",
   "distrito": "Pariñas"
  },
  {
   "ubigeo": 200702,
   "departamento": "Piura",
   "provincia": "Talara ",
   "distrito": "El Alto"
  },
  {
   "ubigeo": 200703,
   "departamento": "Piura",
   "provincia": "Talara ",
   "distrito": "La Brea"
  },
  {
   "ubigeo": 200704,
   "departamento": "Piura",
   "provincia": "Talara ",
   "distrito": "Lobitos"
  },
  {
   "ubigeo": 200705,
   "departamento": "Piura",
   "provincia": "Talara ",
   "distrito": "Los Organos"
  },
  {
   "ubigeo": 200706,
   "departamento": "Piura",
   "provincia": "Talara ",
   "distrito": "Mancora"
  },
  {
   "ubigeo": 200801,
   "departamento": "Piura",
   "provincia": "Sechura ",
   "distrito": "Sechura"
  },
  {
   "ubigeo": 200802,
   "departamento": "Piura",
   "provincia": "Sechura ",
   "distrito": "Bellavista de la Unión"
  },
  {
   "ubigeo": 200803,
   "departamento": "Piura",
   "provincia": "Sechura ",
   "distrito": "Bernal"
  },
  {
   "ubigeo": 200804,
   "departamento": "Piura",
   "provincia": "Sechura ",
   "distrito": "Cristo Nos Valga"
  },
  {
   "ubigeo": 200805,
   "departamento": "Piura",
   "provincia": "Sechura ",
   "distrito": "Vice"
  },
  {
   "ubigeo": 200806,
   "departamento": "Piura",
   "provincia": "Sechura ",
   "distrito": "Rinconada Llicuar"
  },
  {
   "ubigeo": 210101,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Puno"
  },
  {
   "ubigeo": 210102,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Acora"
  },
  {
   "ubigeo": 210103,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Amantani"
  },
  {
   "ubigeo": 210104,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Atuncolla"
  },
  {
   "ubigeo": 210105,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Capachica"
  },
  {
   "ubigeo": 210106,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Chucuito"
  },
  {
   "ubigeo": 210107,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Coata"
  },
  {
   "ubigeo": 210108,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Huata"
  },
  {
   "ubigeo": 210109,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Mañazo"
  },
  {
   "ubigeo": 210110,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Paucarcolla"
  },
  {
   "ubigeo": 210111,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Pichacani"
  },
  {
   "ubigeo": 210112,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Plateria"
  },
  {
   "ubigeo": 210113,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "San Antonio"
  },
  {
   "ubigeo": 210114,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Tiquillaca"
  },
  {
   "ubigeo": 210115,
   "departamento": "Puno",
   "provincia": "Puno ",
   "distrito": "Vilque"
  },
  {
   "ubigeo": 210201,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "Azángaro"
  },
  {
   "ubigeo": 210202,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "Achaya"
  },
  {
   "ubigeo": 210203,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "Arapa"
  },
  {
   "ubigeo": 210204,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "Asillo"
  },
  {
   "ubigeo": 210205,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "Caminaca"
  },
  {
   "ubigeo": 210206,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "Chupa"
  },
  {
   "ubigeo": 210207,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "José Domingo Choquehuanca"
  },
  {
   "ubigeo": 210208,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "Muñani"
  },
  {
   "ubigeo": 210209,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "Potoni"
  },
  {
   "ubigeo": 210210,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "Saman"
  },
  {
   "ubigeo": 210211,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "San Anton"
  },
  {
   "ubigeo": 210212,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "San José"
  },
  {
   "ubigeo": 210213,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "San Juan de Salinas"
  },
  {
   "ubigeo": 210214,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "Santiago de Pupuja"
  },
  {
   "ubigeo": 210215,
   "departamento": "Puno",
   "provincia": "Azángaro ",
   "distrito": "Tirapata"
  },
  {
   "ubigeo": 210301,
   "departamento": "Puno",
   "provincia": "Carabaya ",
   "distrito": "Macusani"
  },
  {
   "ubigeo": 210302,
   "departamento": "Puno",
   "provincia": "Carabaya ",
   "distrito": "Ajoyani"
  },
  {
   "ubigeo": 210303,
   "departamento": "Puno",
   "provincia": "Carabaya ",
   "distrito": "Ayapata"
  },
  {
   "ubigeo": 210304,
   "departamento": "Puno",
   "provincia": "Carabaya ",
   "distrito": "Coasa"
  },
  {
   "ubigeo": 210305,
   "departamento": "Puno",
   "provincia": "Carabaya ",
   "distrito": "Corani"
  },
  {
   "ubigeo": 210306,
   "departamento": "Puno",
   "provincia": "Carabaya ",
   "distrito": "Crucero"
  },
  {
   "ubigeo": 210307,
   "departamento": "Puno",
   "provincia": "Carabaya ",
   "distrito": "Ituata"
  },
  {
   "ubigeo": 210308,
   "departamento": "Puno",
   "provincia": "Carabaya ",
   "distrito": "Ollachea"
  },
  {
   "ubigeo": 210309,
   "departamento": "Puno",
   "provincia": "Carabaya ",
   "distrito": "San Gaban"
  },
  {
   "ubigeo": 210310,
   "departamento": "Puno",
   "provincia": "Carabaya ",
   "distrito": "Usicayos"
  },
  {
   "ubigeo": 210401,
   "departamento": "Puno",
   "provincia": "Chucuito ",
   "distrito": "Juli"
  },
  {
   "ubigeo": 210402,
   "departamento": "Puno",
   "provincia": "Chucuito ",
   "distrito": "Desaguadero"
  },
  {
   "ubigeo": 210403,
   "departamento": "Puno",
   "provincia": "Chucuito ",
   "distrito": "Huacullani"
  },
  {
   "ubigeo": 210404,
   "departamento": "Puno",
   "provincia": "Chucuito ",
   "distrito": "Kelluyo"
  },
  {
   "ubigeo": 210405,
   "departamento": "Puno",
   "provincia": "Chucuito ",
   "distrito": "Pisacoma"
  },
  {
   "ubigeo": 210406,
   "departamento": "Puno",
   "provincia": "Chucuito ",
   "distrito": "Pomata"
  },
  {
   "ubigeo": 210407,
   "departamento": "Puno",
   "provincia": "Chucuito ",
   "distrito": "Zepita"
  },
  {
   "ubigeo": 210501,
   "departamento": "Puno",
   "provincia": "El Collao ",
   "distrito": "Ilave"
  },
  {
   "ubigeo": 210502,
   "departamento": "Puno",
   "provincia": "El Collao ",
   "distrito": "Capazo"
  },
  {
   "ubigeo": 210503,
   "departamento": "Puno",
   "provincia": "El Collao ",
   "distrito": "Pilcuyo"
  },
  {
   "ubigeo": 210504,
   "departamento": "Puno",
   "provincia": "El Collao ",
   "distrito": "Santa Rosa"
  },
  {
   "ubigeo": 210505,
   "departamento": "Puno",
   "provincia": "El Collao ",
   "distrito": "Conduriri"
  },
  {
   "ubigeo": 210601,
   "departamento": "Puno",
   "provincia": "Huancané ",
   "distrito": "Huancane"
  },
  {
   "ubigeo": 210602,
   "departamento": "Puno",
   "provincia": "Huancané ",
   "distrito": "Cojata"
  },
  {
   "ubigeo": 210603,
   "departamento": "Puno",
   "provincia": "Huancané ",
   "distrito": "Huatasani"
  },
  {
   "ubigeo": 210604,
   "departamento": "Puno",
   "provincia": "Huancané ",
   "distrito": "Inchupalla"
  },
  {
   "ubigeo": 210605,
   "departamento": "Puno",
   "provincia": "Huancané ",
   "distrito": "Pusi"
  },
  {
   "ubigeo": 210606,
   "departamento": "Puno",
   "provincia": "Huancané ",
   "distrito": "Rosaspata"
  },
  {
   "ubigeo": 210607,
   "departamento": "Puno",
   "provincia": "Huancané ",
   "distrito": "Taraco"
  },
  {
   "ubigeo": 210608,
   "departamento": "Puno",
   "provincia": "Huancané ",
   "distrito": "Vilque Chico"
  },
  {
   "ubigeo": 210701,
   "departamento": "Puno",
   "provincia": "Lampa ",
   "distrito": "Lampa"
  },
  {
   "ubigeo": 210702,
   "departamento": "Puno",
   "provincia": "Lampa ",
   "distrito": "Cabanilla"
  },
  {
   "ubigeo": 210703,
   "departamento": "Puno",
   "provincia": "Lampa ",
   "distrito": "Calapuja"
  },
  {
   "ubigeo": 210704,
   "departamento": "Puno",
   "provincia": "Lampa ",
   "distrito": "Nicasio"
  },
  {
   "ubigeo": 210705,
   "departamento": "Puno",
   "provincia": "Lampa ",
   "distrito": "Ocuviri"
  },
  {
   "ubigeo": 210706,
   "departamento": "Puno",
   "provincia": "Lampa ",
   "distrito": "Palca"
  },
  {
   "ubigeo": 210707,
   "departamento": "Puno",
   "provincia": "Lampa ",
   "distrito": "Paratia"
  },
  {
   "ubigeo": 210708,
   "departamento": "Puno",
   "provincia": "Lampa ",
   "distrito": "Pucara"
  },
  {
   "ubigeo": 210709,
   "departamento": "Puno",
   "provincia": "Lampa ",
   "distrito": "Santa Lucia"
  },
  {
   "ubigeo": 210710,
   "departamento": "Puno",
   "provincia": "Lampa ",
   "distrito": "Vilavila"
  },
  {
   "ubigeo": 210801,
   "departamento": "Puno",
   "provincia": "Melgar ",
   "distrito": "Ayaviri"
  },
  {
   "ubigeo": 210802,
   "departamento": "Puno",
   "provincia": "Melgar ",
   "distrito": "Antauta"
  },
  {
   "ubigeo": 210803,
   "departamento": "Puno",
   "provincia": "Melgar ",
   "distrito": "Cupi"
  },
  {
   "ubigeo": 210804,
   "departamento": "Puno",
   "provincia": "Melgar ",
   "distrito": "Llalli"
  },
  {
   "ubigeo": 210805,
   "departamento": "Puno",
   "provincia": "Melgar ",
   "distrito": "Macari"
  },
  {
   "ubigeo": 210806,
   "departamento": "Puno",
   "provincia": "Melgar ",
   "distrito": "Nuñoa"
  },
  {
   "ubigeo": 210807,
   "departamento": "Puno",
   "provincia": "Melgar ",
   "distrito": "Orurillo"
  },
  {
   "ubigeo": 210808,
   "departamento": "Puno",
   "provincia": "Melgar ",
   "distrito": "Santa Rosa"
  },
  {
   "ubigeo": 210809,
   "departamento": "Puno",
   "provincia": "Melgar ",
   "distrito": "Umachiri"
  },
  {
   "ubigeo": 210901,
   "departamento": "Puno",
   "provincia": "Moho ",
   "distrito": "Moho"
  },
  {
   "ubigeo": 210902,
   "departamento": "Puno",
   "provincia": "Moho ",
   "distrito": "Conima"
  },
  {
   "ubigeo": 210903,
   "departamento": "Puno",
   "provincia": "Moho ",
   "distrito": "Huayrapata"
  },
  {
   "ubigeo": 210904,
   "departamento": "Puno",
   "provincia": "Moho ",
   "distrito": "Tilali"
  },
  {
   "ubigeo": 211001,
   "departamento": "Puno",
   "provincia": "San Antonio de Putina ",
   "distrito": "Putina"
  },
  {
   "ubigeo": 211002,
   "departamento": "Puno",
   "provincia": "San Antonio de Putina ",
   "distrito": "Ananea"
  },
  {
   "ubigeo": 211003,
   "departamento": "Puno",
   "provincia": "San Antonio de Putina ",
   "distrito": "Pedro Vilca Apaza"
  },
  {
   "ubigeo": 211004,
   "departamento": "Puno",
   "provincia": "San Antonio de Putina ",
   "distrito": "Quilcapuncu"
  },
  {
   "ubigeo": 211005,
   "departamento": "Puno",
   "provincia": "San Antonio de Putina ",
   "distrito": "Sina"
  },
  {
   "ubigeo": 211101,
   "departamento": "Puno",
   "provincia": "San Román ",
   "distrito": "Juliaca"
  },
  {
   "ubigeo": 211102,
   "departamento": "Puno",
   "provincia": "San Román ",
   "distrito": "Cabana"
  },
  {
   "ubigeo": 211103,
   "departamento": "Puno",
   "provincia": "San Román ",
   "distrito": "Cabanillas"
  },
  {
   "ubigeo": 211104,
   "departamento": "Puno",
   "provincia": "San Román ",
   "distrito": "Caracoto"
  },
  {
   "ubigeo": 211201,
   "departamento": "Puno",
   "provincia": "Sandia ",
   "distrito": "Sandia"
  },
  {
   "ubigeo": 211202,
   "departamento": "Puno",
   "provincia": "Sandia ",
   "distrito": "Cuyocuyo"
  },
  {
   "ubigeo": 211203,
   "departamento": "Puno",
   "provincia": "Sandia ",
   "distrito": "Limbani"
  },
  {
   "ubigeo": 211204,
   "departamento": "Puno",
   "provincia": "Sandia ",
   "distrito": "Patambuco"
  },
  {
   "ubigeo": 211205,
   "departamento": "Puno",
   "provincia": "Sandia ",
   "distrito": "Phara"
  },
  {
   "ubigeo": 211206,
   "departamento": "Puno",
   "provincia": "Sandia ",
   "distrito": "Quiaca"
  },
  {
   "ubigeo": 211207,
   "departamento": "Puno",
   "provincia": "Sandia ",
   "distrito": "San Juan del Oro"
  },
  {
   "ubigeo": 211208,
   "departamento": "Puno",
   "provincia": "Sandia ",
   "distrito": "Yanahuaya"
  },
  {
   "ubigeo": 211209,
   "departamento": "Puno",
   "provincia": "Sandia ",
   "distrito": "Alto Inambari"
  },
  {
   "ubigeo": 211210,
   "departamento": "Puno",
   "provincia": "Sandia ",
   "distrito": "San Pedro de Putina Punco"
  },
  {
   "ubigeo": 211301,
   "departamento": "Puno",
   "provincia": "Yunguyo ",
   "distrito": "Yunguyo"
  },
  {
   "ubigeo": 211302,
   "departamento": "Puno",
   "provincia": "Yunguyo ",
   "distrito": "Anapia"
  },
  {
   "ubigeo": 211303,
   "departamento": "Puno",
   "provincia": "Yunguyo ",
   "distrito": "Copani"
  },
  {
   "ubigeo": 211304,
   "departamento": "Puno",
   "provincia": "Yunguyo ",
   "distrito": "Cuturapi"
  },
  {
   "ubigeo": 211305,
   "departamento": "Puno",
   "provincia": "Yunguyo ",
   "distrito": "Ollaraya"
  },
  {
   "ubigeo": 211306,
   "departamento": "Puno",
   "provincia": "Yunguyo ",
   "distrito": "Tinicachi"
  },
  {
   "ubigeo": 211307,
   "departamento": "Puno",
   "provincia": "Yunguyo ",
   "distrito": "Unicachi"
  },
  {
   "ubigeo": 220101,
   "departamento": "San Martín",
   "provincia": "Moyobamba ",
   "distrito": "Moyobamba"
  },
  {
   "ubigeo": 220102,
   "departamento": "San Martín",
   "provincia": "Moyobamba ",
   "distrito": "Calzada"
  },
  {
   "ubigeo": 220103,
   "departamento": "San Martín",
   "provincia": "Moyobamba ",
   "distrito": "Habana"
  },
  {
   "ubigeo": 220104,
   "departamento": "San Martín",
   "provincia": "Moyobamba ",
   "distrito": "Jepelacio"
  },
  {
   "ubigeo": 220105,
   "departamento": "San Martín",
   "provincia": "Moyobamba ",
   "distrito": "Soritor"
  },
  {
   "ubigeo": 220106,
   "departamento": "San Martín",
   "provincia": "Moyobamba ",
   "distrito": "Yantalo"
  },
  {
   "ubigeo": 220201,
   "departamento": "San Martín",
   "provincia": "Bellavista ",
   "distrito": "Bellavista"
  },
  {
   "ubigeo": 220202,
   "departamento": "San Martín",
   "provincia": "Bellavista ",
   "distrito": "Alto Biavo"
  },
  {
   "ubigeo": 220203,
   "departamento": "San Martín",
   "provincia": "Bellavista ",
   "distrito": "Bajo Biavo"
  },
  {
   "ubigeo": 220204,
   "departamento": "San Martín",
   "provincia": "Bellavista ",
   "distrito": "Huallaga"
  },
  {
   "ubigeo": 220205,
   "departamento": "San Martín",
   "provincia": "Bellavista ",
   "distrito": "San Pablo"
  },
  {
   "ubigeo": 220206,
   "departamento": "San Martín",
   "provincia": "Bellavista ",
   "distrito": "San Rafael"
  },
  {
   "ubigeo": 220301,
   "departamento": "San Martín",
   "provincia": "El Dorado ",
   "distrito": "San José de Sisa"
  },
  {
   "ubigeo": 220302,
   "departamento": "San Martín",
   "provincia": "El Dorado ",
   "distrito": "Agua Blanca"
  },
  {
   "ubigeo": 220303,
   "departamento": "San Martín",
   "provincia": "El Dorado ",
   "distrito": "San Martín"
  },
  {
   "ubigeo": 220304,
   "departamento": "San Martín",
   "provincia": "El Dorado ",
   "distrito": "Santa Rosa"
  },
  {
   "ubigeo": 220305,
   "departamento": "San Martín",
   "provincia": "El Dorado ",
   "distrito": "Shatoja"
  },
  {
   "ubigeo": 220401,
   "departamento": "San Martín",
   "provincia": "Huallaga ",
   "distrito": "Saposoa"
  },
  {
   "ubigeo": 220402,
   "departamento": "San Martín",
   "provincia": "Huallaga ",
   "distrito": "Alto Saposoa"
  },
  {
   "ubigeo": 220403,
   "departamento": "San Martín",
   "provincia": "Huallaga ",
   "distrito": "El Eslabón"
  },
  {
   "ubigeo": 220404,
   "departamento": "San Martín",
   "provincia": "Huallaga ",
   "distrito": "Piscoyacu"
  },
  {
   "ubigeo": 220405,
   "departamento": "San Martín",
   "provincia": "Huallaga ",
   "distrito": "Sacanche"
  },
  {
   "ubigeo": 220406,
   "departamento": "San Martín",
   "provincia": "Huallaga ",
   "distrito": "Tingo de Saposoa"
  },
  {
   "ubigeo": 220501,
   "departamento": "San Martín",
   "provincia": "Lamas ",
   "distrito": "Lamas"
  },
  {
   "ubigeo": 220502,
   "departamento": "San Martín",
   "provincia": "Lamas ",
   "distrito": "Alonso de Alvarado"
  },
  {
   "ubigeo": 220503,
   "departamento": "San Martín",
   "provincia": "Lamas ",
   "distrito": "Barranquita"
  },
  {
   "ubigeo": 220504,
   "departamento": "San Martín",
   "provincia": "Lamas ",
   "distrito": "Caynarachi"
  },
  {
   "ubigeo": 220505,
   "departamento": "San Martín",
   "provincia": "Lamas ",
   "distrito": "Cuñumbuqui"
  },
  {
   "ubigeo": 220506,
   "departamento": "San Martín",
   "provincia": "Lamas ",
   "distrito": "Pinto Recodo"
  },
  {
   "ubigeo": 220507,
   "departamento": "San Martín",
   "provincia": "Lamas ",
   "distrito": "Rumisapa"
  },
  {
   "ubigeo": 220508,
   "departamento": "San Martín",
   "provincia": "Lamas ",
   "distrito": "San Roque de Cumbaza"
  },
  {
   "ubigeo": 220509,
   "departamento": "San Martín",
   "provincia": "Lamas ",
   "distrito": "Shanao"
  },
  {
   "ubigeo": 220510,
   "departamento": "San Martín",
   "provincia": "Lamas ",
   "distrito": "Tabalosos"
  },
  {
   "ubigeo": 220511,
   "departamento": "San Martín",
   "provincia": "Lamas ",
   "distrito": "Zapatero"
  },
  {
   "ubigeo": 220601,
   "departamento": "San Martín",
   "provincia": "Mariscal Cáceres ",
   "distrito": "Juanjuí"
  },
  {
   "ubigeo": 220602,
   "departamento": "San Martín",
   "provincia": "Mariscal Cáceres ",
   "distrito": "Campanilla"
  },
  {
   "ubigeo": 220603,
   "departamento": "San Martín",
   "provincia": "Mariscal Cáceres ",
   "distrito": "Huicungo"
  },
  {
   "ubigeo": 220604,
   "departamento": "San Martín",
   "provincia": "Mariscal Cáceres ",
   "distrito": "Pachiza"
  },
  {
   "ubigeo": 220605,
   "departamento": "San Martín",
   "provincia": "Mariscal Cáceres ",
   "distrito": "Pajarillo"
  },
  {
   "ubigeo": 220701,
   "departamento": "San Martín",
   "provincia": "Picota ",
   "distrito": "Picota"
  },
  {
   "ubigeo": 220702,
   "departamento": "San Martín",
   "provincia": "Picota ",
   "distrito": "Buenos Aires"
  },
  {
   "ubigeo": 220703,
   "departamento": "San Martín",
   "provincia": "Picota ",
   "distrito": "Caspisapa"
  },
  {
   "ubigeo": 220704,
   "departamento": "San Martín",
   "provincia": "Picota ",
   "distrito": "Pilluana"
  },
  {
   "ubigeo": 220705,
   "departamento": "San Martín",
   "provincia": "Picota ",
   "distrito": "Pucacaca"
  },
  {
   "ubigeo": 220706,
   "departamento": "San Martín",
   "provincia": "Picota ",
   "distrito": "San Cristóbal"
  },
  {
   "ubigeo": 220707,
   "departamento": "San Martín",
   "provincia": "Picota ",
   "distrito": "San Hilarión"
  },
  {
   "ubigeo": 220708,
   "departamento": "San Martín",
   "provincia": "Picota ",
   "distrito": "Shamboyacu"
  },
  {
   "ubigeo": 220709,
   "departamento": "San Martín",
   "provincia": "Picota ",
   "distrito": "Tingo de Ponasa"
  },
  {
   "ubigeo": 220710,
   "departamento": "San Martín",
   "provincia": "Picota ",
   "distrito": "Tres Unidos"
  },
  {
   "ubigeo": 220801,
   "departamento": "San Martín",
   "provincia": "Rioja ",
   "distrito": "Rioja"
  },
  {
   "ubigeo": 220802,
   "departamento": "San Martín",
   "provincia": "Rioja ",
   "distrito": "Awajun"
  },
  {
   "ubigeo": 220803,
   "departamento": "San Martín",
   "provincia": "Rioja ",
   "distrito": "Elías Soplin Vargas"
  },
  {
   "ubigeo": 220804,
   "departamento": "San Martín",
   "provincia": "Rioja ",
   "distrito": "Nueva Cajamarca"
  },
  {
   "ubigeo": 220805,
   "departamento": "San Martín",
   "provincia": "Rioja ",
   "distrito": "Pardo Miguel"
  },
  {
   "ubigeo": 220806,
   "departamento": "San Martín",
   "provincia": "Rioja ",
   "distrito": "Posic"
  },
  {
   "ubigeo": 220807,
   "departamento": "San Martín",
   "provincia": "Rioja ",
   "distrito": "San Fernando"
  },
  {
   "ubigeo": 220808,
   "departamento": "San Martín",
   "provincia": "Rioja ",
   "distrito": "Yorongos"
  },
  {
   "ubigeo": 220809,
   "departamento": "San Martín",
   "provincia": "Rioja ",
   "distrito": "Yuracyacu"
  },
  {
   "ubigeo": 220901,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "Tarapoto"
  },
  {
   "ubigeo": 220902,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "Alberto Leveau"
  },
  {
   "ubigeo": 220903,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "Cacatachi"
  },
  {
   "ubigeo": 220904,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "Chazuta"
  },
  {
   "ubigeo": 220905,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "Chipurana"
  },
  {
   "ubigeo": 220906,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "El Porvenir"
  },
  {
   "ubigeo": 220907,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "Huimbayoc"
  },
  {
   "ubigeo": 220908,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "Juan Guerra"
  },
  {
   "ubigeo": 220909,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "La Banda de Shilcayo"
  },
  {
   "ubigeo": 220910,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "Morales"
  },
  {
   "ubigeo": 220911,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "Papaplaya"
  },
  {
   "ubigeo": 220912,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "San Antonio"
  },
  {
   "ubigeo": 220913,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "Sauce"
  },
  {
   "ubigeo": 220914,
   "departamento": "San Martín",
   "provincia": "San Martín ",
   "distrito": "Shapaja"
  },
  {
   "ubigeo": 221001,
   "departamento": "San Martín",
   "provincia": "Tocache ",
   "distrito": "Tocache"
  },
  {
   "ubigeo": 221002,
   "departamento": "San Martín",
   "provincia": "Tocache ",
   "distrito": "Nuevo Progreso"
  },
  {
   "ubigeo": 221003,
   "departamento": "San Martín",
   "provincia": "Tocache ",
   "distrito": "Polvora"
  },
  {
   "ubigeo": 221004,
   "departamento": "San Martín",
   "provincia": "Tocache ",
   "distrito": "Shunte"
  },
  {
   "ubigeo": 221005,
   "departamento": "San Martín",
   "provincia": "Tocache ",
   "distrito": "Uchiza"
  },
  {
   "ubigeo": 230101,
   "departamento": "Tacna",
   "provincia": "Tacna ",
   "distrito": "Tacna"
  },
  {
   "ubigeo": 230102,
   "departamento": "Tacna",
   "provincia": "Tacna ",
   "distrito": "Alto de la Alianza"
  },
  {
   "ubigeo": 230103,
   "departamento": "Tacna",
   "provincia": "Tacna ",
   "distrito": "Calana"
  },
  {
   "ubigeo": 230104,
   "departamento": "Tacna",
   "provincia": "Tacna ",
   "distrito": "Ciudad Nueva"
  },
  {
   "ubigeo": 230105,
   "departamento": "Tacna",
   "provincia": "Tacna ",
   "distrito": "Inclan"
  },
  {
   "ubigeo": 230106,
   "departamento": "Tacna",
   "provincia": "Tacna ",
   "distrito": "Pachia"
  },
  {
   "ubigeo": 230107,
   "departamento": "Tacna",
   "provincia": "Tacna ",
   "distrito": "Palca"
  },
  {
   "ubigeo": 230108,
   "departamento": "Tacna",
   "provincia": "Tacna ",
   "distrito": "Pocollay"
  },
  {
   "ubigeo": 230109,
   "departamento": "Tacna",
   "provincia": "Tacna ",
   "distrito": "Sama"
  },
  {
   "ubigeo": 230110,
   "departamento": "Tacna",
   "provincia": "Tacna ",
   "distrito": "Coronel Gregorio Albarracín Lanchipa"
  },
  {
   "ubigeo": 230111,
   "departamento": "Tacna",
   "provincia": "Tacna ",
   "distrito": "La Yarada los Palos"
  },
  {
   "ubigeo": 230201,
   "departamento": "Tacna",
   "provincia": "Candarave ",
   "distrito": "Candarave"
  },
  {
   "ubigeo": 230202,
   "departamento": "Tacna",
   "provincia": "Candarave ",
   "distrito": "Cairani"
  },
  {
   "ubigeo": 230203,
   "departamento": "Tacna",
   "provincia": "Candarave ",
   "distrito": "Camilaca"
  },
  {
   "ubigeo": 230204,
   "departamento": "Tacna",
   "provincia": "Candarave ",
   "distrito": "Curibaya"
  },
  {
   "ubigeo": 230205,
   "departamento": "Tacna",
   "provincia": "Candarave ",
   "distrito": "Huanuara"
  },
  {
   "ubigeo": 230206,
   "departamento": "Tacna",
   "provincia": "Candarave ",
   "distrito": "Quilahuani"
  },
  {
   "ubigeo": 230301,
   "departamento": "Tacna",
   "provincia": "Jorge Basadre ",
   "distrito": "Locumba"
  },
  {
   "ubigeo": 230302,
   "departamento": "Tacna",
   "provincia": "Jorge Basadre ",
   "distrito": "Ilabaya"
  },
  {
   "ubigeo": 230303,
   "departamento": "Tacna",
   "provincia": "Jorge Basadre ",
   "distrito": "Ite"
  },
  {
   "ubigeo": 230401,
   "departamento": "Tacna",
   "provincia": "Tarata ",
   "distrito": "Tarata"
  },
  {
   "ubigeo": 230402,
   "departamento": "Tacna",
   "provincia": "Tarata ",
   "distrito": "Héroes Albarracín"
  },
  {
   "ubigeo": 230403,
   "departamento": "Tacna",
   "provincia": "Tarata ",
   "distrito": "Estique"
  },
  {
   "ubigeo": 230404,
   "departamento": "Tacna",
   "provincia": "Tarata ",
   "distrito": "Estique-Pampa"
  },
  {
   "ubigeo": 230405,
   "departamento": "Tacna",
   "provincia": "Tarata ",
   "distrito": "Sitajara"
  },
  {
   "ubigeo": 230406,
   "departamento": "Tacna",
   "provincia": "Tarata ",
   "distrito": "Susapaya"
  },
  {
   "ubigeo": 230407,
   "departamento": "Tacna",
   "provincia": "Tarata ",
   "distrito": "Tarucachi"
  },
  {
   "ubigeo": 230408,
   "departamento": "Tacna",
   "provincia": "Tarata ",
   "distrito": "Ticaco"
  },
  {
   "ubigeo": 240101,
   "departamento": "Tumbes",
   "provincia": "Tumbes ",
   "distrito": "Tumbes"
  },
  {
   "ubigeo": 240102,
   "departamento": "Tumbes",
   "provincia": "Tumbes ",
   "distrito": "Corrales"
  },
  {
   "ubigeo": 240103,
   "departamento": "Tumbes",
   "provincia": "Tumbes ",
   "distrito": "La Cruz"
  },
  {
   "ubigeo": 240104,
   "departamento": "Tumbes",
   "provincia": "Tumbes ",
   "distrito": "Pampas de Hospital"
  },
  {
   "ubigeo": 240105,
   "departamento": "Tumbes",
   "provincia": "Tumbes ",
   "distrito": "San Jacinto"
  },
  {
   "ubigeo": 240106,
   "departamento": "Tumbes",
   "provincia": "Tumbes ",
   "distrito": "San Juan de la Virgen"
  },
  {
   "ubigeo": 240201,
   "departamento": "Tumbes",
   "provincia": "Contralmirante Villar ",
   "distrito": "Zorritos"
  },
  {
   "ubigeo": 240202,
   "departamento": "Tumbes",
   "provincia": "Contralmirante Villar ",
   "distrito": "Casitas"
  },
  {
   "ubigeo": 240203,
   "departamento": "Tumbes",
   "provincia": "Contralmirante Villar ",
   "distrito": "Canoas de Punta Sal"
  },
  {
   "ubigeo": 240301,
   "departamento": "Tumbes",
   "provincia": "Zarumilla ",
   "distrito": "Zarumilla"
  },
  {
   "ubigeo": 240302,
   "departamento": "Tumbes",
   "provincia": "Zarumilla ",
   "distrito": "Aguas Verdes"
  },
  {
   "ubigeo": 240303,
   "departamento": "Tumbes",
   "provincia": "Zarumilla ",
   "distrito": "Matapalo"
  },
  {
   "ubigeo": 240304,
   "departamento": "Tumbes",
   "provincia": "Zarumilla ",
   "distrito": "Papayal"
  },
  {
   "ubigeo": 250101,
   "departamento": "Ucayali",
   "provincia": "Coronel Portillo ",
   "distrito": "Calleria"
  },
  {
   "ubigeo": 250102,
   "departamento": "Ucayali",
   "provincia": "Coronel Portillo ",
   "distrito": "Campoverde"
  },
  {
   "ubigeo": 250103,
   "departamento": "Ucayali",
   "provincia": "Coronel Portillo ",
   "distrito": "Iparia"
  },
  {
   "ubigeo": 250104,
   "departamento": "Ucayali",
   "provincia": "Coronel Portillo ",
   "distrito": "Masisea"
  },
  {
   "ubigeo": 250105,
   "departamento": "Ucayali",
   "provincia": "Coronel Portillo ",
   "distrito": "Yarinacocha"
  },
  {
   "ubigeo": 250106,
   "departamento": "Ucayali",
   "provincia": "Coronel Portillo ",
   "distrito": "Nueva Requena"
  },
  {
   "ubigeo": 250107,
   "departamento": "Ucayali",
   "provincia": "Coronel Portillo ",
   "distrito": "Manantay"
  },
  {
   "ubigeo": 250201,
   "departamento": "Ucayali",
   "provincia": "Atalaya ",
   "distrito": "Raymondi"
  },
  {
   "ubigeo": 250202,
   "departamento": "Ucayali",
   "provincia": "Atalaya ",
   "distrito": "Sepahua"
  },
  {
   "ubigeo": 250203,
   "departamento": "Ucayali",
   "provincia": "Atalaya ",
   "distrito": "Tahuania"
  },
  {
   "ubigeo": 250204,
   "departamento": "Ucayali",
   "provincia": "Atalaya ",
   "distrito": "Yurua"
  },
  {
   "ubigeo": 250301,
   "departamento": "Ucayali",
   "provincia": "Padre Abad ",
   "distrito": "Padre Abad"
  },
  {
   "ubigeo": 250302,
   "departamento": "Ucayali",
   "provincia": "Padre Abad ",
   "distrito": "Irazola"
  },
  {
   "ubigeo": 250303,
   "departamento": "Ucayali",
   "provincia": "Padre Abad ",
   "distrito": "Curimana"
  },
  {
   "ubigeo": 250304,
   "departamento": "Ucayali",
   "provincia": "Padre Abad ",
   "distrito": "Neshuya"
  },
  {
   "ubigeo": 250305,
   "departamento": "Ucayali",
   "provincia": "Padre Abad ",
   "distrito": "Alexander Von Humboldt"
  },
  {
   "ubigeo": 250401,
   "departamento": "Ucayali",
   "provincia": "Purús",
   "distrito": "Purus"
  }
 ]

}
