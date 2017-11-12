import { Pipe, PipeTransform } from '@angular/core';
import { default as Web3 } from 'web3';

@Pipe({
  name: 'wei'
})
export class WeiPipe implements PipeTransform {

  transform(value: any, unit: string): any {
    if (value) {
      return Web3.utils.fromWei(value, unit);
    } else {
      return 0;
    }
  }
}
