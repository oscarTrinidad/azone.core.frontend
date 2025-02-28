import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, from, Observable, switchMap, take, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(public authService: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Interceptando solicitud:', request.url); // Verifica si se ejecuta
        return from(this.authService.getJwtToken()).pipe(
            switchMap(token => {
                if (token) {
                    request = this.addToken(request, token);
                }

                return next.handle(request).pipe(
                    catchError(error => {
                        if (error instanceof HttpErrorResponse && error.status === 401) {
                            this.router.navigate(['/login']);
                            return this.handle401Error(request, next);
                        }
                        return throwError(() => error);
                    })
                );
            })
        );
        // const token = await this.authService.getJwtToken();
        // if (token) {
        //     request = this.addToken(request, token);
        // }
        // /*else if(request.url.substring(0,43) == 'https://google-authenticator.p.rapidapi.com'){
        //   request = this.addRapidAPIToken(request);
        // }*/

        // return next.handle(request).pipe(catchError(error => {

        //     if (error instanceof HttpErrorResponse && error.status === 401) {
        //         this.router.navigate(['/login']);
        //         return this.handle401Error(request, next);
        //     } else {
        //         return throwError(error);
        //     }
        // }));
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap((token: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(token.jwt);
                    return next.handle(this.addToken(request, token.jwt));
                }));

        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addToken(request, jwt));
                }));
        }
    }
}