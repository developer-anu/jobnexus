import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-user-preferences',
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],
  template: `
    <div [@slideIn]>
      <form [formGroup]="preferencesForm" (ngSubmit)="onSubmit()" class="p-4 border rounded shadow-sm bg-light">
        <div class="mb-3">
          <label class="form-label fw-bold">Skills</label>
          <input type="text" class="form-control" formControlName="skills" placeholder="e.g., Angular, Python, AWS" />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Preferred Job Titles</label>
          <input type="text" class="form-control" formControlName="jobTitles" placeholder="e.g., Frontend Developer" />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Location</label>
          <input type="text" class="form-control" formControlName="location" placeholder="e.g., Remote, New York" />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Remote Work Preference</label>
          <select class="form-select" formControlName="remote">
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Experience Level</label>
          <select class="form-select" formControlName="experience">
            <option value="">Select...</option>
            <option value="fresher">Fresher</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary mt-3">Save Preferences</button>
      </form>
    </div>
  `
})
export class UserPreferencesComponent {
  preferencesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.preferencesForm = this.fb.group({
      skills: [''],
      jobTitles: [''],
      location: [''],
      remote: [''],
      experience: ['']
    });
  }

  onSubmit() {
    console.log('User Preferences:', this.preferencesForm.value);
    // TODO: Pass to backend or use in job recommendation
  }
}
