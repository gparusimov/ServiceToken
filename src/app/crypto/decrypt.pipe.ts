import { Pipe, PipeTransform } from '@angular/core';
import { default as CryptoJS } from 'crypto-js';

@Pipe({
  name: 'decrypt'
})
export class DecryptPipe implements PipeTransform {

  transform(value: string, hash: string): string {
    if (value && hash) {
      return CryptoJS.AES.decrypt(value, localStorage.getItem(hash)).toString(CryptoJS.enc.Utf8);
    } else {
      return null;
    }
  }

}
