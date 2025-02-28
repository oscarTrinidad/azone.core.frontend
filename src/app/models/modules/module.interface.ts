import { IReturnValue } from "src/app/models/generals/returnValue.interface";
import { ISubModule } from "./subModule.interface";

export interface IModule{
    icon?: string;
    title?: string;
    url?: string;
    caret?: string;
    subModules?: ISubModule[];
    list?: IModule;
}

export interface IMenu {
    idMenu: number;
    name: string;
    icon?: string;
    image?: string;    
    srcImage?: string;
    route?: string; 
    idFather?: number;
    status?: number;
    user?: string;
    statusMenu?: number;
    sStatusMenu?: string;
    register?: number;

    assigned?: boolean; //asignado
    subMenus?: IMenu[];

    index?: number;
}