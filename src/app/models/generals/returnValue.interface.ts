import { IBase } from "./base.interface";

export interface IReturnValue extends IBase {
  requestCode: string;
  requestName: string;
  responseCode: string;
  responseName: string;
  typeResponseCode: number;
  typeResponseName: string;
  concurrent: string;
  success: boolean;
  message: string;
  messageLog: string;
}