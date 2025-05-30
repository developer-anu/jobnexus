import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Job } from '../models/job.model';


@Injectable({
  providedIn: 'root'
})
export class JobService {

   private apiUrl = 'http://127.0.0.1:8000'; // Replace with your backend endpoint

  constructor(private http: HttpClient) {}

  searchJobs(query: string, location: string): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('location', location);

    return this.http.get<any>(`${this.apiUrl}/api/search-jobs`, { params }).pipe(
      catchError(error => {
        console.error('Job search error:', error);
        return throwError(() => new Error('Failed to fetch job results'));
      })
    );
  }


  storeJobs(jobs: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/store-jobs`,  jobs ).pipe(
    catchError(error => {
      console.error('Error storing jobs:', error);
      return throwError(() => new Error('Failed to store job data'));
    })
    );
  }

  getRecommendedJobs(query: string, topK: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('top_k', topK.toString());

    return this.http.get(`${this.apiUrl}/api/recommend_jobs`, { params });
  }
}
