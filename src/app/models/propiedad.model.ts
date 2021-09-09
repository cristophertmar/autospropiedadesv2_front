export class Propiedad {

    constructor(
        public id_tarifa?: number,
        public id_tipo_operacion?: number,
        public id_tipo_inmueble?: number,
        public antiguedad?: number,

        public departamento?: string,
        public provincia?: string,
        public distrito?: string,
        public ubigeo?: string,
        public direccion?: string,
        public piso?: string,
        public referencia?: string,

        public tipo_moneda?: string,
        public precio?: number,

        public area_total?: number,
        public area_contruida?: number,
        public dormitorios?: number,
        public banios?: number,
        public cocheras?: number,
        public pisos?: number,
        public depa_pisos?: number,
        public ascensores?: number,
        public mantenimiento?: number,
        public uso_profesional?: number,
        public uso_comercial?: number,
        public mascotas?: number,

        public titulo?: string,
        public descripcion?: string,


        public nombre_contacto?: string,
        public nrotelefono1_contacto?: string,
        public nrotelefono2_contacto?: string,
        public correo_contacto?: string,
        public usuario_id?: number,

        public minprecio?: number,
        public maxprecio?: number,

        public id?: number,
        public id_propiedad?: string,

        public lat?: string,
        public lng?: string,

        public tags_general?: string,
        public tags_ambientes?: string,
        public tags_servicios?: string,

        public url_video?: string,
        public tipo_anunciante?: number,

        public precio_plan?: number,

    ) {}

}
