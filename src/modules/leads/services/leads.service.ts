import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpEvent } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {
  private getGetLeadEndPoint = `${environment.apiUrl}leads/`
  private postGetLeadEndPoint = `${environment.apiUrl}leads/`
  private getLeadByIdEndPoint = `${environment.apiUrl}leads`
  private getContactIdEndPoint = `${environment.apiUrl}leads`
  private updateLeadEndPoint = `${environment.apiUrl}leads/`
  private updateContactEndPoint = `${environment.apiUrl}leads`
  private getStaffEndPoint = `${environment.apiUrl}staffs`
  private getLeadSourceEndPoint = `${environment.apiUrl}leadsoure`
  private getLeadStatusEndPoint = `${environment.apiUrl}leadstatus`
  private baseUrl = `${environment.apiUrl}address`;
  private createActivityEndPoint = `${environment.apiUrl}leads`
  private getActivityByIdEndPoint = `${environment.apiUrl}activities`

  private getMeetingDetailsByIdEndPoint = `${environment.apiUrl}activitys`
  private getUpdateMeetingDetailsEndPoint = `${environment.apiUrl}activitys`
  private postCallEndPoint = `${environment.apiUrl}activities/call`
  private postNotesEndPoint = `${environment.apiUrl}activities/notes`
  private postEmailEndPoint = `${environment.apiUrl}activities/email`
  private postActivityEndPoint = `${environment.apiUrl}activities/activity`
  private addPinnedNotesEndPoint = `${environment.apiUrl}activities/activities`
  private getAssignDetailsEndPoint = `${environment.apiUrl}staffs/assigne`
  private getLeadStageEndPoint = `${environment.apiUrl}leads`
  private getUpdateActivityEndPoint = `${environment.apiUrl}leads`
  constructor(private http: HttpClient, private authService: AuthService) { }
  // request   http client ----->reponse

  getLead(lead?: any): Observable<any> {
    return this.http.get<any[]>(`${this.getGetLeadEndPoint}`, { params: lead })
  }

  addLead(lead: any): Observable<any> {
    return this.http.post<any[]>(`${this.postGetLeadEndPoint}`, lead)
  }

  getLeadById(id: number): Observable<any> {
    return this.http.get<any>(`${this.getLeadByIdEndPoint}/` + id);
  }
  // getContactId(id: number): Observable<any> {
  //   return this.http.get<any>(`${this.getContactIdEndPoint}/` + id);
  // }

  getActivityById(id: number): Observable<any> {
    return this.http.get<any>(`${this.getActivityByIdEndPoint}/` + id).pipe(
      catchError(error => {
        console.error('Error fetching activity:', error);
        return throwError(error);
      })
    );
  }
  getContactId(id: number): Observable<any> {
    return this.http.get<any>(`${this.getContactIdEndPoint}/${id}/contacts`);
  }

  updateLead(data: any, leadId: any): Observable<any> {
    return this.http.put<any>(`${this.updateLeadEndPoint}` + leadId, data);
  }
  // contacts.service.ts
  updateContacts(id: number, contactData: any): Observable<any> {
    return this.http.put<any>(
      `${this.updateContactEndPoint}/${id}/contacts`,
      contactData
    );
  }


  getStaff() {
    return this.http.get<any>(this.getStaffEndPoint);
  }

  getLeadSource() {
    return this.http.get<any>(this.getLeadSourceEndPoint);
  }

  getLeadStatus() {
    return this.http.get<any>(this.getLeadStatusEndPoint);
  }

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/country?skip=0&limit=100`);
  }

  getStates(countryId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/state?skip=0&limit=100&countryId=${countryId}`
    );
  }

  getCities(stateId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/cities?skip=0&limit=100&stateId=${stateId}`
    );
  }

  createActivity(leadId: number, activityData: any): Observable<any> {
    return this.http.post(`${this.createActivityEndPoint}${leadId}/activity/`, activityData);
  }

  // createActivity(activityData: any): Observable<any> {
  //   return this.http.post(this.createActivityEndPoint, activityData);
  // }



  getActivity(id: number, params?: any): Observable<any> {
    return this.http.get<any>(`${this.getUpdateActivityEndPoint}/${id}/activitys`, { params });
  }

  getMeetingDetailsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.getMeetingDetailsByIdEndPoint}/${id}/activity`);
  }

  updateMeetingDetails(id: number, params: any): Observable<any> {
    return this.http.get<any>(`${this.getUpdateMeetingDetailsEndPoint}/${id}/activity`, params);
  }

  addCall(lead: any): Observable<any> {
    return this.http.post<any[]>(`${this.postCallEndPoint}`, lead)
  }

  addNotes(lead: any, activityId: number): Observable<any> {
    const url = `${this.postNotesEndPoint}?activity_id=${activityId}`;
    return this.http.post<any>(url, lead);
  }

  addEmail(
    data: {
      recipients: string;
      subject: string;
      body?: string;
      cc?: string;
      bcc?: string;
      file?: File | string | Array<File | string>;
      image?: File | string | Array<File | string>;
    },
    activityId: number
  ): Observable<any> {

    const formData = new FormData();

    formData.append('activity_id', activityId.toString());
    formData.append('recipients', data.recipients);
    formData.append('subject', data.subject);
    formData.append('body', data.body || '');

    if (data.cc) formData.append('cc', data.cc);
    if (data.bcc) formData.append('bcc', data.bcc);

    // Support multiple files or string paths
    if (data.file) {
      if (Array.isArray(data.file)) {
        data.file.forEach((f: any) => {
          if (f instanceof File) formData.append('file', f, (f as File).name);
          else formData.append('file', String(f));
        });
      } else {
        const f: any = data.file;
        if (f instanceof File) formData.append('file', f, (f as File).name);
        else formData.append('file', String(f));
      }
    }

    // Support multiple images or string paths
    if (data.image) {
      if (Array.isArray(data.image)) {
        data.image.forEach((img: any) => {
          if (img instanceof File) formData.append('image', img, (img as File).name);
          else formData.append('image', String(img));
        });
      } else {
        const img: any = data.image;
        if (img instanceof File) formData.append('image', img, (img as File).name);
        else formData.append('image', String(img));
      }
    }

    return this.http.post<any>(
      `${this.postEmailEndPoint}`,
      formData
    );
  }
  addActivity(lead: any): Observable<any> {
    return this.http.post<any[]>(`${this.postActivityEndPoint}`, lead)
  }

  // addPinnedNote(activityId:any,note_id:any): Observable<any>{
  //   return this.http.put(`${this.addPinnedNotesEndPoint}${activityId}/pin-note/${note_id}`);
  // }

  addPinnedNote(activityId: any, noteId: any): Observable<any> {
    return this.http.put(`${this.addPinnedNotesEndPoint}/${activityId}/pin-note/${noteId}`, null); // Sending null as there's no request body
  }

  getAssign() {
    return this.http.get<any>(`${this.getAssignDetailsEndPoint}`);
  }

  getLeadStageDetails(id: number): Observable<any> {
    // The backend exposes activity details at /activities/:id with pagination
    // Provide default skip & limit to match expected backend behaviour
    const params = { skip: '0', limit: '10' };
    return this.http.get<any>(`${environment.apiUrl}activities/${id}`, { params });
  }

  getAssignableStaff() {
    return this.http.get<any>(`${environment.apiUrl}staffs/assigne`);
  }

  createContact(leadId: number, contact: any): Observable<any> {
    return this.http.post<any>(
      `${this.updateContactEndPoint}/${leadId}/contacts`,
      contact
    );
  }

  // Bulk import leads with progress tracking
  bulkImportLeads(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    let headers = new HttpHeaders().set('Accept', 'application/json');
    const token = this.authService?.getToken() || localStorage.getItem('crmAuthToken');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<any>(`${environment.apiUrl}leads/leads_bulk`, formData, {
      headers: headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(error => {
        console.error('Error in bulk import:', error);
        return throwError(error);
      })
    );
  }

  // updateContact(leadId: number, contactId: number, contact: any): Observable<any> {
  //   return this.http.put<any>(
  //     `${this.updateContactEndPoint}/${leadId}/contacts/${contactId}`,
  //     contact
  //   );
  // }
}