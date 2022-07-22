import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private data: any = {};

  setOption(option: string | number, value: any) {
    this.data[option] = value;
  }

  getOption() {
    return this.data;
  }
}
