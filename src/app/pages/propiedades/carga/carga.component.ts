import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { SharedService } from '../../../services/shared.service';
import { Propiedad } from '../../../models/propiedad.model';
import { PropiedadService } from '../../../services/propiedad.service';

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

  constructor(
    private _shared: SharedService,
    private _propiedadService: PropiedadService
  ) { }

  ngOnInit(): void {
  }

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
    this.keys = null;
  }

  adjuntar_excel() {
    this.inputFile.nativeElement.click();
  }

  adjuntar_zip() {
    this.inputFile2.nativeElement.click();
  }

  cargar() {
    console.clear();
    if(this.data.length > 0) {
      this.data.splice(0, 1);
      for (let i = 0; i < this.data.length; i++ ) {
        let propiedad = new Propiedad();

        propiedad.id_tarifa = 1;
        propiedad.usuario_id = 1;

        propiedad.titulo = this.data[i].titulo;
        propiedad.descripcion = this.data[i].descripcion;

        propiedad.id_tipo_operacion = Number(this.data[i].id_tipo_operacion);
        propiedad.id_tipo_inmueble = Number(this.data[i].id_tipo_inmueble);
        propiedad.antiguedad = Number(this.data[i].antiguedad);

        propiedad.departamento = this.data[i].departamento;
        propiedad.provincia = this.data[i].provincia;
        propiedad.distrito = this.data[i].distrito;
        propiedad.ubigeo = this.data[i].distrito;
        propiedad.direccion = this.data[i].direccion;
        propiedad.piso = this.data[i].piso;
        propiedad.referencia = this.data[i].referencia;

        propiedad.tipo_moneda = this.data[i].tipo_moneda;
        propiedad.precio = Number(this.data[i].precio);

        propiedad.area_total = Number(this.data[i].area_total);
        propiedad.area_contruida = Number(this.data[i].area_contruida);
        propiedad.dormitorios = Number(this.data[i].dormitorios);
        propiedad.banios = Number(this.data[i].banios);
        propiedad.cocheras = Number(this.data[i].cocheras);
        propiedad.pisos = Number(this.data[i].pisos);
        propiedad.depa_pisos = Number(this.data[i].pisos);

        propiedad.ascensores = Number(this.data[i].ascensores);
        propiedad.mantenimiento = Number(this.data[i].mantenimiento);
        propiedad.uso_profesional = Number(this.data[i].uso_profesional);
        propiedad.uso_comercial = Number(this.data[i].uso_comercial);
        propiedad.mascotas = Number(this.data[i].mascotas);

        propiedad.nombre_contacto = this.data[i].nombre_contacto;
        propiedad.nrotelefono1_contacto = this.data[i].nrotelefono1_contacto;
        propiedad.nrotelefono2_contacto = this.data[i].nrotelefono2_contacto;
        propiedad.correo_contacto = this.data[i].correo_contacto;
        propiedad.tipo_anunciante = Number(this.data[i].tipo_anunciante);
                
        propiedad.tags_general = '[]';
        propiedad.tags_ambientes = '[]';
        propiedad.tags_servicios = '[]';
        propiedad.lat = '';
        propiedad.lng = '';
        propiedad.url_video = '';

        console.log({propiedad});

        this._propiedadService.publicar_propiedad(propiedad)
        .subscribe((resp: any) => {
            console.log(resp);
        });

      }
      return;
    }    

  }




}
