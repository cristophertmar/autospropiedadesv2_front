export class Contacto {

    constructor(       
        public correo_destino?: string,
        public nombre_destino?: string,
        public asunto_contacto?: string,
        public nombre_contacto?: string,
        public correo_contacto?: string,
        public telefono_contacto?: string,
        public titulo_anuncio?: string,        
        public mensaje_contacto?: string,

        public tipo_anuncio?: string,
        public id_publicado?: string,
        public usuario_id?: number,
        public id?: number
    ) {}

}