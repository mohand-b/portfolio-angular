import {Injectable} from '@angular/core';
import {createAvatar} from '@dicebear/core';
import {avataaars} from '@dicebear/collection';

@Injectable({providedIn: 'root'})
export class AvatarGeneratorService {
  private readonly BACKGROUND_COLORS = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'] as const;

  generate(seed: string = this.createSeed()): string {
    const backgroundIndex = this.hash(seed) % this.BACKGROUND_COLORS.length;

    return createAvatar(avataaars, {
      seed,
      backgroundColor: [this.BACKGROUND_COLORS[backgroundIndex]],
      backgroundType: ['gradientLinear'],
      radius: 50,
    }).toString();
  }

  generateBatch(count: number): string[] {
    return Array.from({length: count}, () => this.generate());
  }

  private createSeed(): string {
    return `${Date.now()}-${Math.random()}`;
  }

  private hash(str: string): number {
    return Math.abs(
      [...str].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) & hash, 0)
    );
  }
}
