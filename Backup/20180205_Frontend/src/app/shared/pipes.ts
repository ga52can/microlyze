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