import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findByKeyValue',
})
export class FindByKeyValuePipe<T, U> implements PipeTransform {
  transform(collection: Array<T>, item: Array<T>, key: string, value?: U): unknown {
    if (!collection || collection.length === 0 || !item) return item;

    const found = collection.find((i: T) => {
      if (value === undefined) {
        return i[key] === item[key];
      } else {
        return i[key] === value;
      }
    });

    return found;
  }
}
