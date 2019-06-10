import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DipComponent } from './dip/dip.component';
import { ChartComponent } from './chart/chart.component';
import { DemoMaterialModule } from './material-module';


const appRoutes: Routes = [
  { path: ':ticker', component: ChartComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DipComponent,
    ChartComponent
  ],
  imports: [
    DemoMaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
