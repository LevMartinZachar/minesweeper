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
  total_score: number;
  grid: Grid;
  exploded_mine: number;

  constructor(private gameService: GameService) {
    this.gameService.total_score.subscribe( total_score => {this.total_score = total_score; });
    this.gameService.exploded_mine.subscribe( exploded => {this.exploded_mine = exploded; });
  }

  startNewGame(width, height, number_of_mines) {
    width = Number(width);
    height = Number(height);
    number_of_mines = Number(number_of_mines);
    this.grid = new Grid(width, height, number_of_mines);
    this.gameService.resetTime();
    this.gameService.total_score.next(number_of_mines);
    this.gameService.generateGrid(width, height, number_of_mines);
  }

  getTime(): void {
    this.gameService.incrementTime().subscribe(() => {
        if (this.exploded_mine === undefined) {
          this.time = this.gameService.getTime();
        }
      }
    );
  }

  ngOnInit() {
    this.total_score = this.gameService.total_score.getValue();
    this.exploded_mine = this.gameService.exploded_mine.getValue();
    this.time = this.gameService.resetTime();
    this.getTime();
  }
}
