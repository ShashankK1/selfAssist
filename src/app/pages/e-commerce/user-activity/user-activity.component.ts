import { HttpService } from './../../../Services/http.service';
import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import { UserActivityData, UserActive } from '../../../@core/data/user-activity';

@Component({
  selector: 'ngx-user-activity',
  styleUrls: ['./user-activity.component.scss'],
  templateUrl: './user-activity.component.html',
})
export class ECommerceUserActivityComponent implements OnInit,OnDestroy {

  private alive = true;

  userActivity: UserActive[] = [];
  type = '1';
  types = ['week', 'month', 'year'];
  pageNumber = [1,2,3,4,5];
  pageStart = 1;
  currentTheme: string;
  
  news:{
    date:Date,
    titles:string,
    url:string
  }[] = [];
 

  constructor(private themeService: NbThemeService,
              private userActivityService: UserActivityData,
              private http:HttpService,
              private ngZone:NgZone) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });

    this.getUserActivity(this.type);
  }

  ngOnInit(): void {
  }


  getUserActivity(period) {
    period = period.toString();
    this.getCovidNews(period);
    // this.userActivityService.getUserActivityData(period)
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe(userActivityData => {
    //     this.userActivity = userActivityData;
    //   });
  }

  getCovidNews(pageNumber:string){
    this.news = [];
    this.http.getCovidNews(pageNumber).subscribe((res:any)=>{
      let data:any[] = res['news'];
      
      data.map((x)=>{
          this.news.push({date:x['pubDate'],titles:x['title'],url:x['link']});
      });
      
    })
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
