import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IToken } from "src/app/models/auths/tokens.interface";
import { IUser } from "src/app/models/users/user.interface";
import { StorageService } from "../storages/storage.service";
import { environment } from '../../../environments/environment';
import { IAuth } from "src/app/models/auths/auth.interface";
import { tap } from 'rxjs/operators';
import { IReturnValue } from "src/app/models/generals/returnValue.interface";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private readonly JWT_TOKEN = 'JWT_TOKEN';
    private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
    private readonly JWT_USER = 'USERNAME';
    private readonly JWT_FULLNAME = 'FULLNAME';
    private readonly JWT_USER_INFO = 'JWT_USER_INFO';
    private readonly JWT_CURRENT_SESSIONHISTORY_HASH = 'JWT_CURRENT_SESSIONHISTORY_HASH';
    private readonly JWT_USER_LIMIT = 'JWT_USER_LIMIT';
    private loggedUser: string | any;

    constructor(
        private http: HttpClient,
        private storageService: StorageService,
            private router: Router
    ) { }

    async getJwtToken() {
        const token: string | any = await this.storageService.getItem(this.JWT_TOKEN);
        return token;
    }

    private getRefreshToken() {
        return this.storageService.getItem(this.REFRESH_TOKEN);
    }

    async getJwtUser() {
        return await this.storageService.getItem(this.JWT_USER);
    }

    getJwtUserInfo() {
        return this.storageService.getItem(this.JWT_USER_INFO);
    }

    getJWTCurrentSessionHistoryHash() {
        return this.storageService.getItem(this.JWT_CURRENT_SESSIONHISTORY_HASH);
    }

    async getJwtLimit() {
        return await this.storageService.getItem(this.JWT_USER_LIMIT);
    }

    private storeTokens(tokens: IToken) {
        this.storageService.setItem(this.JWT_TOKEN, tokens.jwtToken);
        this.storageService.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
        this.storageService.setItem(this.JWT_USER_INFO, tokens.userAzone);
        this.storageService.setItem(this.JWT_USER, tokens.userAzone.username);
        // this.storageService.setItem(this.JWT_CURRENT_SESSIONHISTORY_HASH, tokens.sessionHistoryHash);
        this.storageService.setItem(this.JWT_USER_LIMIT, 200);
    }

    private storeJwtToken(jwt: string) {
        this.storageService.setItem(this.JWT_TOKEN, jwt);
    }

    private removeTokens() {
        this.storageService.removeItem(this.JWT_TOKEN);
        this.storageService.removeItem(this.REFRESH_TOKEN);
        this.storageService.removeItem(this.JWT_USER);
        this.storageService.removeItem(this.JWT_USER_INFO);
        this.storageService.removeItem(this.JWT_USER_LIMIT);
        // this.storageService.removeItem(this.JWT_CURRENT_SESSIONHISTORY_HASH);
        return Promise.resolve(true);
    }

    login(user: IAuth) {
        return this.http.post<IToken>(`${environment.url_api.general}securityAzone/authenticate`, user);
    }

    changePassword(user: IAuth) {
        return this.http.post<IReturnValue>(`${environment.url_api.general}securityAzone/changepassword`, user);
    }


    async doLoginUser(tokens: IToken) {
        this.loggedUser = tokens.userAzone.username;
        this.storeTokens(tokens);
    }

    private doLogoutUser() {
        this.loggedUser = null;
        this.removeTokens();
    }

    logout() {
        try {
            this.doLogoutUser();
            return true;
        } catch (exception) {
            return false;
        }
    }

    async isLoggedIn() {
        // const token = await this.getJwtToken();
        const token = await this.storageService.getItem('JWT_TOKEN');
        // console.log(token);
        if(!token){
          this.router.navigate(['/login']);
          return Promise.resolve(false);
        }else{
          return Promise.resolve(true);
        }
        // try {
        //     return this.getJwtToken().length > 0;
        // } catch (exception) {
        //     return false;
        // }
    }

    refreshToken() {
        return this.http.post<any>(`${environment.url_api}/refresh`, {
            'refreshToken': this.getRefreshToken()
        }).pipe(tap((tokens: IToken) => {
            this.storeJwtToken(tokens.jwtToken);
        }));
    }

}