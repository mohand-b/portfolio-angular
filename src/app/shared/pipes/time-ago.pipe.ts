import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return 'il y a quelques secondes';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return minutes === 1 ? 'il y a 1 min' : `il y a ${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours === 1 ? 'il y a 1h' : `il y a ${hours}h`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return days === 1 ? 'il y a 1j' : `il y a ${days}j`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return months === 1 ? 'il y a 1 mois' : `il y a ${months} mois`;
    }

    const years = Math.floor(months / 12);
    return years === 1 ? 'il y a 1 an' : `il y a ${years} ans`;
  }
}
