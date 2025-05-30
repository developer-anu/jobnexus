import { Component, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobService} from '../../services/job.service';
import { v4 as uuidv4 } from 'uuid';
import { JobChartComponent } from '../job-chart/job-chart.component';
import { Job } from '../../models/job.model';


declare var bootstrap: any; // Add this line at the top


@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [FormsModule,CommonModule, JobChartComponent],
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})

export class JobSearchComponent implements AfterViewInit{
  keyword: string = '';
  location: string = '';
  jobs: any[] = [];
  storeJobs:any[] = [];
  isLoading = false;
  query = '';
  selectedJob: Job | null = null;
  submitted = false;

    ngAfterViewInit() {
    // Initialize all tooltips in the component
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  constructor(private jobService: JobService) {}

  extractPostedDays(postedStr: string): number {
  if (!postedStr) return 999; // Fallback for undefined or empty

  postedStr = postedStr.toLowerCase();

  if (postedStr.includes('just')) return 0;

  const match = postedStr.match(/(\d+)\s*day/);
  if (match) {
    return parseInt(match[1], 10);
  }

  return 999; // Fallback for unexpected formats
}

  getJobChunks(jobs: any[], chunkSize: number = 3): any[][] {
    const chunks = [];
    for (let i = 0; i < jobs.length; i += chunkSize) {
      chunks.push(jobs.slice(i, i + chunkSize));
    }
    return chunks;
  }  
/*  onSearch(): void {
  this.submitted = true;
  if (!this.keyword || !this.location) {
    return;
  }

  this.isLoading = true;
  this.jobService.searchJobs(this.keyword, this.location).subscribe({
    next: (res: any) => {
      const jobs = res.results.map((job: any) => ({
        id: uuidv4(),
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        apply_link: job.apply_link,
        thumbnail: job.thumbnail,
        posted: job.posted,
        via: job.via,
        postedDays: this.extractPostedDays(job.posted)
      }));

      // Sort jobs by postedDays (ascending: newest first)
      this.jobs = jobs.sort((a:any, b:any) => a.postedDays - b.postedDays);

      this.isLoading = false;

      if (!this.jobs.length) {
        console.warn('No valid jobs to store.');
        return;
      }

      this.jobService.storeJobs(this.jobs).subscribe({
        next: () => console.log('Jobs stored successfully'),
        error: err => console.error('Store failed:', err)
      });
    },
    error: err => {
      console.error(err);
      this.isLoading = false;
    }
  });
}


   showJobDetail(job: Job): void {
    this.selectedJob = job;
  }

    resetForm() {
      this.keyword = '';
      this.location = '';
      this.submitted = false;
    }*/

      onSearch(): void {
    this.submitted = true;
    if (!this.keyword || !this.location) {
      return;
    }

    this.isLoading = true;
    this.jobs = [];

    // Step 1: Search Pinecone for similar embeddings
    this.jobService.searchPinecone(this.keyword, this.location).subscribe({
      next: (pineconeResults: any[]) => {
        if (pineconeResults && pineconeResults.length > 0) {
          this.processJobs(pineconeResults);
          this.isLoading = false;
        } else {
          // Step 2: No results from Pinecone, fallback to Serapi
          this.jobService.searchSerapi(this.keyword, this.location).subscribe({
            next: (serapiResults: any[]) => {
              this.processJobs(serapiResults);
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Serapi fetch error:', err);
              this.isLoading = false;
            }
          });
        }
      },
      error: (err) => {
        console.error('Pinecone search error:', err);
        // Fallback to Serapi on Pinecone error
        this.jobService.searchSerapi(this.keyword, this.location).subscribe({
          next: (serapiResults: any[]) => {
            this.processJobs(serapiResults);
            this.isLoading = false;
          },
          error: (serapiErr) => {
            console.error('Serapi fetch error:', serapiErr);
            this.isLoading = false;
          }
        });
      }
    });
  }

  private processJobs(rawJobs: any[]) {
    if (!rawJobs || rawJobs.length === 0) {
      console.warn('No jobs found.');
      this.jobs = [];
      return;
    }

    const jobs = rawJobs.map(job => ({
      id: uuidv4(),
      title: job.title ?? "",
      company: job.company ?? "",
      location: job.location ?? "",
      description: job.description ?? "",
      apply_link: job.apply_link ?? "",
      thumbnail: job.thumbnail ?? "",
      posted: job.posted ?? "",
      via: job.via ?? "",
      postedDays: this.extractPostedDays(job.posted ?? "")
    }));
    const storeJobs = rawJobs.map(job => ({
      id: uuidv4(),
      title: job.title ?? "",
      company: job.company ?? "",
      location: job.location ?? "",
      description: job.description ?? "",
      apply_link: job.apply_link ?? "",
      thumbnail: job.thumbnail ?? "",
      posted: job.posted ?? "",
      via: job.via ?? ""
    }));
    
    // Sort jobs by postedDays ascending (newest first)
    this.jobs = jobs.sort((a, b) => a.postedDays - b.postedDays);
    this.storeJobs = storeJobs;
    // Store jobs in backend or local storage
    console.log(this.storeJobs);
    this.jobService.storeJobs(this.storeJobs).subscribe({
      next: () => console.log('Jobs stored successfully'),
      error: err => console.error('Store failed:', err)
    });
  }

  showJobDetail(job: Job): void {
    this.selectedJob = job;
  }

  resetForm() {
    this.keyword = '';
    this.location = '';
    this.submitted = false;
    this.jobs = [];
  }

  closeModal(): void {
    this.selectedJob = null;
  }
}
