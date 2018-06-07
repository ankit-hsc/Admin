import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginService {
    private baseUrl:string=environment.apiUrl; 
    constructor(private _http: Http) { }

    login(name: any, password: any) {
        let user = { "username": name, "password": password };
        let formData: FormData = new FormData();

        return this._http.post(this.baseUrl + '/tensor/auth/login', user).map((response: Response) => {
            console.log(response);
            return response.json();
        }
        ).catch(this.errorHandler);

    }
    errorHandler(error: Response) {
        return Observable.throw(error || "SERVER ERROR");
    }
}