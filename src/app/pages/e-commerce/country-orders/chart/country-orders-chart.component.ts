import { HttpService } from './../../../../Services/http.service';
import { CountryOrdersMapService } from './../map/country-orders-map.service';
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { LayoutService } from '../../../../@core/utils/layout.service';


@Component({
  selector: 'ngx-country-orders-chart',
  styleUrls: ['./country-orders-chart.component.scss'],
  template: `
    <div class="header">
      <span class="caption">Selected Country/Region</span>
      <h2 class="h4">{{ countryName }}<span class="h6">(Infection Risk : {{riskRate}})</span></h2>
    </div>
    <div echarts
         
         [options]="option"
         class="echart"
         (chartInit)="onChartInit($event)"
         >
    </div>
  `,
})
export class CountryOrdersChartComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() countryName: string;
  @Input() maxValue: number;
  @Input() labels: string[];
  @Input() riskRate:string;
  @Input() data:string[];
  private alive = true;
  option: any = {};
  echartsInstance;
  

  constructor(private theme: NbThemeService,
              private layoutService: LayoutService,
              private mapService:CountryOrdersMapService,
              private http:HttpService) {
                
    this.layoutService.onSafeChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());

  }

  
  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes.data && !changes.data.isFirstChange()) {
      this.echartsInstance.setOption({
        series: [
          {
            data:this.data
          },
          {
            data:this.data
          },
          {
            data: this.data,
          },
        ],
      });
      
    }
    
    
  }


  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        const countriesTheme: any = config.variables.countryOrders;

        this.option = Object.assign({}, {
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            top: '3%',
            containLabel: true,
          },
          xAxis: {
            axisLabel: {
              color: countriesTheme.chartAxisTextColor,
              fontSize: 1,
            },
            axisLine: {
              lineStyle: {
                color: countriesTheme.chartAxisLineColor,
                width: '2',
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: countriesTheme.chartAxisSplitLine,
                width: '1',
              },
            },
          },
          yAxis: {
            data: this.labels,
            axisLabel: {
              color: countriesTheme.chartAxisTextColor,
              fontSize: countriesTheme.chartAxisFontSize,
            },
            axisLine: {
              lineStyle: {
                color: countriesTheme.chartAxisLineColor,
                width: '2',
              },
            },
            axisTick: {
              show: false,
            },
          },
          series: [
            { // For shadow
              type: 'bar',
              cursor: 'default',
              data:this.data,
              itemStyle: {
                normal: {
                  color: countriesTheme.chartInnerLineColor,
                },
                opacity: 1,
              },
              barWidth: '40%',
              barGap: '-100%',
              barCategoryGap: '30%',
              animation: false,
              z: 1,
            },
            { // For bottom line
              type: 'bar',
              cursor: 'default',
              data:this.data,
              itemStyle: {
                normal: {
                  color: countriesTheme.chartLineBottomShadowColor,
                },
                opacity: 1,
              },
              barWidth: '40%',
              barGap: '-100%',
              barCategoryGap: '30%',
              z: 2,
            },
            {
              type: 'bar',
              
              barWidth: '35%',
              data: this.data,
              cursor: 'default',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                    offset: 0,
                    color: countriesTheme.chartGradientFrom,
                  }, {
                    offset: 1,
                    color: countriesTheme.chartGradientTo,
                  }]),
                },
              },
              z: 3,
            },
          ],
        });
      });
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  

  resizeChart() {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

 

}
