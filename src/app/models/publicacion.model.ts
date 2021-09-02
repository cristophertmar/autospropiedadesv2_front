export class Publicacion {

    constructor(
        public tipo_anuncio?: string,
        public id_publicacion?: string,
        public tipo?: string,
        public precio?: number,
        public subtitulo?: string,
        public titulo?: string,
        public ubicacion?: string,
        public descrip1?: string,
        public descrip2?: string,
        public descrip3?: string,
        public dias_vigencia?: number,
        public imagen?: string,
        public editable?: boolean
    ) {}

}
