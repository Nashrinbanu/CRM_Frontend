// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class StaffsService {
//   private getGetStaffEndPoint = `${environment.apiUrl}staffs/`
//   private postGetStaffEndPoint = `${environment.apiUrl}staffs/`
//   private getStaffByIdEndPoint = `${environment.apiUrl}staffs`
//   private updateStaffEndPoint = `${environment.apiUrl}staffs/`

//   constructor(private http :HttpClient) { }

//   getstaff(staff?:any): Observable<any>{
//     return this.http.get<any[]>(`${this.getGetStaffEndPoint}`,{params:staff})
//   }

//   addstaff(staff:any):Observable<any>{
//     return this.http.post<any[]>(`${this.postGetStaffEndPoint}`,staff)
//   }

//   getstaffById(id: number): Observable<any> {
//     return this.http.get<any>(`${this.getStaffByIdEndPoint}/` + id);
//   }

//   updatestaff(data: any, leadId: any): Observable<any> {
//     return this.http.put<any>(`${this.updateStaffEndPoint}/` + leadId, data);
//   }
// }

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StaffsService {
  private postGetStaffEndPoint = `${environment.apiUrl}staffs/`;
  private getGetStaffEndPoint = `${environment.apiUrl}staffs/`;
  private getStaffByIdEndPoint = `${environment.apiUrl}staffs`;
  private updateStaffEndPoint = `${environment.apiUrl}staffs/`;
  private getStaffEndPoint = `${environment.apiUrl}staffs`;
  private getStaffSourceEndPoint = `${environment.apiUrl}staffsoure`;
  private getStaffStatusEndPoint = `${environment.apiUrl}staffstatus`;
  private baseUrl = `${environment.apiUrl}address`;
  private createActivityEndPoint = `${environment.apiUrl}staffs`;
  private getActivityByIdEndPoint = `${environment.apiUrl}staffs`;
  private getUpdateActivityEndPoint = `${environment.apiUrl}staffs`;
  private getMeetingDetailsByIdEndPoint = `${environment.apiUrl}activitys`;
  private getUpdateMeetingDetailsEndPoint = `${environment.apiUrl}activitys`;
  private postCallEndPoint = `${environment.apiUrl}activities/call`;
  private postNotesEndPoint = `${environment.apiUrl}activities/notes`;
  private postEmailEndPoint = `${environment.apiUrl}activities/email`;
  private postActivityEndPoint = `${environment.apiUrl}activities/activity`;
  private addPinnedNotesEndPoint = `${environment.apiUrl}activities/activities`;
  private getAssignDetailsEndPoint = `${environment.apiUrl}staffs/assigne`;
  private getStaffStageEndPoint = `${environment.apiUrl}staffs`;
  constructor(private http: HttpClient) {}

  getStaffs(staff?: any): Observable<any> {
    return this.http.get<any[]>(`${this.getGetStaffEndPoint}`, {
      params: staff,
    });
  }

  addStaff(staff: any): Observable<any> {
    return this.http.post<any>(`${this.postGetStaffEndPoint}`, staff);
  }
getStaffById(id: string): Observable<any> {
  return this.http.get<any>(`${this.getStaffByIdEndPoint}/` + id);
}


 updateStaff(data: any, staffId: string): Observable<any> {
    return this.http.put<any>(`${this.updateStaffEndPoint}${staffId}`, data).pipe(
      catchError(error => {
        console.error('Update staff error:', error);
        return throwError(error);
      })
    );
  }

  getstaff(staff?: any): Observable<any> {
    return this.http.get<any[]>(`${this.getGetStaffEndPoint}`, {
      params: staff,
    });
  }

  getStaffSource() {
    return this.http.get<any>(this.getStaffSourceEndPoint);
  }

  getStaffStatus() {
    return this.http.get<any>(this.getStaffStatusEndPoint);
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

  createActivity(staffId: number, activityData: any): Observable<any> {
    return this.http.post(
      `${this.createActivityEndPoint}${staffId}/activity/`,
      activityData
    );
  }

  // createActivity(activityData: any): Observable<any> {
  //   return this.http.post(this.createActivityEndPoint, activityData);
  // }

  getActivityById(id: number): Observable<any> {
    return this.http.get<any>(`${this.getActivityByIdEndPoint}/${id}/activity`);
  }

  updateActivity(id: number, params: any): Observable<any> {
    return this.http.get<any>(
      `${this.getUpdateActivityEndPoint}/${id}/activity`,
      params
    );
  }

  getMeetingDetailsById(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.getMeetingDetailsByIdEndPoint}/${id}/activity`
    );
  }

  updateMeetingDetails(id: number, params: any): Observable<any> {
    return this.http.get<any>(
      `${this.getUpdateMeetingDetailsEndPoint}/${id}/activity`,
      params
    );
  }

  addCall(staff: any): Observable<any> {
    return this.http.post<any[]>(`${this.postCallEndPoint}`, staff);
  }

  addNotes(staff: any, activityId: number): Observable<any> {
    const url = `${this.postNotesEndPoint}?activity_id=${activityId}`;
    return this.http.post<any>(url, staff);
  }

  addEmail(staff: any, activityId: any): Observable<any> {
    const url = `${this.postEmailEndPoint}?activity_id=${activityId}`;
    return this.http.post<any>(url, staff);
  }

  addActivity(staff: any): Observable<any> {
    return this.http.post<any[]>(`${this.postActivityEndPoint}`, staff);
  }

  // addPinnedNote(activityId:any,note_id:any): Observable<any>{
  //   return this.http.put(`${this.addPinnedNotesEndPoint}${activityId}/pin-note/${note_id}`);
  // }

  addPinnedNote(activityId: any, noteId: any): Observable<any> {
    return this.http.put(
      `${this.addPinnedNotesEndPoint}/${activityId}/pin-note/${noteId}`,
      null
    ); // Sending null as there's no request body
  }

  getAssign() {
    return this.http.get<any>(`${this.getAssignDetailsEndPoint}`);
  }

  getStaffStageDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.getStaffStageEndPoint}/${id}/activity`);
  }
}
