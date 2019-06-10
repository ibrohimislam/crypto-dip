import { Component, OnInit, OnDestroy, ElementRef, ViewChildren, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { createChart, UTCTimestamp, PriceScaleMode, IChartApi, ISeriesApi } from 'lightweight-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements OnDestroy, AfterViewInit {

  ticker: string;
  private routeSub: Subscription;

  @ViewChild('container', { static: false })
  container: ElementRef;

  chart: IChartApi;
  series: ISeriesApi<'Candle'>;

  constructor(private route: ActivatedRoute) { }

  private queryUrl(
    ticker: string,
    days: number): string {

    const end = Math.floor(Date.now() / 1000);
    const start = end - (86400 * days);

    return `https://poloniex.com/public?` +
      `command=returnChartData&` +
      `currencyPair=${ticker}&` +
      `start=${start}&` +
      `end=${end}&` +
      `period=86400`;
  }

  ngAfterViewInit() {
    this.routeSub = this.route.params.subscribe((params) => this.refresh(params.ticker));

    this.chart = createChart(this.container.nativeElement);
    this.chart.applyOptions({
      height: 300,
      priceScale: {
        mode: PriceScaleMode.Normal,
      },
    });
    this.series = this.chart.addCandleSeries();
  }

  async refresh(ticker: string) {
    const url = this.queryUrl(ticker, 365);
    const data = await (await fetch(url)).json();
    const seriesData = data.map((item) => {
      console.log(item.time);
      return {
        time: parseInt(item.date, 10),
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
      };
    });

    this.series.setData(seriesData);

  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
