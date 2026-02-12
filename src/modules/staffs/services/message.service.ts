import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = environment.apiUrl + '/chatbot/query';

  constructor(private http: HttpClient) { }

  askBot(query: string): Observable<any> {
    return this.askBotWithOptions(query);
  }

  /**
   * Ask bot with optional options object. Options are merged into the request body.
   * Examples: { expand: true } or { follow_up: true }
   */
  askBotWithOptions(query: string, options?: any): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Timezone": "Asia/Calcutta"
    });

    const body = Object.assign({ query }, options || {});
    return this.http.post(this.apiUrl, body, { headers });
  }
}
