import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'atlasGridRowIndex',
})
export class AtlasGridRowIndexPipe implements PipeTransform {
  transform(name: string, rows: Array<string>): number {
    const r = name.slice(1);

    return rows.indexOf(r);
  }
}
