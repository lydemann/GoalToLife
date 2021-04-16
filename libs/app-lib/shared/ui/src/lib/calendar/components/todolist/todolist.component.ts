import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Goal, GoalPeriodType } from '@app/shared/interfaces';

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
  @Output() addTodo = new EventEmitter<Goal>();
  @Output() deleteTodo = new EventEmitter<Goal>();
  todoTextControl: FormControl;

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

  todoDOMClass: string = 'todoItemClass';

  /*
   * Output: emitting true if list of TODOs changed
   */
  @Output('onTodoListChange')
  listChanged: EventEmitter<Boolean> = new EventEmitter();

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
  onAddTODO(event: Event): void {
    event.preventDefault();

    // TODO: check if valid, using require validator
    if(this.todoTextControl.invalid) {
      return;
    }

    this.addTodo.emit({name: this.todoTextControl.value} as Goal)
  }

  // method to remove TODO from list
  onDeleteTODO(goal: Goal): void {
    this.deleteTodo.next(goal)
    return;
  }

  // handling drag-and-drop's drop event to store TODO
  onDrop(event: any, data?: any): void {
    // target is day (generally)
    if (data == undefined) {
      // if drop into empty space in day, then - update date and put the item into beginning of the list
      // this.todoService
      //   .changeTodoDate(event, this._dayDate)
      //   .then(() => this.getTODOList());
    } else {
      // if another event is target, then put new event above targeted one
      // made for future use, can be activated with adding makeDroppable directive
      // to list element: makeDroppable [dropContext]="{context: 'list'}" (dropped)="onDrop($event, todo)"
      // this.todoService
      //   .putAbove(event.payload, data)
      //   .then(() => this.getTODOList());
    }
  }

  // initializing list
  ngOnInit(): void {
    this.todoTextControl = new FormControl(null, [Validators.required])
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
