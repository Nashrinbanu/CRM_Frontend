import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private postFileUploadEndPoint = `${environment.apiUrl}uploadfile/fileUploads`

  constructor(private http: HttpClient) { }
  
  fileUpload(data: FormData): Observable<any> {
    console.log(data,"data")
    return this.http.post<any>(this.postFileUploadEndPoint, data);
  }
  
  
  

}
