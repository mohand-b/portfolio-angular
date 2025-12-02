import {Component} from '@angular/core';
import {ContactForm} from '../../components/contact-form/contact-form';
import {QuestionsAnswers} from '../questions-answers/questions-answers';

@Component({
  selector: 'app-contact',
  imports: [ContactForm, QuestionsAnswers],
  templateUrl: './contact.html'
})
export class Contact {
}
