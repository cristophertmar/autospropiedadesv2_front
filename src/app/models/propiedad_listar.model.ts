export class PropiedadListar {

    constructor(
        public id_propiedad?: string,
        public id_tipo_operacion?: number,
        public tipo_descripcion_desc?: string,
        public id_tipo_inmueble?: number,
        public tipo_inmueble_desc?: string,
        public ubigeo?: string,
        public provincia?: string,
        public distrito?: string,
        public precio?: number,
        public area_total?: number,
        public dormitorios?: number,
        public banios?: number,
        public imagen?: string,
        public titulo?: string,
        public usuario?: string,
        public foto?: string
    ) {}

}