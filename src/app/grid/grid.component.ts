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

  constructor(private gameService: GameService) {
    this.gameService.generateGrid(8, 6, 8);
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
    this.gameService.toggleFlag(id);
  }

  revealCell(id: number) {
    this.gameService.revealCell(id);
  }

  ngOnInit() {
    this.cells = this.gameService.getCells();
  }
}
