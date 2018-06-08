import { Component, OnInit, NgZone } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ReportsService } from '../../reports.service';


@Component({
  selector: 'reports',
  styleUrls: ['./masterTable.scss'],
  templateUrl: './masterTable.html'
})
export class MasterTable implements OnInit {
  private listReport: any;
  private startTime: number = 1;
  private duration: number;
  private tableData: any;
  private testMsg: string = 'ankit';
  selectedFields = [];
  selectedText = [];
  private condition: any;
  private infractionCount: any;
  private showTable: boolean;
  private showfilterOptions: boolean = false;
  private showfiltertag: boolean = true;
  source: LocalDataSource = new LocalDataSource();
  private fromDate: string;
  private toDate: string;
  selectOptions = [
    { name: 'All', selected: false },
    { name: 'Pedestrian Obstruction', selected: false },
    { name: 'Red Light Violation', selected: false },
    { name: 'Traffic Density Analysis', selected: false }
  ];
  comparisonOptions = [
    {
      id: '0',
      name: 'None'
    },
    {
      id: '1',
      name: 'Less than(<)'
    }, {
      id: '2',
      name: 'Equal to(=)'
    }, {
      id: '3',
      name: 'Greater than(>)'
    }];
  //public  data:any;



  constructor(private reportsService: ReportsService, private router: Router, private route: ActivatedRoute) {

  }
  ngOnInit() {

    this.showTable = false;

    for (let i = 0; i < this.selectOptions.length; i++) {
      this.selectOptions[i].selected = true;
      this.selectedFields.push(this.selectOptions[i].name);
    }
    this.selectedText = this.selectedFields.filter(e => e == 'All');
    this.selectedFields = this.selectedFields.filter(e => e != 'All');
  }


  showFIlter() {
    this.showfilterOptions = true;
    this.showfiltertag = false;
  }
  hideFIlter() {
    this.showfilterOptions = false;
    this.showfiltertag = true;
  }

  query: string = '';

  settings = {
    hideSubHeader: true,
    actions: {
      position: 'right',
      add: false,
      edit: false,
      custom: [
        {
          name: 'View',
          title: `<i class="fa fa-eye" title="View Report" aria-hidden="true"></i>`
        }, {
          name: 'Download',
          title: `<i class="fa fa-download" title="Download Report" aria-hidden="true"></i>`
        }, {
          name: 'Share',
          title: `<i class="fa fa-share" title="Share Report" aria-hidden="true"></i>`
        }
      ]
    },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash" title="Delete Report"></i>',
      confirmDelete: true
    },
    columns: {
      videoFileName: {
        title: 'Video File Name',
        filter: false,
        width: '20%'
      },
      detectionType: {
        title: 'Object Detected',
        filter: false,
        width: '20%'
      },
      infractionsCount: {
        title: 'No of detections',
        filter: false,
        width: '10%'
      },
      uploadTime: {
        title: 'Upload Time',
        filter: false,
        width: '20%'
      },
      button: {
        title: 'View Report',
        type: 'custom',
        filter: false,
        width: '15%',
        renderComponent: ModalComponent,
        onComponentInitFunction: (instance: any) => {
          instance.click.subscribe(row => {
            console.log(row);
          });
        }
      }
    }
  };

  onCustom(ev) {
    if (ev.action.toLowerCase() === 'view') {
      this.rowSelect(ev);
    } else if (ev.action.toLowerCase() === 'download') {
      this.downloadReport();
    } else if (ev.action.toLowerCase() === 'share') {
      this.shareReport();
    }
  }

  downloadReport() {
    //To be implemented
  }

  shareReport() {
    //To be implemented
  }

  selectChanged(event, x) {
    let count = 0;
    if (!this.selectedFields) {
      this.selectedFields = [];
    }
    if (x.name == 'All') {
      if (event.target.checked) {
        for (let i = 0; i < this.selectOptions.length; i++) {
          this.selectOptions[i].selected = true;
          this.selectedFields.push(this.selectOptions[i].name);
        }
        this.selectedFields = Array.from(new Set(this.selectedFields));
        this.selectedText = this.selectedFields.filter(e => e == x.name);
        this.selectedFields = this.selectedFields.filter(e => e != x.name);
        console.log("Select All: " + this.selectedText);

      }
      else {
        for (let i = 0; i < this.selectOptions.length; i++) {
          this.selectOptions[i].selected = false;
          this.selectedFields = [];
          this.selectedText = this.selectedFields;
        }
        console.log("UnSelect All: " + this.selectedFields);

      }
    }

    else {
      if (event.target.checked) {
        this.selectOptions.map((row, i) => {
          if (row.name == x.name) { row.selected = true; }
        });
        this.selectedFields.push(x.name);
        this.selectedText = this.selectedFields;
        console.log("Selected : " + this.selectedFields);
      }
      else {
        this.selectOptions.map((row, i) => {
          if (row.name == x.name) { row.selected = false; }
          if (row.name == 'All') { row.selected = false; }
        });
        this.selectedFields = this.selectedFields.filter(e => e != x.name);
        this.selectedText = this.selectedFields;
        console.log("Selected : " + this.selectedFields);
      }

    }

    for (let i = 0; i < this.selectOptions.length; i++) {
      if (this.selectOptions[i].name != 'All') {
        if (this.selectOptions[i].selected == true) {
          count = count + 1;
        }
      }
    }

    if (count == this.selectOptions.length - 1) {
      this.selectOptions.map((row, i) => {
        if (row.name == 'All') {
          row.selected = true;
          this.selectedText[0] = 'All';
        }
      });
    }
  }


  selectCondition(value) {
    this.condition = value;
    console.log(this.condition);
  }


  getFlteredReports() {

    this.reportsService.getReports(this.selectedFields, this.condition, this.infractionCount, this.fromDate, this.toDate).subscribe(
      (report) => {
        this.showTable = true;
        this.source.load(report);
      }, (error) => {
        console.log(error);
      });

  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  rowSelect(event) {
    this.tableData = event.data;
    console.log(this.tableData);
    this.reportsService.setter(this.tableData);
    this.router.navigate(['/pages/reports/table']);

  }

  onSearch(query: string) {
    if (query != '') {
      this.source.setFilter([
        {
          field: 'videoFileName',
          search: query,
        },
        {
          field: 'detectionType',
          search: query,
        },
        {
          field: 'uploadTime',
          search: query,
        },
        {
          field: 'button',
          search: query,
        },
      ], false);
    } else {
      this.source.reset();
    }
  }
}
