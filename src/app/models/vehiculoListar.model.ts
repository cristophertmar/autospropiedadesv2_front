export class VehiculoListar {

    constructor(
        public id_vehiculo?: string,
        public descrip_marca?: string,
        public descrip_modelo?: string,
        public precio?: number,
        public kilometraje_vehiculo?: number,
        public provincia?: string,
        public distrito?: string,
        public anio_vehiculo?: number,
        public descrip_combustible?: string,
        public descrip_tipotran?: string,
        public condicion_vehiculo?: string,
        public usuario?: string,
        public imagen?: string,
        public foto?: string
    ) {}

}