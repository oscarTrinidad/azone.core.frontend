import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class UtilService {
    private menuSubject = new Subject<string>();
    private routerSubject = new Subject<boolean>();
    menuObservable = this.menuSubject.asObservable();
    routerObservable = this.routerSubject.asObservable();

    sendMenu(id: string) { // enviarMenu
        this.menuSubject.next(id);
    }
    validateRouter(validate: boolean) { // validarRouter
        this.routerSubject.next(validate);
    }
}