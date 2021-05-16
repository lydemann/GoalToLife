import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MakeDraggableDirective } from './directives/make-draggable.directive';
import { MakeDroppable as MakeDroppableDirective } from './directives/make-droppable.directive';

@NgModule({
  declarations: [MakeDraggableDirective, MakeDroppableDirective],
  imports: [CommonModule],
  exports: [MakeDraggableDirective, MakeDroppableDirective],
  providers: [],
})
export class DragAndDropModule {}
