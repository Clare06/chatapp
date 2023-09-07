// newline-to-br.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newlineToBr'
})
export class NewlineToBrPipe implements PipeTransform {
  transform(value: string): string {
    // Replace newline characters with <br> elements
    return value.replace(/\n/g, '<br>');
  }
}
