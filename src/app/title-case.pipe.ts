import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase'
})
export class TitleCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const firstSpaceIndex = value.indexOf(' ');
    const firstName = firstSpaceIndex !== -1 ? value.slice(0, firstSpaceIndex) : value;
    return firstName.toUpperCase();
  }
}
