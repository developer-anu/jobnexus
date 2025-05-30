/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';


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
}*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private apiUrl = 'http://127.0.0.1:8000'; // Replace with your backend endpoint

  constructor(private http: HttpClient) {}

  /**
   * Search jobs via Pinecone embeddings similarity
   * @param query Search keyword
   */
  searchPinecone(query: string, location: string): Observable<any[]> {
      const params = new HttpParams()
      .set('keyword', query)
      .set('location', location);

    return this.http.get<any[]>(`${this.apiUrl}/api/pinecone-search`, { params }).pipe(
      catchError(error => {
        console.error('Pinecone search error:', error);
        return throwError(() => new Error('Failed to fetch results from Pinecone'));
      })
    );
  }

  /**
   * Search jobs via Serapi fallback
   * @param query Search keyword
   * @param location Location filter
   */
  searchSerapi(query: string, location: string): Observable<any[]> {
    const params = new HttpParams()
      .set('query', query)
      .set('location', location);

    return this.http.get<any[]>(`${this.apiUrl}/api/serapi-search`, { params }).pipe(
      catchError(error => {
        console.error('Serapi search error:', error);
        return throwError(() => new Error('Failed to fetch results from Serapi'));
      })
    );
  }

  /**
   * Store jobs in backend
   * @param jobs Array of job objects
   */
  storeJobs(jobs: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/store-jobs`, jobs).pipe(
      catchError(error => {
        console.error('Error storing jobs:', error);
        return throwError(() => new Error('Failed to store job data'));
      })
    );
  }

  /**
   * Optional: Search jobs via your original API (if needed)
   */
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

  /**
   * Get recommended jobs (optional)
   */
  getRecommendedJobs(query: string, topK: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('top_k', topK.toString());

    return this.http.get(`${this.apiUrl}/api/recommend_jobs`, { params });
  }
}

