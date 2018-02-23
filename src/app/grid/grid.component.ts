import { Component, OnInit } from '@angular/core';
import {GameService} from '../game.service';
import {Cell} from '../cell';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {
  cells: Cell[] = [];
  exploded_mine: number;

  constructor(private gameService: GameService) {
    this.gameService.generateGrid(30, 16, 100);
    this.gameService.exploded_mine.subscribe( exploded => {this.exploded_mine = exploded; });
  }

  setGridWidth() {
    return this.gameService.setGridWidth();
  }

  setBackground(id: number) {
    return this.gameService.setBackground(id);
  }

  showId(id: number) {
    return this.gameService.showId(id);
  }

  toggleFlag(id: number) {
    if (this.exploded_mine === undefined) {
      this.gameService.toggleFlag(id);
    }
  }

  revealCell(id: number) {
    if (this.exploded_mine === undefined) {
      this.gameService.revealCell(id);
    }
  }

  ngOnInit() {
    this.cells = this.gameService.getCells();
    this.exploded_mine = this.gameService.exploded_mine.getValue();
  }
}
