import {Component, computed, WritableSignal} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {environment} from '../../../../../../environments/environments';
import {Visitor} from '../../../../core/state/visitor/visitor.model';
import {MatTableModule} from '@angular/material/table';
import {DatePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-manage-visitors',
  imports: [
    MatTableModule,
    DatePipe,
    MatIconModule
  ],
  templateUrl: './manage-visitors.html',
  styleUrl: './manage-visitors.scss'
})

export class ManageVisitors {

  readonly fetchedVisitors: WritableSignal<Visitor[] | undefined> = httpResource<Visitor[]>(() => ({
    url: `${environment.baseUrl}/visitor/all`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  })).value;

  readonly displayedVisitors = computed<Partial<Visitor>[]>(() => {
    const data = this.fetchedVisitors();
    if (!data) return [];
    return data
      .map(v => ({
        firstName: v.firstName,
        lastName: v.lastName,
        email: v.email,
        isVerified: v.isVerified,
        createdAt: v.createdAt,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });


  readonly displayedColumnsVisitors: string[] = ['firstName', 'lastName', 'email', 'createdAt', 'isVerified', 'actions'];

}
