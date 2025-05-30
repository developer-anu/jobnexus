import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow" [@fadeIn]>
      <div class="container-fluid">
        <a class="navbar-brand fw-bold fs-3" href="#">JobNexus</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="#searchJobs">Search Jobs</a></li>
            <li class="nav-item"><a class="nav-link" href="#recommendedJobs">Recommendations</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-link {
      font-size: 1.1rem;
      margin-left: 1rem;
    }
  `]
})
export class HeaderComponent { }
