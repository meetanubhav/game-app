import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-rps-game',
  templateUrl: './rps-game.component.html',
  styleUrls: ['./rps-game.component.css']
})
export class RpsGameComponent implements OnInit {

  player1Choice : number = -1;
  player2Choice : number = -1;
  scoreBoard : any[] = [0,0];
  loading: boolean = false;
  isResultShow : boolean = false;
  resultMessage : string = "";
  // 0 : rock 
  // 1 : paper
  // 2 : scissor
  constructor(private snackBar : MatSnackBar) { }

  ngOnInit() {
      this.snackBar.open("Welcome to Rock Paper Scissor","",{duration : 2000});  
  }
  move(userPick : number){
    if(this.loading) return;
    this.loading = true;
    this.player1Choice = userPick;
    setTimeout( () => {
      this.loading = false;
      // generate a number from 0 -2 
      const randomNum =  Math.floor(Math.random() * 3 ) ;
      this.player2Choice = randomNum;
      this.checkResult();
      this.isResultShow = true;
    },  Math.floor(Math.random()  * 500 ) +200); 
  }
  checkResult() : void{
    const playerPick = this.player1Choice;
    const enemyPick = this.player2Choice;
    //Tie
    if( playerPick ===  enemyPick)
      {
      this.resultMessage = "It's a tie!";
    }
    // Player 1 win
    else if((playerPick - enemyPick + 3) % 3 === 1){
      this.scoreBoard[0]+=1;
      this.resultMessage = "You're the winner!";
    }
    // Player 2 win
    else{
      this.scoreBoard[1]+=1;
      this.resultMessage = "You lose.";
    }
  }
  reset(): void {
    this.scoreBoard = [0,0];
    this.player1Choice = this.player2Choice = -1 ;
    this.loading = false;
    this.isResultShow = false;
    this.snackBar.open("New game! Good Luck","",{duration : 1000});
  }
}