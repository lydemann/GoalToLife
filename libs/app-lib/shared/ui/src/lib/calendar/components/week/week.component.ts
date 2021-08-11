import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { Goal, GoalPeriod, GoalPeriodType } from '@app/shared/domain';
import { getGoalKey } from '@app/shared/util';
import { CalendarDate } from '../../classes';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekComponent {
  @Input() calendarDate: CalendarDate = {
    date: new Date(),
    goalPeriod: {
      goals: [],
    } as any,
    isSelected: false,
    month: 4,
  };
  @Output() addTodo = new EventEmitter<Goal>();
  @Output() deleteTodo = new EventEmitter<Goal>();
  @Output() editTodo = new EventEmitter<Goal>();
  @Output() toggleComplete = new EventEmitter<Goal>();
  @Output() retroChange = new EventEmitter<Partial<GoalPeriod>>();

  goalPeriodType = GoalPeriodType.WEEKLY;

  constructor() {}

  onDeleteTodo(goal: Goal) {
    this.deleteTodo.next(goal);
  }
  onAddTodo(goal: Goal) {
    const goalKey = getGoalKey(this.calendarDate.date, this.goalPeriodType);
    this.addTodo.next({
      ...goal,
      type: this.goalPeriodType,
      scheduledDate: goalKey,
    });
  }
}
