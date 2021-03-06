import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button'
import { RpsGameComponent } from './rps-game/rps-game.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { HomeComponent } from './home/home.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TttGameComponent } from './ttt-game/ttt-game.component';
import {MatChipsModule} from '@angular/material/chips';
@NgModule({
   declarations: [
      AppComponent,
      RpsGameComponent,
      TopBarComponent,
      HomeComponent,
      TttGameComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      NoopAnimationsModule,
      MatToolbarModule,
      MatCardModule,
      MatProgressSpinnerModule,
      MatIconModule,
      MatButtonModule,
      MatGridListModule,
      MatSnackBarModule,
      MatChipsModule,
      RouterModule.forRoot([
         { path : "" , component : HomeComponent},
         { path : "rock-paper-scissor" , component : RpsGameComponent},
         { path : "tic-tac-toe" , component : TttGameComponent}
      ])
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
