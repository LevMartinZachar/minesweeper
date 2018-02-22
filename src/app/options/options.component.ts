import {Component, OnInit} from '@angular/core';
import {Grid} from '../grid';
import {GameService} from '../game.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  time: number;
  score: number;
  grid: Grid;

  constructor(private gameService: GameService) {
    this.gameService.total_score.subscribe( total_score => {this.score = total_score; });
  }

  startNewGame(width, height, number_of_mines) {
    width = Number(width);
    height = Number(height);
    number_of_mines = Number(number_of_mines);
    this.grid = new Grid(width, height, number_of_mines);
    this.gameService.resetTime();
    this.gameService.total_score.next(number_of_mines);
    // this.score = this.gameService.getScore();
    // this.time = this.gameService.getTime();
    this.gameService.generateGrid(width, height, number_of_mines);
  }

  getTime(): void {
    this.gameService.incrementTime().subscribe(() => {
        // console.log('detecting getTime');
        this.time = this.gameService.getTime();
      }
    );
  }

  ngOnInit() {
    this.score = this.gameService.total_score.getValue();
    this.time = this.gameService.resetTime();
    this.getTime();
  }
}
