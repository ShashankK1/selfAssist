import { LayoutService } from './../../../@core/utils/layout.service';
import { HttpService } from './../../../Services/http.service';
import { Component, OnDestroy, OnInit, SimpleChanges, OnChanges, AfterViewInit, NgZone } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { CountryOrderData } from '../../../@core/data/country-order';

@Component({
  selector: 'ngx-country-orders',
  styleUrls: ['./country-orders.component.scss'],
  templateUrl:'./country-orders.component.html'
  // template: `
  //   <nb-card [size]="breakpoint.width >= breakpoints.md ? 'medium' : 'giant'">
  //     <nb-card-header>Country Covid Statistics</nb-card-header>
  //     <nb-card-body>
  //       <ngx-country-orders-map (select)="selectCountryById($event)"
  //                               [countryId]="countryIso">
  //       </ngx-country-orders-map>
  //       <div class="header">
  //         <span class="caption">Selected Country/Region</span>
  //         <h2 class="h4">{{ countryName }}</h2>
  //         <h6 *ngIf="chartReload">{{population}}</h6>
  //       </div>
  //       <!-- <ngx-country-orders-chart [countryName]="countryName"
  //                                 [data]="countryData"
  //                                 [labels]="countriesCategories"
                                  
  //                                 >
  //       </ngx-country-orders-chart> -->
  //     </nb-card-body>
  //   </nb-card>
  // `,
})
export class CountryOrdersComponent implements OnInit, OnDestroy {

  
  private alive = true;
  countryIso:string = 'IND';
 
  countryName = 'India';
  echartsInstance;
  riskRate:string;
  countryData: number[] = [];
  countriesCategories: string[]=['Deaths','Active Cases','Recovered','Total Cases'];
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  chartReload = true;

  constructor(private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private countryOrderService: CountryOrderData,
              private http:HttpService,
              private layoutService: LayoutService,
              private ngZone:NgZone
              ) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    
  }

  ngOnInit() {
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
      
    this.getCovid19Data('India','ind');
    // this.countryOrderService.getCountriesCategories()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe((countriesCategories) => {
        
    //     this.countriesCategories = countriesCategories;
    //   });
  }
  

  getCovid19Data(countryName,CountryIso){
    this.http.getSpecificCountryCovid19Data(countryName,CountryIso).subscribe((res)=>{
      this.countryData = [res[0]['TotalDeaths'],res[0]['ActiveCases'],res[0]['TotalRecovered'],res[0]['TotalCases']];
      
      this.ngZone.run(()=>{
        this.countryData = this.countryData;
        this.riskRate = res[0]['Infection_Risk'];
      })
    });

  }
  
  selectCountryById([countryName,countryIso]) {
    
    this.countryName = countryName;
    this.getCovid19Data(countryName,(countryIso).toLowerCase());
   
    // this.countryOrderService.getCountriesCategoriesData(countryName)
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe((countryData) => {
    //     //console.log(countryData)
    //     this.countryData = countryData;
    //   });
  }

  
  

  ngOnDestroy() {
    this.alive = false;
  }
}
