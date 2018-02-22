export class Cell {
  id: number;
  revealed: boolean;
  flag: boolean;
  number_of_nearby_mines: number;
  mine: boolean;
  output: string;

  constructor(id, revealed, flag, number_of_nearby_mines, mine, output) {
    this.id = id;
    this.revealed = revealed;
    this.flag = flag;
    this.number_of_nearby_mines = number_of_nearby_mines;
    this.mine = mine;
    this.output = output;
  }
}
