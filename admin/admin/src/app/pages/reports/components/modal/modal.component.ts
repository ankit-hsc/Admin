import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { ViewCell } from '../../../../../../node_modules/ng2-smart-table';
import{ReportsService} from '../../reports.service';
@Component({
    selector: 'button-view',
    templateUrl: './modal.html',
    styleUrls: ['./modal.scss']

})
export class ModalComponent implements ViewCell, OnInit {
    private data:any;
    private tabledata:any;
   
    private abc:string;
    constructor(private reportsService:ReportsService) {
  
    }
    renderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;
    @Input() msg: any;


    @Output() click: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.renderValue = this.value.toString().toUpperCase();

    }

    onClick() {
    
        this.save.emit(this.rowData);
    }
    fetchFrameList(){
      this.save.emit(this.rowData);
      this.tabledata=this.reportsService.getter();
            
    }
  
   

      seekVideo(time:string){
    
        let frameTime = time.split(':');
        let startSecond=parseInt(frameTime[2]);
        let vid:any = document.getElementById('video-tab');
        vid.currentTime = startSecond;
        let duration=1;
        vid.addEventListener('timeupdate', function() {
         
          if(this.currentTime < startSecond + duration){
            this.play();
          }
          else{
            this.pause();
            vid.currentTime = startSecond;
          }
      
        });
    
    }


}