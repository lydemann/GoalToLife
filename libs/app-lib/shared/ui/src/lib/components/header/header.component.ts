import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IonSelect, NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() backUrl: string;
  @Input() backText: string;
  @Input() title: string;

  private _categories: string[] = [];
  public get categories(): string[] {
    return this._categories;
  }
  @Input()
  public set categories(v: string[]) {
    this._categories = v;
    if (this.select) {
      this.select.value = v;
    }
  }

  @Output() categoriesChange = new EventEmitter<string[]>();

  @ViewChild('select') select: IonSelect;

  constructor(private navCtrl: NavController) {}

  onNavigateBack() {
    this.navCtrl.navigateForward(this.backUrl, { animated: false });
  }

  onSelectTags(event: Event, ionSelect: IonSelect) {
    ionSelect.open();
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  onCategoriesSelected() {
    this.categoriesChange.next(this.select.value);
  }
}
