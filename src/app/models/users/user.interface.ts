import { IReturnValue } from "../generals/returnValue.interface";

export interface IUser extends IReturnValue{
    userId: number;
    hash: string;
    username: string;
    password: string;
    type: number;
    typeName: string;
    repeat: boolean;
    fullName: string;
    userDocumentHash: string;
    documentName: string;
    number: string;
    email: string;
    phone: string;
    list: IUser[];
}