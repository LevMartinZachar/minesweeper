export class Grid {
  width: number;
  height: number;
  number_of_mines: number;

  constructor(width, height, number_of_mines) {
    this.width = width;
    this.height = height;
    this.number_of_mines = number_of_mines;
  }
}
