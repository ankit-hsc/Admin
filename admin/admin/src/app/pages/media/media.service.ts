import {Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';
import{Http, Response, Headers, RequestOptions} from '@angular/http';
import{Observable}   from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';



@Injectable()
export class MediaService{
    private baseUrl:string=environment.apiUrl; 
   
    private headers=new Headers({'Authorization':localStorage.getItem("jwtToken")});
    private options=new RequestOptions({headers:this.headers});
    private data:any;
    constructor(private _http:Http) { }

    report(file:File,ml:any){
        let formData:FormData= new FormData();
        formData.append('file',file,file.name);
        
        return this._http.post(this.baseUrl+'/analytics/videoProcessing?ml='+ml,formData,this.options).map((response:Response)=>{
            console.log(response);
           return  response.json();
        }
    ).catch(this.errorHandler);
    
    }

    getAllReports(){
        // return this._http.get(this.baseUrl+'/tensor/getAllReports').map((response:Response)=>response.json()
        return this._http.get(this.baseUrl+'/analytics/getAllReports',this.options).map((response:Response)=>response.json()
       ).catch(this.errorHandler);
       }

    fetchURL(){
        return this.baseUrl;
      }
      

      setter(data:any){
        this.data=data;
         }
         getter(){
             return this.data;
         }

    errorHandler(error:Response){
        return Observable.throw(error||"SERVER ERROR");
     }
}