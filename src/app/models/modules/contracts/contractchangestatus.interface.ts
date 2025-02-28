import { IReturnValue } from "../../generals/returnValue.interface";

export interface IContractChangeStatus  extends  IReturnValue{
    hash: string;
    changeDate: string;
    comments: string;
    statusHash: string;
    statusName: string;
    contractNumber: string;
    list: IContractChangeStatus[];
}
