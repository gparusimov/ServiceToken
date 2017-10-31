import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'state'})
export class StatePipe implements PipeTransform {
  transform(value: any): string {
    let state: string;

    if (value) {
      switch(value.toNumber()) {
        case 0: {
          state = "Created";
          break;
        }
        case 1: {
          state = "Proposed";
          break;
        }
        case 2: {
          state = "Withdrawn";
          break;
        }
        case 3: {
          state = "Accepted";
          break;
        }
        case 4: {
          state = "Rejected";
          break;
        }
        default: {
          state = "Unknown";
          break;
        }
      }
    }

    return state;
  }
}
