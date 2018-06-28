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


      
      getFile(filename,fileExt,filetype,partnumbers){      
        let  headers = new Headers({ 
        'fileName': filename ,
        'partNumbers': partnumbers}       
      );
      
      let opt = new RequestOptions({headers:headers});     
       return this._http.get(this.baseUrl+ "/upload/file/"+filename,opt).map((response:Response)=>response.json()
      ).catch(this.errorHandler);
      }
      
      onFileNotExist(filename){
        let  headers = new Headers({ 
            'content-type': 'text/plain',     
            'fileName': filename,
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
         }              
          );
          
          let opt = new RequestOptions({headers:headers});     
           return this._http.post(this.baseUrl+ "/upload/files",{},opt).map((response:Response)=>response
          ).catch(this.errorHandler);
      }


      updateUpload(part:any){
       
      
       let  headers = new Headers({
       
        'fileName': part.fileName,
        'partNumber': part.partNumber,
        'uploadOffset': part.uploadOffset,
        'uploadLength': part.uploadLength,
        'fileSize': part.fileSize,
        'userName': 'placeholder'}
      );
      let options = new RequestOptions({headers:headers});


         // return this._http.post(this.baseUrl+'/tensor/videoProcessing?ml='+ml,formData).map((response:Response)=>response.json()
          return this._http.patch(this.baseUrl+"/upload/file/"+part.fileName,part.file,options).map((response:Response)=>response.text()
             ).catch(this.errorHandler);
      }

      mergeFile(fileName,fileExt,partNumbers,fileSize){

        let  headers = new Headers({
       
            'fileName': fileName,
            'fileExt': fileExt,
            'partNumbers': partNumbers,
            'fileSize': fileSize,
            "Cache-Control": "no-cache",
            "Pragma": "no-cache", 
          }
          );
          let options = new RequestOptions({headers:headers});
         return this._http.post(this.baseUrl+"/upload/files/complete",{},options).map((response:Response)=>response
                 ).catch(this.errorHandler);
      }


    report(ml:any,token,fileName,fileExt){
        // let formData:FormData= new FormData();
        // formData.append('file',file,file.name);
        let  headers = new Headers({   
            'Authorization':localStorage.getItem("jwtToken") ,   
            'ml': ml,
            'token': token,
            'fileName': fileName, 
            'fileExt': fileExt          
          }
          );
          let options = new RequestOptions({headers:headers});
        
        return this._http.post(this.baseUrl+'/analytics/videoProcessing',{},options).map((response:Response)=>{
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