import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

interface Candle {
  date: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  quoteVolume: number;
  weightedAverage: number;
}

@Component({
  selector: 'app-dip',
  templateUrl: './dip.component.html',
})
export class DipComponent implements OnInit {

  @Input() ticker: string;
  dipPercent: number;
  probability: number;

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

  constructor() { }

  async refresh() {
    const url = this.queryUrl(this.ticker, 365);
    const data = await (await fetch(url)).json();

    const close = data[data.length - 1].close;
    this.dipPercent = this.getDipPercent(close, data);
    this.probability = this.getProbability(close, data);
  }

  getHigh(data: Candle[]): number {
    return Math.max(...data.map((item) => item.high));
  }

  getLow(data: Candle[]): number {
    return Math.min(...data.map((item) => item.low));
  }

  getDipPercent(close: number, data: Candle[]) {
    const high = this.getHigh(data);
    const low = this.getLow(data);
    const range = high - low;

    return (close - low) / range;
  }

  getProbability(close: number, data: Candle[]) {
    const isInRangeList = data.map((candle) => candle.high >= close);
    const countInRange = isInRangeList.reduce((result: number, isInRange: boolean) => {
      return isInRange ? result + 1 : result;
    }, 0);
    return countInRange / data.length;
  }

  ngOnInit(): void {
    this.refresh();
  }

}
