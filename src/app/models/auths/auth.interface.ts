export interface IAuth {
    userHash: number;
    pathImagen: string;
    pathLogo: string;
    typeUser: string;
    typeUserHash: number;
    associatedHash: number;
    fullName: string;
    username: string;
    password?: string;
    repeatPassword?: string;
    flag_type:boolean;
  }