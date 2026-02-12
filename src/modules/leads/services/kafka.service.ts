import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KafkaService {

  constructor(private http: HttpClient) { }


  private kafkaUrlForEmail = `${environment.apiUrl}activities/email`;
  private kafkaUrlForStaff = `${environment.apiUrl}api/staff`
  private kafkaUrlForlead = `${environment.apiUrl}api/leads`
  // private kafkaUrl = 'https://b5a6-2401-4900-6325-b597-4c16-d0b1-ec5b-ae11.ngrok-free.app/api/emailTab';


  sendToKafka(data: any) {
    return this.http.post(this.kafkaUrlForlead, data);
  }

  sendToStaffKafka(data: any) {
    return this.http.post(this.kafkaUrlForStaff, data);
  }

   sendEmailRequest(formData: FormData) {
    return this.http.post(this.kafkaUrlForEmail, formData);
  }
}
