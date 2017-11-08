import { Pipe, PipeTransform } from '@angular/core';
import { default as CryptoJS } from 'crypto-js';

@Pipe({
  name: 'decrypt'
})
export class DecryptPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return CryptoJS.AES.decrypt(value, 'secret key 123').toString(CryptoJS.enc.Utf8);
    } else {
      return null;
    }
  }

}
