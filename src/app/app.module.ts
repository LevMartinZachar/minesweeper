import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { OptionsComponent } from './options/options.component';
import { GameService } from './game.service';


@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    OptionsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
