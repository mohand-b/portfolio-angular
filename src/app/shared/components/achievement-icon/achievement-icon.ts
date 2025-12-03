import {Component, computed, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-achievement-icon',
  imports: [MatIconModule],
  templateUrl: './achievement-icon.html'
})
export class AchievementIconComponent {
  icon = input.required<string>();
  color = input<string>('#6b7280');
  size = input<'sm' | 'md' | 'lg'>('md');

  sizeClasses = computed(() => {
    const sizes = {
      sm: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };
    return sizes[this.size()];
  });

  iconSizeClasses = computed(() => {
    const sizes = {
      sm: '!text-xl !w-5 !h-5',
      md: '!text-2xl !w-6 !h-6',
      lg: '!text-3xl !w-8 !h-8'
    };
    return sizes[this.size()];
  });

  background = computed(() => {
    const color = this.color();
    return `linear-gradient(135deg, ${color}, ${this.darkenColor(color)})`;
  });

  private darkenColor(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const factor = 0.7;
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
}
