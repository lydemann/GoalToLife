/*
 * Class to describe our TODOItem
 */
export class TODOItem {
  day : Date;
  text: string;
  createdOn: Date;
  id: number;
  orderInDay : number;

  constructor(day: Date, text: string, createdOn: Date) {
    this.day = day;
    this.text = text;
    this.createdOn = createdOn;
  }
}
