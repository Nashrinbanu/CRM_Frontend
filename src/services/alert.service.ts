import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
  
  success(message: string) {
    alert(`Success: ${message}`);
  }

  error(message: string) {
    alert(`Error: ${message}`);
  }
}
