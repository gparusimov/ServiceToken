import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'epoch'})
export class EpochPipe implements PipeTransform {
  transform(value: string): Date {
    return new Date(+value * 1000);
  }
}
