import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dataFilter' })
export class DataFilterPipe implements PipeTransform {

  transform(array: any[], query: string): any {
    if (query) {
      return _.filter(array, row => row.httpPath.match(query));
    }
    return array;
  }
}

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    let keys = [];
    for (var enumMember in value) {
      if (!isNaN(parseInt(enumMember, 10))) {
        keys.push({ key: enumMember, value: value[enumMember] });
      }
    }
    return keys;
  }
}

@Pipe({ name: 'truncate'})
export class TruncatePipe {
  transform(value: string, limit?: number) : string {
    limit = limit ? limit : 10;
    //let trail = args.length > 1 ? args[1] : '...';
    let trail = "";
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}

@Pipe({ name: 'orderBy'})
export class OrderByPipe implements PipeTransform {
  transform(arr: Array<any>, prop: any, reverse: boolean = false): any {
    if (arr === undefined) return;
    const m = reverse ? -1 : 1
    return arr.sort((a: any, b: any): number => {
      const x = a[prop];
      const y = b[prop];
      return (x === y) ? 0 : (x < y) ? -1*m : 1*m
    })
  }
}
