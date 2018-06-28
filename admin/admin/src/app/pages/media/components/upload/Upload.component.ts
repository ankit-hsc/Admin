import { Component, OnInit } from '@angular/core';
import { NgUploaderOptions } from 'ngx-uploader';
//import{UploadService} from './upload.service';
import { MediaService } from '../../media.service';
import { ModalComponent } from '../modal/modal.component'
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
declare var jquery: any;
declare var $ : any;
declare var ajax : any;

@Component({
  selector: 'upload',
  styleUrls: ['./upload.scss'],
  templateUrl: './upload.html'
})
export class Upload implements OnInit {
  private file: any;
  private token: string;
  private tableData: any;
  private fileName: string;
  private detectionType: string;
  private showReportTable: boolean = false;
  private showProgress: boolean = false;
  private timeStamp: any;
  private imagePath: string;
  selectedFields = [];
  selectedText = [];
  progress: any;
  source: LocalDataSource = new LocalDataSource();
  public uploaderOptions: NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };

  public fileUploaderOptions: NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };


  selectOptions = [
    { name: 'All', selected: false },
    { name: 'Pedestrian Obstruction', selected: false },
    { name: 'Red Light Violation', selected: false },
    { name: 'Traffic Density Analysis', selected: false },
    { name: 'License Plate Recognition', selected: false }
  ];

  constructor(private mediaService: MediaService, private router: Router) {

  }

  ngOnInit() {




    for (let i = 0; i < this.selectOptions.length; i++) {
      this.selectOptions[i].selected = true;
      this.selectedFields.push(this.selectOptions[i].name);
    }
    this.selectedText = this.selectedFields.filter(e => e == 'All');
    this.selectedFields = this.selectedFields.filter(e => e != 'All');
    console.log(this.selectedText);
  }
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
        title: 'No of Detections',
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

  rowSelect(event) {
    this.tableData = event.data;
    console.log(this.tableData);
    this.mediaService.setter(this.tableData);
    this.router.navigate(['/pages/media/table']);
  }

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

  receiveFile($event) {
    this.file = $event;
    console.log(this.file);
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


  onFileSelected() {

    if (this.file != undefined && this.selectedFields != undefined && this.selectedFields.length > 0) {
      this.showReportTable = false;
      this.showProgress = true;
      let interval: any;


      $(function () {
        var current_progress = 0;
        interval = setInterval(function () {
          current_progress += 1;
          $("#dynamic")
            .css("width", current_progress + "%")
            .attr("aria-valuenow", current_progress)
            .text(current_progress + "%");
          if (current_progress >= 99)
            clearInterval(interval);
        }, 666);
      });


      var capAtFilesize = function (value, fileSize) { return value > fileSize ? fileSize : value; };

      var createFileParts = function (file, fileName, fileExt, uploadOffset, uploadLength, partNumber, parts) {
        var fileSize = file.size;
        if (uploadOffset >= file.size)
          return parts;
        parts.push({
          file: file.slice(uploadOffset, uploadLength + 1),
          fileName: fileName,
          fileExt: fileExt,
          partNumber: partNumber,
          partSize: capAtFilesize(uploadLength, fileSize) - capAtFilesize(uploadOffset, fileSize),
          uploadOffset: capAtFilesize(uploadOffset, fileSize),
          uploadLength: capAtFilesize(uploadLength, fileSize),
          fileSize: fileSize
        });
        return createFileParts(file, fileName, fileExt, capAtFilesize(uploadOffset + PART_SIZE, fileSize), capAtFilesize(uploadLength + PART_SIZE, fileSize), partNumber + 1, parts);
      };
      let PART_SIZE = 5 * 1024 * 1024;
      let FILENAME_PATTERN = /^(.+)\..*/;
      let FILEEXT_PATTERN = /\.[0-9a-z]+$/i;

      let fileName = FILENAME_PATTERN.exec(this.file.name)[1];
      let fileExt = FILEEXT_PATTERN.exec(this.file.name)[0];
      let parts = createFileParts(this.file, fileName, fileExt, 0, PART_SIZE, 0, []);
      let partNumbers = parts.map(function (part) { return part.partNumber; });
      console.log(parts);

      this.mediaService.getFile(fileName, fileExt, this.file.type, partNumbers).subscribe((data) => {

      }, (error) => {
        console.log(error);
        if (error._body == 'newUpload') {
          this.mediaService.onFileNotExist(fileName).subscribe((value) => {
            console.log(parts);
            let count = 0;

            parts.forEach(element => {

              this.mediaService.updateUpload(element).subscribe((e) => {
                count++;
                if (count == parts.length) {
                  this.mediaService.mergeFile(fileName, fileExt, partNumbers, this.file.size).subscribe((e) => {
                    console.log(e);
                    this.mediaService.report(this.selectedFields,e._body,fileName,fileExt).subscribe((data) => {
                      this.source.load(data);
                      $("#dynamic").css("width", 100 + "%").attr("aria-valuenow", 100).text(100 + "%");

                      let tempThis = this;
                      setTimeout(function () {
                        clearInterval(interval);
                        tempThis.showReportTable = true;
                        tempThis.showProgress = false;
                      }, 250);

                    }, err => {
                      console.log(JSON.stringify(err));
                    })
                  }, (error) => {
                    console.log(error);
                  });
                }
              }, (error) => {
                console.log(error);
              });
            });


          }, (error) => {
            console.log(error);
          });
        }

      });



    }
    else {
      if (typeof this.file == "undefined") { alert("Please select video") }
      else { alert("Please select detection type"); }
    }
  }



  fetchFrame(frameNo: number) {
    console.log(frameNo);
    console.log(this.token);
    this.imagePath = this.mediaService.fetchURL() + '/viewImage?token=' + this.token + '&imageNo=' + frameNo + '&detectionType=' + this.detectionType;
    console.log(this.imagePath);
  }


  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
