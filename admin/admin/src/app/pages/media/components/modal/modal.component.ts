import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { ViewCell } from '../../../../../../node_modules/ng2-smart-table';

@Component({
    selector: 'button-view',
    templateUrl: './modal.html',
    styleUrls: ['./modal.scss']

})
export class ModalComponent implements ViewCell, OnInit {
    private data:any;
    private tabledata:any;
   
    private abc:string;
    constructor() {
  
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

            
    }
  
   


}