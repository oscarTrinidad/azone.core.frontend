import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
//import { AuthService } from '@app/services/auth/auth.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auths/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService, private router: Router
    ) {}
    
    async canActivate() {
        return await this.authService.isLoggedIn();
        // const token = await this.authService.isLoggedIn();
        // if (!token) {
        //     this.router.navigate(['/login']);
        //     return false;
        // } else {
        //     return true;
        // }
    }
}