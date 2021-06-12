import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { Goal, GoalPeriod, GoalPeriodType } from '@app/shared/interfaces';
import { getGoalKey } from '@app/shared/utils';
import { CalendarDate } from '../../classes';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekComponent implements OnInit {
  @Input() calendarDate: CalendarDate = {
    dateDate: new Date(),
    goals: [],
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

  ngOnInit() {}

  onDeleteTodo(goal: Goal) {
    this.deleteTodo.next(goal);
  }
  onAddTodo(goal: Goal) {
    const goalKey = getGoalKey(this.calendarDate.dateDate, this.goalPeriodType);
    this.addTodo.next({
      ...goal,
      type: this.goalPeriodType,
      scheduledDate: goalKey,
    });
  }
}
