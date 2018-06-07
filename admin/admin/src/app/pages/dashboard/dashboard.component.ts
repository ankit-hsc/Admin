import {Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import{DashboardService} from './dashboard.service';
@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard {
private userCount:number;
private videoCount:number;
  constructor(private router:Router,private dashboardService:DashboardService) {

  }

  ngOnInit() {

    this.dashboardService.getWidgetCount().subscribe(
      (data) => {
        console.log(data);
        this.userCount=data.userCount;
        this.videoCount=data.reportCount;
      }, (error) => {
        console.log(error);
      });

  }
  navigateTOReports(){
    this.router.navigate(['/pages/reports']);
  }
}
