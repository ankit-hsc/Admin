import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class RegisterService {
    private baseUrl:string=environment.apiUrl; 
 

    constructor(private _http: Http) { }

    register(name: any, password: any) {
        let formData: FormData = new FormData();
        let user = { "username": name, "password": password };
        return this._http.post(this.baseUrl + '/tensor/auth/register', user).map((response: Response) => response.text()
        ).catch(this.errorHandler);

    }
    errorHandler(error: Response) {
        return Observable.throw(error || "SERVER ERROR");
    }
}