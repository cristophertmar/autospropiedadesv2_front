export class Usuario {

    constructor(
        public correo?: string,
        public pass?: string,
        public nombre?: string,
        public apellido?: string,
        public proveedor?: string,
        public nrotelefono1?: string,
        public nrotelefono2?: string,
        public foto?: string,
        public rol?: string,
        public id?: number
    ) {}

}