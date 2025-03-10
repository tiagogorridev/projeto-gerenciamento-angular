import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _darkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this._darkMode.asObservable();

  constructor() {
    // Carregar tema salvo ao iniciar o serviço
    const savedTheme = localStorage.getItem('theme') || 'light';
    this._darkMode.next(savedTheme === 'dark');
    this.applyTheme(savedTheme === 'dark');
  }

  toggleDarkMode(): void {
    const newMode = !this._darkMode.value;
    this._darkMode.next(newMode);

    // Salvar no localStorage
    localStorage.setItem('theme', newMode ? 'dark' : 'light');

    // Aplicar o tema
    this.applyTheme(newMode);
  }

  private applyTheme(isDark: boolean): void {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // Adicionar ou remover uma classe no body para estilizações CSS
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    // Log para depuração
    console.log('Tema alterado para:', isDark ? 'dark' : 'light');
  }
}
