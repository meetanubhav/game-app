import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RpsGameComponent } from './rps-game/rps-game.component';
import { TttGameComponent } from './ttt-game/ttt-game.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rock-paper-scissor', component: RpsGameComponent },
  { path: 'tic-tac-toe', component: TttGameComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
