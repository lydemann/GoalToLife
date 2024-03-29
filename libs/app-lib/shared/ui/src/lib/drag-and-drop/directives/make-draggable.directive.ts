import { Directive, ElementRef, Input, OnInit } from '@angular/core';

import { DropContent } from './drop-content';

/*
 * Directive defines behaviour of "draggable" element (TODO-item in our case)
 * Encapsulates HTML5 native API
 */
@Directive({
  selector: '[appMakeDraggable]',
})
export class MakeDraggableDirective implements OnInit {
  /*
   * Inputs: data to drag, draggable option and helper CSS class
   */
  @Input() appMakeDraggable: DropContent = new DropContent('', {});
  @Input() draggable = true;
  @Input() helperClass: string;
  @Input() dragItemId: string | number;

  /*
   * Class, that is used to beautify dragging element in process
   */
  dragClass = 'draggingElement';

  /*
   * CONSTRUCTOR
   * ElementRef is injected to use HTML5 API
   */
  constructor(private _elementRef: ElementRef) {}

  /*
   * Adding event listeners in this lifecycle hook handler
   */
  ngOnInit() {
    /* As soon as all 100+ tries with HostListener failed, I've made it with native JS
       Problems included abscence of animation, partial event firing, etc.
    */

    // defining exception to control if element is not allowed to be draggable
    const elementIsNotDraggableException = new Error(
      'You are trying to make not draggable element draggable'
    );

    // making element draggable
    try {
      // checking if element can be made draggable
      if (this.draggable === false) {
        throw elementIsNotDraggableException;
      }
      const element = this._elementRef.nativeElement;

      // adding event listener on start of drag-event: add styling, prepare payload
      element.addEventListener('dragstart', (event) => {
        // making helper CSS-class to manipulate dragged element
        let elementIdentifyingClass;
        if (!this.dragItemId) {
          const random: number = Math.round(0.5 + Math.random() * 100000);
          elementIdentifyingClass = `${this.dragClass}-${random.toString()}`;
        } else {
          elementIdentifyingClass = `${this.helperClass}-${this.dragItemId}`;
        }

        // adding drag and helper classes to dragged element
        element.classList.add(this.dragClass);
        element.classList.add(elementIdentifyingClass);

        // putting class data into event (it'll be needed shortly, on drop)
        this.appMakeDraggable.elementClass = elementIdentifyingClass;

        /* preparing drag data: move element to another location and put some payload in it
           (our "TODO" in case of current application)
         */
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData(
          'text',
          JSON.stringify(this.appMakeDraggable)
        );
        event.dataTransfer.setData('elementClass', elementIdentifyingClass);
      });

      // adding event listener on end of drag event: remove styling
      element.addEventListener('dragend', (e) => {
        e.preventDefault();
        element.classList.remove(this.dragClass);
      });
    } catch (elementIsNotDraggableException) {
      // handle exception
      // eslint-disable-next-line no-console
      console.log(elementIsNotDraggableException.message);
    }
  }
}
