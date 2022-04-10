import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includes',
})
export class IncludesPipe implements PipeTransform {
  public transform<A>(arr: Array<A>, match: A): boolean {
    if (arr) {
      return arr.includes(match);
    }

    return null;
  }
}
