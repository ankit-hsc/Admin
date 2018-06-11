import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { MediaService } from '../../media.service';

declare var $: any;

@Component({
  selector: 'table-report',
  templateUrl: './childTable.html',
  styleUrls: ['./childTable.scss']
})
export class ChildTable implements OnInit {

  tableData: any;
  private frameData: any;
  private imagePath: string;
  private token: string;
  private detectionType: string;
  private timeStamp: any;
  imageArray = [];
  showTable: boolean = false;
  modalImage: string;
  isSingleClick: Boolean = true;
  showModal:boolean=false;
  private slideCounter: number = 4;
  constructor(private mediaService: MediaService, private router: Router) {
  }

  ngOnInit() {
    if (this.mediaService.getter() != undefined) {
      this.tableData = this.mediaService.getter();
      this.token = this.tableData.tokenNo;
      this.detectionType = this.tableData.detectionType;
      this.frameData = this.tableData.imageVOList;
      this.frameData.forEach(element => {
        let obj: any = {};
        obj.frameNo = element.frameNo;
        obj.frameTimeStamp = element.frameTimeStamp;
        obj.src = this.fetchFrame(element.frameNo);
        this.imageArray.push(obj);

        if (this.imageArray.length < 4) {
          $('#nextSlider').addClass('sliderHide');
          $('#prevSlider').addClass('sliderHide');
        }
        else {
          $('#prevSlider').addClass('sliderHide');
          $('#nextSlider').removeClass('sliderHide');
        }
      });
    }
    else {
      this.router.navigate(['/pages/media/upload']);
    }


  }

  fetchFrame(frameNo: number) {
    this.imagePath = this.mediaService.fetchURL() + '/viewImage?token=' + this.token + '&imageNo=' + frameNo + '&detectionType=' + this.detectionType;
    return this.imagePath;
  }

  toggleView() {
    this.showTable = !this.showTable;
  }



  prevSlide() {
    if (this.imageArray.length > 4) {
      this.slideCounter--;
      $('#nextSlider').removeClass('sliderHide');
      if (this.slideCounter == 4) {
        $('#prevSlider').addClass('sliderHide');
      }
    }

  }

  nextSlide() {
    if (this.imageArray.length > 4) {
      this.slideCounter++;
      $('#prevSlider').removeClass('sliderHide');
      if (this.imageArray.length == this.slideCounter) {
        $('#nextSlider').addClass('sliderHide');
      }
    }

  }


  imageModal(item, index) {
    this.isSingleClick = false;
    this.showModal=true;
    this.modalImage = item.src;
    $('#myModal').modal('show');  
    $('[data-toggle=modal]');
    console.log("double");
  }

  highlightTable(item, index) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        console.log("single");
        if (this.imageArray.length > 4 && index != undefined) {
          if (index > 3) {
            this.slideCounter = index + 1;
            $('#carouselExample').carousel(index - 3);
            $('#prevSlider').removeClass('sliderHide');
            $('#nextSlider').removeClass('sliderHide');
            if (this.imageArray.length == this.slideCounter) {
              $('#nextSlider').addClass('sliderHide');
            }
          }
          else {
            this.slideCounter = 4;
            $('#carouselExample').carousel(0);
            $('#prevSlider').addClass('sliderHide');
            $('#nextSlider').removeClass('sliderHide');
          }
        }

        let existingImg = $('.highlight');
        existingImg.removeClass('highlight');
        let activeImage = this.imageArray.filter((el) => {
          return el.frameTimeStamp == item.frameTimeStamp || el.frameTimeStamp == item.frameTimeStamp;
        });
        let x = $("img[src='" + activeImage[0].src + "']");
        x.parent().parent().parent().addClass('highlight');

        let selRow;
        let existing = $('.highlight-table');
        existing.removeClass('highlight-table');
        $('#infraction-table tr td').each(function () {
          let temp = $(this);
          if (temp.text() == item.frameTimeStamp || temp.text() == item.frameTimeStamp) {
            selRow = temp.parent();
          }
        });
        selRow.addClass('highlight-table');

        if (item.frameTimeStamp != undefined) {
          this.seekVideo(item.frameTimeStamp);
        }
      }
    }, 250)
  }



  seekVideo(time: string) {
  
    this.timeStamp = time;
    let frameTime = this.timeStamp.split(':');
    let startSecond = parseInt(frameTime[2]);
    let duration = 5;
    let vid: any = document.getElementById('video-tab');

    // if (startSecond < 3) {
    //   vid.currentTime = 0;
    //   duration = 5;
    // }
    // else {
    //   startSecond = startSecond - 3;
    //   vid.currentTime = startSecond;
    //   duration = 6;
    // }
    vid.currentTime = startSecond;
    vid.ontimeupdate = function () {
      if (vid.currentTime < startSecond + duration) {
        vid.play();
      }
      else {
        vid.pause();

      }
    };

  }
}
