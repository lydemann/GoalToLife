/*
  Class to support drag-and-drop: defines structure of "dataTransfered" object
 */
export class DropContent<T = object> {
  context: string;
  payload: T;
  elementClass: string;

  constructor(context: string, payload: T, elementClass?: string) {
    this.context = context;
    this.payload = payload;
    this.elementClass = elementClass;
  }
}
