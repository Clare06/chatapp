import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmPasswordValidator(passwordControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    const confirmPassword = control.root.get(passwordControlName)?.value;

    if (password !== confirmPassword) {
      return { confirmPasswordMismatch: true };
    }

    return null;
  };
}
