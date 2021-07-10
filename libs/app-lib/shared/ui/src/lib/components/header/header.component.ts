import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { IonSelect, NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  @Input() backUrl: string;
  @Input() backText: string;
  @Input() title: string;
  @Input() categories: string[] = [];

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  onNavigateBack() {
    this.navCtrl.navigateForward(this.backUrl, { animated: false });
  }

  onSelectTags(event: Event, ionSelect: IonSelect) {
    ionSelect.open();

    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
