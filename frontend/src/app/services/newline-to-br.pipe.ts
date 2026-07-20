// newline-to-br.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'newlineToBr'
})
export class NewlineToBrPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) {
      return value;
    }
    // Escape HTML entities first to prevent XSS
    const escaped = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Then replace newlines with <br>
    const result = escaped.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}
