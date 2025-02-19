import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../core/auth/services/auth.service';

interface FaqItem {
  category: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class HelpPageComponent implements OnInit {
  searchQuery: string = '';
  selectedCategory: string = 'all';
  isAdmin = false;

  constructor(
    private authService: AuthService
  ) {}

  categories: Category[] = [
    { id: 'all', name: 'Todas', icon: 'fa-globe' },
    { id: 'account', name: 'Conta', icon: 'fa-user' },
    { id: 'projects', name: 'Projetos', icon: 'fa-project-diagram' },
    { id: 'reports', name: 'Relatórios', icon: 'fa-chart-bar' },
  ];

  faqItems: FaqItem[] = [
    {
      category: 'account',
      question: 'Como posso resetar minha senha?',
      answer: 'Para resetar sua senha, clique em "Esqueci minha senha" na tela de login. Você receberá um email com instruções para criar uma nova senha.',
      isOpen: false
    },
    {
      category: 'account',
      question: 'Como adicionar um novo usuário?',
      answer: 'Acesse as configurações do sistema, clique em "Usuários" e depois em "Adicionar Novo". Preencha as informações necessárias e defina as permissões apropriadas.',
      isOpen: false
    },
    {
      category: 'projects',
      question: 'Como criar um novo projeto?',
      answer: 'Na dashboard, clique em "Novo Projeto", preencha as informações básicas como nome e descrição, e adicione os membros da equipe.',
      isOpen: false
    },
    {
      category: 'reports',
      question: 'Como exportar relatórios?',
      answer: 'Na seção de relatórios, selecione o período desejado e clique em "Exportar". Você pode escoler entre formatos PDF, Excel ou CSV.',
      isOpen: false
    }
  ];

  quickLinks = [
    { title: 'Documentação', icon: 'fa-book', description: 'Acesse nossos guias e tutoriais' },
    { title: 'Suporte', icon: 'fa-headset', description: 'Entre em contato com nossa equipe' },
    { title: 'Contate-nos', icon: 'fa-comments', description: 'Tire suas dúvidas preenchendo um formulário' }
  ];

  get filteredFaqs() {
    return this.faqItems.filter(item =>
      (this.selectedCategory === 'all' || item.category === this.selectedCategory) &&
      (this.searchQuery === '' ||
        item.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  toggleFaq(item: FaqItem) {
    item.isOpen = !item.isOpen;
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
  }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
  }
}
