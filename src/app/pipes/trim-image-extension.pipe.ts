import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimImageExtension'
})
export class TrimImageExtensionPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    if(!value) return '';
    return value.replace(/\.[^.]*$/, '');
  }

}
