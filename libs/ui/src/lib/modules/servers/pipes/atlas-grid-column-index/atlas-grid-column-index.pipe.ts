import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'atlasGridColumnIndex',
})
export class AtlasGridColumnIndexPipe implements PipeTransform {
  transform(name: string, columns: Array<string>): number {
    if (name) {
      const c = name.slice(0, 1);

      return columns.indexOf(c);
    }
  }
}
