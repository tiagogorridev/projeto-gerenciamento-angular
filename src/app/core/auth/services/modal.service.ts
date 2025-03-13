import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from './../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openModalSubject = new Subject<void>();
  openModal$ = this.openModalSubject.asObservable();

  openModal() {
    this.openModalSubject.next();
  }
}
