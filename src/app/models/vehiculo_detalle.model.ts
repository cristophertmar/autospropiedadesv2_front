import { ImagenGaleria } from "./imagen_galeria.model";

export class VehiculoDetalle {

    constructor(
        public id_vehiculo?: string,
        public descrip_marca?: string,
        public descrip_modelo?: string,
        public anio_vehiculo?: number,
        public precio?: number,
        public descrip_vehiculo?: string,
        public kilometraje_vehiculo?: number,
        public descrip_tipotran?: string,
        public descrip_combustible?: string,
        public motor_vehiculo?: number,
        public descrip_timon?: string,
        public puertas_vehiculo?: string,
        public descrip_traccion?: string,
        public descrip_color?: string,
        public descrip_cilindro?: string,
        public provincia?: string,
        public distrito?: string,
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
        public condicion_vehiculo?: string,
        public usuario?: string,
        public correo?: string,
        public imagenes?: [],
        public imagen_galeria?: ImagenGaleria[],

        public  id_marca?: number,
        public  id_modelo?: number,
        public  id_tipotran?: number,
        public  id_combustible?: number,
        public  id_timon?: number,
        public  id_traccion?: number,
        public  id_color?: number,
        public  id_cilindro?: number,
        public  departamento?: string,
        public  ubigeo?: string,
        public  nrotelefono1_contacto?: string,
        public  nrotelefono2_contacto?: string,

        public  usuario_id?: number,
        public  usuario_foto?: string,
        public tipo_moneda?: string,
        public  tipo_anunciante?: number,

        public  fecha_subasta?: string,
        public  monto_subasta?: string,
        public  nombre_ganador_subasta?: string,
        public  id_ganador_subasta?: string,

    ) {}

}
