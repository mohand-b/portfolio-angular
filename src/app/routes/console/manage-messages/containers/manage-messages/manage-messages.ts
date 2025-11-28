import {Component} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {ManageQuestions} from '../manage-questions/manage-questions';

@Component({
  selector: 'app-manage-messages',
  imports: [MatTabsModule, ManageQuestions],
  templateUrl: './manage-messages.html',
  styleUrl: './manage-messages.scss'
})
export class ManageMessages {

}
