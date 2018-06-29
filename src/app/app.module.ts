import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/app/app.component';
import { GameComponent } from './components/game/game.component';
import { SizerDirective } from './directives/sizer/sizer.directive';
import Helper from './utils/helper';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    SizerDirective,
  ],
  imports: [
    BrowserModule
  ],
  providers: [{
    provide:Helper, useClass:Helper
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
