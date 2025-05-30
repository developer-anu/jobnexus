import { Component } from '@angular/core';
import { JobService } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { HighlightPipe } from '../../app/highlight.pipe';
import { Job } from '../../models/job.model';


type SortableJobFields = 'title' | 'company' | 'location';

@Component({
  selector: 'app-recommendations',
  imports: [CommonModule, FormsModule, HighlightPipe],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss',
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger('50ms', animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
          ],
          { optional: true }
        ),
        query(':leave', animate('200ms', style({ opacity: 0 })), { optional: true }),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ],
})

export class RecommendationsComponent {
  sortField: SortableJobFields = 'title';
  userQuery: string = '';
  recommendedJobs: Job[] = [];
  allRecommendedJobs: Job[] = [];
  filteredJobs: Job[] = [];
  selectedJob: Job | null = null;
  filterCompany = '';
  filterLocation = '';
  isLoading = false;
  submitted = false;
  constructor(private jobService: JobService) {}

  fetchRecommendations() {
    this.submitted = true;
    if (!this.userQuery.trim()){
      return;
    } 
    this.isLoading = true;
    this.jobService.getRecommendedJobs(this.userQuery).subscribe({
      next: (res) => {
        if (res.success) {
          this.recommendedJobs = res.data;
          this.allRecommendedJobs = res.data;
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to fetch recommendations:', err);
      }
    });
  }

  updateJobs(jobs: Job[]) {
    this.recommendedJobs = jobs;
    this.filterAndSortJobs();
  }
  resetForm() {
      this.userQuery = '';
      this.submitted = false;
    }

  filterAndSortJobs() {
    let jobs = [...this.allRecommendedJobs];

    if (this.filterCompany) {
      jobs = jobs.filter((job) => job.company.toLowerCase().includes(this.filterCompany.toLowerCase()));
    }

    if (this.filterLocation) {
      jobs = jobs.filter((job) => job.location.toLowerCase().includes(this.filterLocation.toLowerCase()));
    }

    if (this.sortField) {
      jobs.sort((a, b) => a[this.sortField].localeCompare(b[this.sortField]));
    }

    this.recommendedJobs = jobs;
    //this.filteredJobs = jobs;
  }

  showJobDetail(job: Job): void {
    this.selectedJob = job;
  }

  closeModal(): void {
    this.selectedJob = null;
  }
}
