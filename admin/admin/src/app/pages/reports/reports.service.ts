import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class ReportsService {
    private baseUrl:string=environment.apiUrl; 
    private headers = new Headers({ 'Authorization': localStorage.getItem("jwtToken") });
    private options = new RequestOptions({ headers: this.headers });
    private data: any;
    constructor(private _http: Http) { }


    getReports(selectedFields, condition, infractionCount, fromDate, toDate) {
        // return this._http.get(this.baseUrl+'/tensor/getAllReports').map((response:Response)=>response.json()
        return this._http.get(this.baseUrl + '/analytics/getAllReports?detectionType=' + selectedFields + '&countFilter=' + condition + '&infractionCount=' + infractionCount
            + '&fromDate=' + fromDate + '&toDate=' + toDate, this.options).map((response: Response) => response.json()
            ).catch(this.errorHandler);
    }

    fetchURL() {
        return this.baseUrl;
    }


    setter(data: any) {
        this.data = data;
    }
    getter() {
        return this.data;
    }

    errorHandler(error: Response) {
        return Observable.throw(error || "SERVER ERROR");
    }
}