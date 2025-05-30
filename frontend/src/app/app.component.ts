import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { UserPreferencesComponent } from '../components/user-preferences/user-preferences.component';
import { JobSearchComponent } from '../components/job-search/job-search.component';
import { RecommendationsComponent } from '../components/recommendations/recommendations.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [HeaderComponent, UserPreferencesComponent, JobSearchComponent, RecommendationsComponent],
  template: `
    <app-header></app-header>

    <div class="container my-5">
      <app-job-search></app-job-search>      
      <app-recommendations></app-recommendations>
      <section id="preferences" class="my-5">
        <h2 class="mb-4">User Preferences</h2>
        <app-user-preferences></app-user-preferences>
      </section>

      <!-- Other sections will follow -->
    </div>
  `
})
export class AppComponent {}
