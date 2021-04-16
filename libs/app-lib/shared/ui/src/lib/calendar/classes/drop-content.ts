/*
  Class to support drag-and-drop: defines structure of "dataTransfered" object
 */
export class DropContent {
  context : string;
  payload : Object;
  elementClass : string;

  constructor(context: string, payload: Object, elementClass?: string) {
    this.context = context;
    this.payload = payload;
    this.elementClass = elementClass;
  }
}
