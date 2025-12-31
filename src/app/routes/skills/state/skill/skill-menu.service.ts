import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SkillMenuService {
  readonly openMenuSkillId = signal<string | null>(null);

  toggle(skillId: string): void {
    const currentId = this.openMenuSkillId();
    this.openMenuSkillId.set(currentId === skillId ? null : skillId);
  }

  close(): void {
    this.openMenuSkillId.set(null);
  }
}
