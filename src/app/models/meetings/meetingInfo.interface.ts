import { IReturnValue } from "../generals/returnValue.interface";

export interface IMeetingInfo  extends IReturnValue{
    hash: string;
    meetingHash: string;
    location: string;
    meetingDate: string;
    feeHash: string;
    feeNumber: number;
    groupHash: string;
    groupCode: string;
    groupNumber: string;
    programHash: string;
    programName: string;
    programCode: string;
    dateReg: string;
    hourReg: string;
    details: string;
    status: string;
    statusName: string;
    list: IMeetingInfo[];
}