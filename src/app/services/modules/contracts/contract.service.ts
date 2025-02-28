
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auths/auth.service';
import { IContract } from 'src/app/models/modules/contracts/contract.interface';
import { IReturnValue } from 'src/app/models/generals/returnValue.interface';
import { IContractChangeStatus } from 'src/app/models/modules/contracts/contractchangestatus.interface';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  controllerName = "contract";
  url: String = environment.url_api.general;

  constructor(public authService: AuthService, private http: HttpClient) { }
  user = this.authService.getJwtUser();
  limit = this.authService.getJwtLimit();
  sessionHistoryHash = '0';

  getList(source: string, groupHash: string) {
    return this.http.get<IContract>(`${this.url}${this.controllerName}/getlist?source=${source}&user=${this.user}&groupHash=${groupHash}`);
  }
  getItem(source: string, hash: string) {
    return this.http.get<IContract>(`${this.url}${this.controllerName}/getitem?source=${source}&user=${this.user}&hash=${hash}`);
  }
  post(source: string, item: IContract) {
    return this.http.post<IReturnValue>(`${this.url}${this.controllerName}?source=${source}&user=${this.user}`, item);
  }
  put(source: string, item: IContract) {
    return this.http.put<IReturnValue>(`${this.url}${this.controllerName}?source=${source}&user=${this.user}`, item);
  }
  delete(source: string, hash: string) {
    return this.http.delete<IReturnValue>(`${this.url}${this.controllerName}?source=${source}&user=${this.user}&hash=${hash}`);
  }

  getItemChangeStatus(source: string, hash: string) {
    return this.http.get<IContract>(`${this.url}${this.controllerName}/getitemchangestatus?source=${source}&user=${this.user}&hash=${hash}`);
  }

  async getSearch(source: string, element: IContract) {
    this.user = await this.authService.getJwtUser();
    this.limit = await this.authService.getJwtLimit();

    return this.http.post<IContract>(`${this.url}${this.controllerName}/getlist?source=${source}&user=${this.user}&sessionHistoryHash=${this.sessionHistoryHash}&limit=${this.limit}`, element);
  }
  
  changeStatus(source: string, item: IContractChangeStatus) {
    return this.http.put<IReturnValue>(`${this.url}${this.controllerName}/changestatus?source=${source}&user=${this.user}`, item);
  }
  getTracking(source: string, hash: string) {
    return this.http.get<IContractChangeStatus>(`${this.url}${this.controllerName}/gettracking?source=${source}&user=${this.user}&hash=${hash}`);
  }
  validateNumber(source: string, contractNumber: string) {
    return this.http.get<IContract>(`${this.url}${this.controllerName}/validatenumber?source=${source}&user=${this.user}&contractNumber=${contractNumber}`);
  }

  changeCertificate(source: string, contractHash: string, datechange: string, certificateHash: string) {
    return this.http.get<IReturnValue>(`${this.url}${this.controllerName}/changecertificate?source=${source}&user=${this.user}&contractHash=${contractHash}&datechange=${datechange}&certificateHash=${certificateHash}`);
  }

  changeContractCertificate(source: string, contract: IContract) {
    return this.http.put<IReturnValue>(`${this.url}${this.controllerName}/changecontractcertificate?source=${source}&user=${this.user}`,contract);
  }
}
