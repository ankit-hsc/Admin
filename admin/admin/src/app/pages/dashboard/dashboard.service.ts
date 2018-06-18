import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import{App_Const} from '../../app.const';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';



@Injectable()
export class DashboardService {
    private baseUrl:string=environment.apiUrl;    
    private headers = new Headers({ 'Authorization': localStorage.getItem("jwtToken") });
    private options = new RequestOptions({ headers: this.headers });
    private data: any;

    constructor(private _http: Http) { }

    getWidgetCount() {
 
        return this._http.get(this.baseUrl + '/analytics/loadWidgetData', this.options).map((response: Response) => response.json()
            ).catch(this.errorHandler);
    }

    fetchURL() {
        return this.baseUrl;
    }

    errorHandler(error: Response) {
        return Observable.throw(error || "SERVER ERROR");
    }
}