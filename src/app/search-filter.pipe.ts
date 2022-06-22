import { Pipe, PipeTransform } from '@angular/core';
import { Contact, Group } from './shared/model';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(list: any[], ...args: string[]): any[] {
    if (!list) return [];
    const searchString = args[0];
    if (searchString === '') return list;

    if (args.length === 2) {
      return list.filter((item) => item[args[1]].indexOf(searchString) > -1);
    } else {
      return list.filter((item) => {
        return (
          item[args[1]].indexOf(searchString) > -1 ||
          item[args[2]].indexOf(searchString) > -1 ||
          (item[args[1]] + ' ' + item[args[2]]).indexOf(searchString) > -1 ||
          item[args[3]].indexOf(searchString) > -1 ||
          (searchString === 'inactive' && !item.isActive) ||
          (searchString === 'active' && item.isActive)
        );
      });
    }
  }
}
