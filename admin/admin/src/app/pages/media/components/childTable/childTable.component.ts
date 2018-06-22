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
  showTable: boolean;
  showGraph: boolean;
  private slideCounter: number = 4;
  modalImage: string;
  isSingleClick: Boolean = true;
  showModal: boolean = false;
  showColumn: boolean = false;
  chart:any;
  chartData:any;

  constructor(private mediaService: MediaService, private router: Router) {
  }

  ngOnInit() {
 
    $(window).resize(function() {
      $('#carouselExample').css({"max-height":"initial", "overflow": "hidden"});
      let height= $('#carouselExample').height()+"px";
      $('#carouselExample').css({"max-height":height, "overflow": "hidden"});
    });
   
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
      });
      if (this.imageArray.length <= 4) {
        $('#nextSlider').addClass('sliderHide');
        $('#prevSlider').addClass('sliderHide');
      } else {
        $('#prevSlider').addClass('sliderHide');
        $('#nextSlider').removeClass('sliderHide');
      }
      if (this.detectionType == 'Traffic Density Analysis') {
        this.showTable = false;
        this.loadGraph();
      
      }
      else {
        
        if (this.detectionType == 'License Plate Recognition') {
          this.showColumn = true;     
          }
          this.showTable = true;
      }
    }
    else {
      this.router.navigate(['/pages/media/upload']);
    }
  }

  loadGraph() {
    let globalThis=this;
    this.chartData = generateChartData(this.frameData);
     this.chart = AmCharts.makeChart("chartdiv", {
      "type": "serial",
      "theme": "light",
      "backgroundColor": "red",
      "dataProvider": this.chartData,
      "valueAxes": [{
        "position": "left",
        "title": "Vehicle count"
      }],
      "graphs": [{
        "id": "g1",
        "fillColors": "#204640",
        "fillAlphas": 0.4,
        "valueField": "counts",
        "balloonText": "<div style='margin:5px; font-size:19px;'>Counts:<b>[[value]]</b></div>",
        "lineThickness": 1,

      }],
      "chartScrollbar": {
        "graph": "g1",
        "scrollbarHeight": 50,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.4,
        "selectedBackgroundColor": "green",
        "graphFillAlpha": 0.1,
        "graphLineAlpha": 1,
        "selectedGraphFillAlpha": 0.5,
        "selectedGraphLineAlpha": 1,
        "autoGridCount": true,
        "color": "#000"
      },
      "chartCursor": {

        "categoryBalloonDateFormat": "JJ:NN:SS",
        "cursorPosition": "mouse"
      },
      "categoryField": "date",
      "categoryAxis": {
        "title": "Video Timestamp",
        "minPeriod": "ss",
        "parseDates": true
      },
      "export": {
        "enabled": false,

      },
      "listeners": [{
        "event": "clickGraph",
        "method": function(e) {
          let obj: any = {};
          let frameDate=e.target.currentDataItem.category;
          obj.frameTimeStamp=(frameDate.getHours()<10?'0':'')+frameDate.getHours()+':'+(frameDate.getMinutes()<10?'0':'')+frameDate.getMinutes()+':'+(frameDate.getSeconds()<10?'0':'')+frameDate.getSeconds();
          let index = globalThis.chartData.findIndex(x => x.date+''==frameDate);
          globalThis.highlightTable(obj,index);
        }
      }]
    
    });

    this.chart.addListener("dataUpdated", zoomChart);    
    zoomChart();    
    function zoomChart() {      
      this.chart.zoomToIndexes(this.chartData.length - 250, this.chartData.length - 100);
    }   
    this.chart.addListener("clickGraph", graphClicked);

    function graphClicked(e) {
        alert(e.graph.title);
    }
    function generateChartData(frameData) {
      var chartData = [];

      frameData.forEach(data => {
        let frameTime = data.frameTimeStamp.split(':');
        var graphDate = new Date();
        graphDate.setHours(frameTime[0]);
        graphDate.setMinutes(frameTime[1]);
        graphDate.setSeconds(frameTime[2]);
        chartData.push({
          date: graphDate,
          counts: data.framesList.length,
        });
      })
         return chartData;
    }
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

  fetchFrame(frameNo: number) {
    this.imagePath = this.mediaService.fetchURL() + '/viewImage?token=' + this.token + '&imageNo=' + frameNo + '&detectionType=' + this.detectionType;
    return this.imagePath;
  }




  imageModal(item, index) {
    this.isSingleClick = false;
    this.showModal = true;
    this.modalImage = item.src;
    $('#myModal').modal('show');
    $('[data-toggle=modal]');
    console.log("double");
  }

  highlightTable(item, index) { 
    $('#carouselExample').css({"max-height":"initial", "overflow": "hidden"});
    let height= $('#carouselExample').height()+"px";
    $('#carouselExample').css({"max-height":height, "overflow": "hidden"});
     
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
       
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

        if (this.detectionType != 'Traffic Density Analysis') {
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
        }
        else {
          let frameTime = item.frameTimeStamp.split(':');
          var graphDate = new Date();
          graphDate.setHours(frameTime[0]);
          graphDate.setMinutes(frameTime[1]);
          graphDate.setSeconds(frameTime[2]);          
          this.chart.chartCursor.showCursorAt(graphDate);     
         
        }
        if (item.frameTimeStamp != undefined) {
          this.seekVideo(item.frameTimeStamp);
        }
      }
    }, 250)
  }



  seekVideo(time: string) {
    let video_duration = document.querySelector('video').duration;
    this.timeStamp = time;
    let frameTime = this.timeStamp.split(':');
    let startSecond = (parseInt(frameTime[0])*60)+(parseInt(frameTime[1])*60)+parseInt(frameTime[2]);
    let duration = 5;
    let vid: any = document.getElementById('video-tab');
    console.log(vid);
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
        // vid.play();
      }
      else {
        vid.pause();
        // vid.currentTime = startSecond;      
      }
    };

  }
}
