export class Facturacion {

    constructor(
        public nombre?: string,
        public apellido?: string,
        public razon_social?: string,
        public ubigeo?: string,
        public direccion?: string,
        public celular?: string,
        public correo?: string,
        public info_adicional?: string,
        public ids_vehiculos?: string,
        public ids_propiedades?: string,
        public monto?: number
    ) {}

}