import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environments';
import {ContactMessageDto, ContactMessageResponseDto} from './contact.model';

@Injectable({providedIn: 'root'})
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/contact`;

  sendMessage(dto: ContactMessageDto): Observable<ContactMessageResponseDto> {
    return this.http.post<ContactMessageResponseDto>(`${this.baseUrl}/message`, dto);
  }
}
