export class Contacto {

    constructor(
        public id?: number,
        public nombre?: string,
        public correo?: string,
        public telefono?: string,
        public tipo_anuncio?: string,
        public id_publicado?: string,
        public usuario_id?: number,
        public correo_destino?: string,
        public mensaje?: string
    ) {}

}