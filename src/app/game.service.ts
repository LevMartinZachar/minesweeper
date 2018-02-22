import { Injectable } from '@angular/core';
import { Cell } from './cell';
import { Observable } from 'rxjs/Observable';
import { Grid } from './grid';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class GameService {

  grid: Grid;
  cells: Cell[] = [];
  stack: number[] = [];
  total_score: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  counter: Observable<number>;
  time: number;
  number_of_revealed_cells: number;
  exploded_mine: number;

  constructor() { }

  getCells(): Cell[] {
    return this.cells;
  }

  resetTime(): number {
    return this.time = 0;
  }

  getTime(): number {
    return this.time;
  }

  incrementTime(): Observable<number> {
    this.counter = new Observable(observer => {
      setInterval(() => {
        observer.next();
      }, 1000);
    });

    this.counter.subscribe(() => { this.time++; });
    return this.counter;
  }

  generateGrid (grid_width, grid_height, grid_number_of_mines) {
    this.cells.length = 0;
    this.stack.length = 0;
    if (grid_width * grid_height < grid_number_of_mines) {
      grid_number_of_mines = grid_width * grid_height;
    }

    this.total_score.next(grid_number_of_mines);
    this.grid = new Grid(grid_width, grid_height, grid_number_of_mines);
    this.number_of_revealed_cells = 0;
    this.exploded_mine = undefined;

    for (let _i = 0; _i < grid_width * grid_height; _i++) {
      this.cells[_i] = new Cell(_i, false, false, 0, false, '');
    }

    this.plantMines(this.grid.width, this.grid.height, this.grid.number_of_mines);
    for (let _i = 0; _i < grid_width * grid_height; _i++) {
      if (this.cells[_i].mine) { continue; }
      // console.log('counting n o m at id: ' + _i);
      this.cells[_i].number_of_nearby_mines = this.computeNumberOfNearbyMines(_i);
    }
  }

  plantMines(grid_width, grid_height, grid_number_of_mines) {
    for (let _i = 0; _i < grid_number_of_mines; _i++) {
      const mine_cell = Math.floor(Math.random() * (grid_width * grid_height));
      if (this.cells[mine_cell].mine) {
        _i--;
        continue;
      }
      this.cells[mine_cell].mine = true;
    }
  }

  computeNumberOfNearbyMines (id: number) {
    let mines = 0;
    const x = Math.floor(id / this.grid.width);
    const y = id % this.grid.width;
    // Top Left Mine
    if (x - 1 >= 0 && y - 1 >= 0) {
      if (this.cells[id - this.grid.width - 1].mine) { mines++; }
    }
    // Top Mine
    if (x - 1 >= 0) {
      if (this.cells[id - this.grid.width].mine) { mines++; }
    }
    // Top Right Mine
    if (y + 1 < this.grid.width && x - 1 >= 0) {
      if (this.cells[id - this.grid.width + 1].mine) { mines++; }
    }
    // Right Mine
    if (y + 1 < this.grid.width) {
      if (this.cells[id + 1].mine) { mines++; }
    }
    // Bottom Right Mine
    if (x + 1 < this.grid.height && y + 1 < this.grid.width) {
      // console.log('cell ' + (id + this.grid.width + 1));
      if (this.cells[id + this.grid.width + 1].mine) { mines++; }
    }
    // Bottom Mine
    if (x + 1 < this.grid.height) {
      if (this.cells[id + this.grid.width].mine) { mines++; }
    }
    // Bottom Left Mine
    if (x + 1 < this.grid.height && y - 1 >= 0) {
      if (this.cells[id + this.grid.width - 1].mine) { mines++; }
    }
    // Left Mine
    if (y - 1 >= 0) {
      if (this.cells[id - 1].mine) { mines++; }
    }
    return mines;
  }

  revealCell(id: number) {
    if (this.cells[id].mine && !this.cells[id].flag) {
      this.cells[id].output = '☀';
      this.exploded_mine = id;
      this.revealAllMines();
    } else {
      if (this.cells[id].number_of_nearby_mines === 0 && !this.cells[id].revealed) {
        this.cells[id].revealed = true;
        this.number_of_revealed_cells++;
        this.revealArea(id);
      }
    }
    if (!this.cells[id].flag && !this.cells[id].revealed) { this.number_of_revealed_cells++; }
    this.cells[id].revealed = true;
    if (this.number_of_revealed_cells === this.grid.width * this.grid.height - this.grid.number_of_mines) {
      alert('You win!');
    }
    // console.log('revealed ', this.number_of_revealed_cells);
  }

  revealArea(id: number) {
    const x = Math.floor(id / this.grid.width);
    const y = id % this.grid.width;
    this.stack.push(id);
    // console.log('revealed ', this.number_of_revealed_cells);
    // Top Left Mine
    if (x - 1 >= 0 && y - 1 >= 0) {
      if (this.cells[id - this.grid.width - 1].number_of_nearby_mines && !this.cells[id - this.grid.width - 1].revealed) {
        this.cells[id - this.grid.width - 1].revealed = true;
        this.number_of_revealed_cells++;
      } else {
        if (!this.cells[id - this.grid.width - 1].revealed) {
          this.cells[id - this.grid.width - 1].revealed = true;
          this.number_of_revealed_cells++;
          return this.revealArea(id - this.grid.width - 1);
        }
      }
    }
    // Top Mine
    if (x - 1 >= 0) {
      if (this.cells[id - this.grid.width].number_of_nearby_mines && !this.cells[id - this.grid.width].revealed) {
        this.cells[id - this.grid.width].revealed = true;
        this.number_of_revealed_cells++;
      } else {
        if (!this.cells[id - this.grid.width].revealed) {
          this.cells[id - this.grid.width].revealed = true;
          this.number_of_revealed_cells++;
          return this.revealArea(id - this.grid.width);
        }
      }
    }
    // Top Right Mine
    if (y + 1 < this.grid.width && x - 1 >= 0) {
      if (this.cells[id - this.grid.width + 1].number_of_nearby_mines && !this.cells[id - this.grid.width + 1].revealed) {
        this.cells[id - this.grid.width + 1].revealed = true;
        this.number_of_revealed_cells++;
      } else {
        if (!this.cells[id - this.grid.width + 1].revealed) {
          this.cells[id - this.grid.width + 1].revealed = true;
          this.number_of_revealed_cells++;
          return this.revealArea(id - this.grid.width + 1);
        }
      }
    }
// Right Mine
    if (y + 1 < this.grid.width) {
      if (this.cells[id + 1].number_of_nearby_mines && !this.cells[id + 1].revealed) {
        this.cells[id + 1].revealed = true;
        this.number_of_revealed_cells++;
      } else {
        if (!this.cells[id + 1].revealed) {
          this.cells[id + 1].revealed = true;
          this.number_of_revealed_cells++;
          return this.revealArea(id + 1);
        }
      }
    }
// Bottom Right Mine
    if (x + 1 < this.grid.height && y + 1 < this.grid.width) {
      if (this.cells[id + this.grid.width + 1].number_of_nearby_mines && !this.cells[id + this.grid.width + 1].revealed) {
        this.cells[id + this.grid.width + 1].revealed = true;
        this.number_of_revealed_cells++;
      } else {
        if (!this.cells[id + this.grid.width + 1].revealed) {
          this.cells[id + this.grid.width + 1].revealed = true;
          this.number_of_revealed_cells++;
          return this.revealArea(id + this.grid.width + 1);
        }
      }
    }
// Bottom Mine
    if (x + 1 < this.grid.height) {
      if (this.cells[id + this.grid.width].number_of_nearby_mines && !this.cells[id + this.grid.width].revealed) {
        this.cells[id + this.grid.width].revealed = true;
        this.number_of_revealed_cells++;
      } else {
        if (!this.cells[id + this.grid.width].revealed) {
          this.cells[id + this.grid.width].revealed = true;
          this.number_of_revealed_cells++;
          return this.revealArea(id + this.grid.width);
        }
      }
    }
// Bottom Left Mine
    if (x + 1 < this.grid.height && y - 1 >= 0) {
      if (this.cells[id + this.grid.width - 1].number_of_nearby_mines && !this.cells[id + this.grid.width - 1].revealed) {
        this.cells[id + this.grid.width - 1].revealed = true;
        this.number_of_revealed_cells++;
      } else {
        if (!this.cells[id + this.grid.width - 1].revealed) {
          this.cells[id + this.grid.width - 1].revealed = true;
          this.number_of_revealed_cells++;
          return this.revealArea(id + this.grid.width - 1);
        }
      }
    }
// Left Mine
    if (y - 1 >= 0) {
      if (this.cells[id - 1].number_of_nearby_mines  && !this.cells[id - 1].revealed) {
        this.cells[id - 1].revealed = true;
        this.number_of_revealed_cells++;
      } else {
        if (!this.cells[id - 1].revealed) {
          this.cells[id - 1].revealed = true;
          this.number_of_revealed_cells++;
          return this.revealArea(id - 1);
        }
      }
    }
    if(this.number_of_revealed_cells === this.grid.width * this.grid.height - this.grid.number_of_mines) {
      alert('You win!');
    }
    if (this.stack.length < 2) {
      return;
    }
    this.stack.pop();
    this.revealArea(this.stack.pop());
  }

  revealAllMines() {
    for (let _i = 0; _i < this.grid.width * this.grid.height; _i++) {
      if (this.cells[_i].mine) { this.cells[_i].revealed = true; this.cells[_i].output = '☀'; }
    }
    alert('You lose.');
  }

  showId(id: number) {
    if (this.cells[id].revealed) {
      if (this.cells[id].flag) {
        this.cells[id].output = '⛳';
        return 'red';
      }
      if (this.cells[id].mine) {
        this.cells[id].output = '☀';
      } else {
        if (this.cells[id].number_of_nearby_mines) {this.cells[id].output = this.cells[id].number_of_nearby_mines.toString(); }
        switch (this.cells[id].number_of_nearby_mines) {
          case 0: {
            break;
          }
          case 1: {
            this.cells[id].output = this.cells[id].number_of_nearby_mines.toString(); return 'blue';
          }
          case 2: {
            this.cells[id].output = this.cells[id].number_of_nearby_mines.toString(); return 'green';
          }
          case 3: {
            this.cells[id].output = this.cells[id].number_of_nearby_mines.toString(); return 'red';
          }
          case 4: {
            this.cells[id].output = this.cells[id].number_of_nearby_mines.toString(); return 'darkblue';
          }
          case 5: {
            this.cells[id].output = this.cells[id].number_of_nearby_mines.toString(); return 'brown';
          }
          case 6: {
            this.cells[id].output = this.cells[id].number_of_nearby_mines.toString(); return 'darkcyan';
          }
          case 7: {
            this.cells[id].output = this.cells[id].number_of_nearby_mines.toString(); return 'black';
          }
          case 8: {
            this.cells[id].output = this.cells[id].number_of_nearby_mines.toString(); return 'grey';
          }
        }
      }
    } else {
      this.cells[id].output = '';
    }
  }

  toggleFlag(id: number) {
    if (!this.cells[id].revealed) {
      this.cells[id].revealed = true;
      this.cells[id].flag = true;
      this.total_score.next(this.total_score.getValue() - 1);
    } else {
      if (this.cells[id].flag) {
        this.cells[id].revealed = false;
        this.cells[id].flag = false;
        this.total_score.next(this.total_score.getValue() + 1);
      }
    }
  }

  setBackground(id: number) {
    if (this.cells[id].revealed && id === this.exploded_mine) { return 'red'; }
    if (this.cells[id].revealed && this.cells[id].output !== '⛳') { return 'linear-gradient(to bottom right, darkgray, lightgray)'; }
  }

  setGridWidth() {
    // console.log('setting grid width ' + this.grid.width * 20 + 'px');
    return this.grid.width * 20 + 'px';
  }
}
