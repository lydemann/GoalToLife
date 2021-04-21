import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { TODOItem } from '../classes/todo-item';

/*
 * Service is used to support CRUD operations with TODO-list
 * localStorage is used for persistence
 * angular-2-local-storage module is used for comfortable interaction with browser's localStorage
 * Promises are implemented for future use (if there'll be some serverside with DB)
 */

@Injectable()
export class TODOService {
  /*
   * Intermediate storage of TODO-list
   */
  data : TODOItem[];

  /*
   * CONSTRUCTOR
   * Clears intermediate storage. LocalStorageService (angular-2-local-storage) is injected.
   */
  constructor(private _localStorageService: LocalStorageService) {
    this.data = [];
  }

  /*
   * Get list of TODOs for required date (optional)
   * Uses localStorage, returns Promise with list of TODOs
   */
  getList(date? : Date): Promise<TODOItem[]> {
    this.data = [{
      id: 1,
      text: 'lala todo'
    } as TODOItem];

    // // getting list of TODOs
    // for (let key of this._localStorageService.keys()) {
    //   if (this._localStorageService.get(key) == null) {
    //     continue;
    //   }
    //   let element : TODOItem = <TODOItem>JSON.parse (this._localStorageService.get(key).toString());

    //   if (element == null) {
    //     continue;
    //   }
    //   if (!element.hasOwnProperty('day')) {
    //     continue;
    //   }

    //   if (date == undefined) {
    //     this.data.push(element);
    //     continue;
    //   }
    //   if (new Date (element['day']).getTime() == date.getTime()) {
    //     this.data.push(element);
    //   }
    // }

    // // sorting
    // this.data.sort((a : TODOItem, b : TODOItem) => {
    //   return a.orderInDay > b.orderInDay ? 1 : 0;
    // });

    // done
    return Promise.resolve(this.data);
  }

  /*
   * Add TODOItem to list of TODOs
   * Returns Promise with "id" of new TODO
   */
  addToList (todo : TODOItem) : Promise<Number> {
    // fetching all ids
    const idArray : number[] = this._localStorageService.keys().map((key, index) => {
      if (this._localStorageService.get(key) == null) {
        return 0;
      }

      const element : TODOItem = <TODOItem>JSON.parse (this._localStorageService.get(key).toString());
      if (element == null) {
        return 0;
      }
      if (!element.hasOwnProperty('day')) {
        return 0;
      }
      return element.id;
    });

    /* if array of TODOs is empty, then id=1, else - calculating
       this can be used in single-user environment, in case of multiple users there'll be problem
       with concurrent access to the same id, so some sort of sequences will have to be used
    */
    if (idArray.length === 0) {
      todo.id = 1;
    } else {
      todo.id = Math.max.apply(null, idArray) + 1;
    }

    // setting order of TODO in day
    todo.orderInDay = this.data.length + 1;

    // saving to localStorage and intermediate storage
    this._localStorageService.set((todo.id - 1).toString(), JSON.stringify(todo));
    this.data.push(todo);

    // done
    return Promise.resolve(todo.id);
  }

  /*
   * Deletes TODOItem from list of TODOs
   * Returns Promise with "id" of deleted TODO
   */
  deleteFromList (todo? : TODOItem) : Promise<Number> {
    // delete from localStorage
    this._localStorageService.remove((todo.id - 1).toString());

    // delete from intermediate storage
    for (let i=0;i<this.data.length;i++) {
      if (this.data[i].id == todo.id) {
        this.data.splice(i,1);
      }
    }

    // done
    return Promise.resolve(todo.id);
  }

  /*
   * Moves TODOItem to another date or to the head of same date
   * Used in drag-and-drop logic, lets us move item to top of the day (current or another)
   * Returns Promise with "id" of moved TODO
   */
  changeTodoDate (todo : TODOItem, date : Date) : Promise<Number> {

    // get current date
    todo.day = date;

    // get order of days
    const sortArray : number[] = this.data.map((value, index) => {
      return value.orderInDay;
    });

    // put TODO on top of the day (order can be negative, thats not a problem)
    if (sortArray.length == 0) {
      todo.orderInDay = 1;
    } else {
      todo.orderInDay = Math.min.apply(null, sortArray) - 1;
    }

    // saving to localStorage
    this._localStorageService.set((todo.id - 1).toString(), JSON.stringify(todo));

    // done
    return Promise.resolve(todo.id);
  }

  /*
   * Moves "new" TODOItem above "current" () TODOItem and between days
   * Can be used in drag-and-drop logic
   * Returns Promise with "id" of moved TODO
   */
  putAbove (newTodo : TODOItem, currentTodo : TODOItem) : Promise<Number> {
    // setting order and day of TODO
    newTodo.orderInDay = currentTodo.orderInDay;
    newTodo.day = currentTodo.day;

    // making space for our new item
    for (let i=0;i<this.data.length;i++) {
      if (this.data[i].orderInDay > currentTodo.orderInDay) {
        this.data[i].orderInDay += 1;
        this._localStorageService.set((this.data[i].id - 1).toString(), JSON.stringify(this.data[i]));
      }
    }

    // moving up "current" item
    currentTodo.orderInDay++;

    // saving both items to localStorage
    this._localStorageService.set((newTodo.id - 1).toString(), JSON.stringify(newTodo));
    this._localStorageService.set((currentTodo.id - 1).toString(), JSON.stringify(currentTodo));

    // done
    return Promise.resolve(newTodo.id);
  }

  /* = unused method  = (there was no place for it on the provided maquette)
   * Clears our storage: removes all TODOs
   */
  clear () : Promise<TODOItem[]> {
    this._localStorageService.clearAll();
    return Promise.resolve([]);
  }
}
