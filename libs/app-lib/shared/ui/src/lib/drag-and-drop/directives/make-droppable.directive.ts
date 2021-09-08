import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { DropContent } from './drop-content';

@Directive({
  selector: '[appMakeDroppable]',
})
export class MakeDroppableDirective implements OnInit {
  /*
   * Input: context of drop: list, day, ... (for further processing)
   */
  @Input() dropContext: any;

  /*
   * Output: emitting event with data, that was dropped
   */
  @Output() dropped: EventEmitter<any> = new EventEmitter();

  /*
   * Class, that is used to beautify dropzone element in process
   */
  dropClass = 'draggingElementOverArea';

  /*
   * CONSTRUCTOR
   * ElementRef and DOCUMENT token are injected to use HTML5 API and support process
   */
  constructor(
    private _elementRef: ElementRef,
    @Inject(DOCUMENT) private _document
  ) {}

  /*
   * Adding event listeners in this lifecycle hook handler
   */
  ngOnInit() {
    // As soon as all 100+ tries with HostListener failed, I've made it with native JS
    // Problems included abscence of animation, partial event firing, etc.
    const element = this._elementRef.nativeElement;

    // adding event listener on entering valid dropzone: add CSS class
    element.addEventListener('dragenter', () => {
      element.classList.add(this.dropClass);
    });

    // adding event listener on leaving valid dropzone: remove CSS class
    element.addEventListener('dragleave', () => {
      element.classList.remove(this.dropClass);
    });

    /* adding event listener on detecting whether dragged item is over valid dropzone: preventing default behaviour
       and defining drop effect ("move" is used here: item is moved to new location)
     */
    element.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      return false;
    });

    // adding event listener on drop event
    element.addEventListener('drop', (event) => {
      element.classList.remove(this.dropClass);

      // preparing payload to emit
      const data: DropContent = new DropContent(
        this.dropContext['context'],
        JSON.parse(event.dataTransfer.getData('text')),
        JSON.parse(event.dataTransfer.getData('text'))['elementClass']
      );
      this.dropped.emit(data);

      // some direct DOM manipulation (I know that it's bad practice, but I got stuck with drag and drop,
      // so this solution is used
      const elementsToHide = this._document.querySelectorAll(
        `.${data.elementClass}`
      );
      for (let i = 0; i < elementsToHide.length; i++) {
        elementsToHide[i].remove();
      }
    });
  }
}
