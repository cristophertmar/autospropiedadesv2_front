export class ClienteContacto {

    constructor(
        public nombre?: string,
        public correo?: string,
        public telefono?: string,
        public mensaje?: string,
        public alertas?: boolean
    ) {}

}