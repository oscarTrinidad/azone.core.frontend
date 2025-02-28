import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthService } from "../../auths/auth.service";
import { HttpClient } from "@angular/common/http";
import { IMeetingInfo } from "src/app/models/meetings/meetingInfo.interface";
import { IReturnValue } from "src/app/models/generals/returnValue.interface";

@Injectable({
    providedIn: 'root'
})

export class MeetingInfoService {

    controllerName = "meetingInfoAzone";
    url: String = environment.url_api.general;
    
    constructor(public authService: AuthService, private http: HttpClient) { }
    user = this.authService.getJwtUser();
    limit = this.authService.getJwtLimit();
    
    async getList(source: string) {
        this.user = await this.authService.getJwtUser();
        return this.http.get<IMeetingInfo>(`${this.url}${this.controllerName}/getlist?source=${source}&user=${this.user}`);    
    } 
    
    getItem(source: string, hash: string) {
        return this.http.get<IMeetingInfo>(`${this.url}${this.controllerName}/getitem?source=${source}&user=${this.user}&hash=${hash}`);    
    }
    
    post(source: string, item: IMeetingInfo) {
        return this.http.post<IReturnValue>(`${this.url}${this.controllerName}/newreg?source=${source}&user=${this.user}`, item);
    }
      
    put(source: string, item: IMeetingInfo) {
        return this.http.put<IReturnValue>(`${this.url}${this.controllerName}?source=${source}&user=${this.user}`, item);
    }

    delete(source: string, hash: string) {
        return this.http.delete<IReturnValue>(`${this.url}${this.controllerName}?source=${source}&user=${this.user}&hash=${hash}`);
    }
        
    getSearch(source: string,date_ini: string, date_fin: string,hour_ini: string, hour_fin: string,item: IMeetingInfo) {        
        return this.http.post<IMeetingInfo>(`${this.url}${this.controllerName}/getsearch?source=${source}&user=${this.user}&date_ini=${date_ini}&date_fin=${date_fin}&hour_ini=${hour_ini}&hour_fin=${hour_fin}`, item);
    }

    getListFeeMeetings(source: string, programHash: string, groupHash: string) {
        return this.http.get<IMeetingInfo>(`${this.url}${this.controllerName}/getlistfeemeetings?source=${source}&user=${this.user}&programHash=${programHash}&groupHash=${groupHash}`);
    }
    
   
}