import { ImagenGaleria } from "./imagen_galeria.model";

export class PropiedadDetalle {

    constructor(
        public id_propiedad?: string,
        public tipo_descripcion_desc?: string,
        public tipo_inmueble_desc?: string,
        public ubigeo?: string,
        public provincia?: string,
        public distrito?: string,
        public precio?: number,
        public area_total?: number,
        public area_contruida?: number,
        public dormitorios?: number,
        public banios?: number,
        public cocheras?: number,
        public pisos?: number,
        public ascensores?: string,
        public mantenimiento?: number,
        public uso_profesional?: string,
        public uso_comercial?: string,
        public mascotas?: string,
        public correo_contacto?: string,
        public nombre_contacto?: string,
        public usuario_id?: number,
        public titulo?: string,
        public descripcion?: string,
        public imagenes?: [],
        public imagen_galeria?: ImagenGaleria[],

        public id_tipo_operacion?: number,
        public id_tipo_inmueble?: number,
        public antiguedad?: number,
        public departamento?: string,
        public direccion?: string,
        public piso?: string,
        public referencia?: string,
        public ascensores_id?: number,
        public uso_profesional_id?: number,
        public uso_comercial_id?: number,
        public mascotas_id?: number,
        public usuario_foto?: string,
        public nrotelefono1_contacto?: string,
        public nrotelefono2_contacto?: string,
        public tipo_moneda?: string
    ) {}

}
