import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ttt-game',
  templateUrl: './ttt-game.component.html',
  styleUrls: ['./ttt-game.component.css']
})
export class TttGameComponent implements OnInit {

  boardValues : any[] = [0,0,0,0,0,0,0,0,0]
  scoreBoard : any[] = [ 0 , 0]
  gameStart : boolean = true;
  player : string = " Your ";
  myicon : any[] = ["","","","","","","","",""];
  isGameOver : boolean = false;
  prev : number = 0;
  checkTurn : boolean = true;

  constructor(private snackBar : MatSnackBar) { }

  ngOnInit() {
  }
  move(index : number){
    if(this.boardValues[index]!==0){
      this.snackbarMessage("This move is already made",1000);
    }
    else if(!this.checkTurn){
      this.snackbarMessage("Wait for AI's move",2000);
    }
    else{
      this.checkTurn = false;
      this.boardValues[index]=1;
      this.myicon[index]="clear";
      // AI move
      this.player = " AI's ";
      setTimeout(() =>{
      // this.AImove()
      const calvalue = (index+this.prev)%9;
      this.checkTurn = true;
      console.log(calvalue);
      if(this.boardValues[calvalue]!='1' && this.boardValues[calvalue]!='5' && this.isGameOver == false){
        this.boardValues[calvalue]=5;
        this.myicon[calvalue]="radio_button_unchecked";
      }
      else{
        this.AImove();
      }
    }
      , 2000);
      this.checkResult();
      this.prev = index;
    }
  }

  AImove() : void{
    this.player = " Your ";
    const randomNum : number =  Math.floor(Math.random() * 9 );
    if(this.boardValues[randomNum]==0){
      this.boardValues[randomNum]=5;
      this.myicon[randomNum]="radio_button_unchecked";
    }
    else{
      this.AImove();
    }
  }

  checkResult() :void {
    if( 
      (this.boardValues[0]+this.boardValues[1]+this.boardValues[2])==3 || 
      (this.boardValues[3]+this.boardValues[4]+this.boardValues[5])==3 || 
      (this.boardValues[6]+this.boardValues[7]+this.boardValues[8])==3 || 
      (this.boardValues[0]+this.boardValues[3]+this.boardValues[6])==3 || 
      (this.boardValues[1]+this.boardValues[4]+this.boardValues[7])==3 || 
      (this.boardValues[2]+this.boardValues[5]+this.boardValues[8])==3 || 
      (this.boardValues[0]+this.boardValues[4]+this.boardValues[8])==3 || 
      (this.boardValues[2]+this.boardValues[4]+this.boardValues[6])==3 
     ){
      this.gameOverAction(0,"Game Over you win");
     }
     else if(
      (this.boardValues[0]+this.boardValues[1]+this.boardValues[2])==15 || 
      (this.boardValues[3]+this.boardValues[4]+this.boardValues[5])==15 || 
      (this.boardValues[6]+this.boardValues[7]+this.boardValues[8])==15 || 
      (this.boardValues[0]+this.boardValues[3]+this.boardValues[6])==15 || 
      (this.boardValues[1]+this.boardValues[4]+this.boardValues[7])==15 || 
      (this.boardValues[2]+this.boardValues[5]+this.boardValues[8])==15 || 
      (this.boardValues[0]+this.boardValues[4]+this.boardValues[8])==15 || 
      (this.boardValues[2]+this.boardValues[4]+this.boardValues[6])==15 
     ){
      this.gameOverAction(1,"Game Over AI wins");
     }
     else if( this.boardValues[0] !==0 && this.boardValues[1] !==0 && this.boardValues[2] !==0 && 
      this.boardValues[3] !==0 && this.boardValues[4] !==0 && this.boardValues[5] !==0 && 
      this.boardValues[6] !==0 && this.boardValues[7] !==0 && this.boardValues[8] !== 0 ){
       this.snackbarMessage("No one wins",2000);
       this.isGameOver = true;
     }
  }

  snackbarMessage(text1 : string,duration : number){
    this.snackBar.open(text1,"",{duration : duration});
  }
  gameOverAction(score:number,message : string){
    this.isGameOver = true;
    this.scoreBoard[score]+=1;
    this.snackbarMessage(message,5000);
  }
  reset(){
    this.boardValues  = [0,0,0,0,0,0,0,0,0]
    this.gameStart = true;
    this.player  = " Your ";
    this.myicon  = ["","","","","","","","",""];
    this.isGameOver = false;
    this.prev  = 0;
  }

}
