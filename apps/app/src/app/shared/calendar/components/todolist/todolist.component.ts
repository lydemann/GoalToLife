import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Goal } from '@app/shared/interfaces';

import { Error } from 'tslint/lib/error';

import { TODOItem } from '../../classes/todo-item';
import { TODOService } from '../../services/todo.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['todolist.component.scss'],
  providers: [TODOService],
})
export class TODOListComponent implements OnInit, OnChanges {
  /*
   * PRIVATE variables
   * list of TODOs in day
   * date of day to CRUD TODOs
   * draggable property
   */
  // private _todos: TODOItem[];
  private _dayDate: Date;
  private _draggable: boolean;

  /*
   * Getters, setters and inputs
   */

  @Input() goals: Goal[] = [];
  @Input() refreshRequired: Date = null;
  @Input() editable: boolean = true;
  @Input() droppedTodo: TODOItem;

  // set todos(todos: TODOItem[]) {
  //   this._todos = todos;
  // }

  // get todos() {
  //   return this._todos;
  // }

  get dayDate(): Date {
    return this._dayDate;
  }

  @Input() set dayDate(value: Date) {
    this._dayDate = value;
  }

  get draggable(): boolean {
    return this._draggable;
  }

  set draggable(value: boolean) {
    this._draggable = value;
  }

  /*
   * PUBLIC VARIABLES to manage interaction and render UI
   */

  todoText: string;
  todoDOMClass: string = 'todoItemClass';

  /*
   * Output: emitting true if list of TODOs changed
   */
  @Output('onTodoListChange')
  listChanged: EventEmitter<Boolean> = new EventEmitter();

  /*
   * CONSTRUCTOR
   * TODOService for CRUD operations is injected
   */
  constructor(private todoService: TODOService) {}

  /*
   * Various checks
   */
  isEditable(): boolean {
    return this.editable;
  }

  isDraggable(): boolean {
    return this.draggable;
  }

  // method to get TODO list
  getTODOList () : void {
    // this.todoService.getList(this._dayDate).then(todos => {
      // this.goals = todos;
      this.listChanged.emit(true);
    // });
  }

  // method to add TODO into list
  addTODO(event): void {

    // TODO: check if valid, using require validator

    // addGoal event with goal

    // item with empty text is not allowed for submission
    let emptyTodoException: Error;
    try {
      event.preventDefault();
      // checking whether text conforms emptiness requirement
      if (this.todoText.replace(/\s/g, '') === '') {
        throw emptyTodoException;
      }
      // building new TODOItem object
      let todo = new TODOItem(this._dayDate, this.todoText, new Date());

      // clearing form
      this.todoText = '';

      // calling TODOService to store new TODO
      this.todoService.addToList(todo);
    } catch (emptyTodoException) {
      return;
    }

    // done
  }

  // method to remove TODO from list
  deleteTODO(todo: TODOItem): void {
    // calling TODOService to remove TODO
    this.todoService.deleteFromList(todo).then(() => this.getTODOList());
    return;
  }

  // handling drag-and-drop's drop event to store TODO
  onDrop(event: any, data?: any): void {
    // target is day (generally)
    if (data == undefined) {
      // if drop into empty space in day, then - update date and put the item into beginning of the list
      this.todoService
        .changeTodoDate(event, this._dayDate)
        .then(() => this.getTODOList());
    } else {
      // if another event is target, then put new event above targeted one
      // made for future use, can be activated with adding makeDroppable directive
      // to list element: makeDroppable [dropContext]="{context: 'list'}" (dropped)="onDrop($event, todo)"
      this.todoService
        .putAbove(event.payload, data)
        .then(() => this.getTODOList());
    }
  }

  // initializing list
  ngOnInit(): void {
  }

  // listening on incoming changes to handle "drop" and "refresh" of other components
  ngOnChanges(changes: any): void {
    this._draggable = !this.editable;
    this.getTODOList();

    if (changes.hasOwnProperty('droppedTodo')) {
      if (changes.droppedTodo.currentValue !== undefined) {
        this.onDrop(changes.droppedTodo.currentValue);
      }
    } else {
      this.getTODOList();
    }
  }
}
