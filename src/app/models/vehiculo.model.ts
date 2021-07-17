export class Vehiculo {

    constructor(
        public id_tarifa?: number,
        public id_marca?: number,
        public id_modelo?: number,
        public anio_vehiculo?: number,
        public id_tipotran?: number,
        public id_combustible?: number,
        public motor_vehiculo?: number,
        public id_timon?: number,
        public kilometraje_vehiculo?: number,
        public puertas_vehiculo?: number,
        public id_traccion?: number,
        public id_color?: number,
        public id_cilindro?: number,
        public descrip_vehiculo?: string,
        public retrovisor_acce_veh?: boolean,
        public neblinero_acce_veh?: boolean,
        public aireacond_acce_veh?: boolean,
        public fullequipo_acce_veh?: boolean,
        public computador_acce_veh?: boolean,
        public parlante_acce_veh?: boolean,
        public cd_acce_veh?: boolean,
        public mp3_acce_veh?: boolean,
        public aro_acce_veh?: boolean,
        public aroaleacion_acce_veh?: boolean,
        public parrilla_acce_veh?: boolean,
        public luceshalo_acce_veh?: boolean,
        public gps_acce_veh?: boolean,
        public airbag_acce_veh?: boolean,
        public lamina_acce_veh?: boolean,
        public blindado_acce_veh?: boolean,
        public farantiniebdel_acce_veh?: boolean,
        public farantiniebtras_acce_veh?: boolean,
        public inmovmotor_acce_veh?: boolean,
        public repartelecfrena_acce_veh?: boolean,
        public frenoabs_acce_veh?: boolean,
        public alarma_acce_veh?: boolean,
        public sunroof_acce_veh?: boolean,
        public ascuero_acce_veh?: boolean,
        public climatizador_acce_veh?: boolean,

        public departamento?: string,
        public provincia?: string,
        public ubigeo?: string,

        public tipo_moneda?: number,
        public precio?: number,

        public nombre_contacto?: string,
        public nrotelefono1_contacto?: string,
        public nrotelefono2_contacto?: string,
        public correo_contacto?: string,
        public usuario_id?: number,
        public condicion_vehiculo?: number,
        public id_kilometros?: number,

        public tipo_anunciante?: number,
        public categoria?: string,
        public id_vehiculo?: number,
        public id?: string,

        public minprecio?: number,
        public maxprecio?: number
    ) {}

}