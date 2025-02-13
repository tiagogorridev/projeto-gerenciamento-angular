import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivitiesService } from '../../../core/auth/services/activities.service'; // Certifique-se de ter importado corretamente

@Component({
  selector: 'app-edit-projects',
  templateUrl: './edit-projects.component.html', // Certifique-se de que o caminho está correto
  styleUrls: ['./edit-projects.component.scss']
})
export class EditProjectsComponent implements OnInit {
  activities: any[] = [];  // Tipo explícito
  showNewActivityModal = false;
  activity = {
    nome: '',
    membros: '',
    config: ''
  };
  hasActivities = false;

  constructor(private activitiesService: ActivitiesService, private router: Router) {}

  ngOnInit() {
    this.fetchActivities();
  }

  fetchActivities() {
    this.activitiesService.getActivities().subscribe(
      (activities: any[]) => {  // Tipagem explícita
        this.activities = activities;
        this.hasActivities = activities.length > 0;
      },
      (error: any) => {  // Tipagem explícita
        console.error('Error fetching activities', error);
      }
    );
  }

  openNewActivityModal() {
    this.showNewActivityModal = true;
  }

  closeModal() {
    this.showNewActivityModal = false;
  }

  onSubmit(form: any) {  // Tipagem explícita
    if (form.valid) {
      this.activitiesService.createActivity(this.activity).subscribe(
        (newActivity: any) => {  // Tipagem explícita
          this.activities.push(newActivity);
          this.closeModal();
        },
        (error: any) => {  // Tipagem explícita
          console.error('Error creating activity', error);
        }
      );
    }
  }

  navigateToEditActivity(nome: string) {
    this.router.navigate(['/edit-activity', nome]);
  }
}
