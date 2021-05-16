import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { getDailyGoalKey } from '@app/app-lib';
import { Goal, GoalPeriod, GoalPeriodType } from '@app/shared/interfaces';
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

  constructor() {}

  ngOnInit() {}

  onDeleteTodo(goal: Goal) {
    this.deleteTodo.next(goal);
  }
  onAddTodo(goal: Goal) {
    const dailyGoalKey = getDailyGoalKey(this.calendarDate.dateDate);
    this.addTodo.next({
      ...goal,
      type: GoalPeriodType.WEEKLY,
      scheduledDate: dailyGoalKey,
    });
  }
}
