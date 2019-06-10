import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

interface Ticker {
  id: number;
  name: string;
  last: number;
  lowestAsk: number;
  highestBid: number;
  percentChange: number;
  baseVolume: number;
  quoteVolume: number;
  isFrozen: number;
  high24hr: number;
  low24hr: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {

  @ViewChild(MatSidenav, { static: false }) sidenav: MatSidenav;

  title = 'crypto-dip';
  tickers: Array<Ticker> = [];

  async getTickers() {
    const response = await (await fetch('https://poloniex.com/public?command=returnTicker')).json();
    const tickers: Array<Ticker> = [];

    for (const [tickerName, tickerData] of Object.entries(response)) {
      const ticker: Ticker = { ...tickerData } as Ticker;
      ticker.name = tickerName;
      tickers.push(ticker);
    }

    tickers.sort((a, b) => a.name.localeCompare(b.name));

    this.tickers = tickers;
  }

  async ngAfterViewInit() {
    await this.getTickers();
  }
}
