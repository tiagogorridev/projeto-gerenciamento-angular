import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../../core/auth/services/auth.service';

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

  constructor(
    private authService: AuthService
  ) {}

  categories: Category[] = [
    { id: 'all', name: 'Todas', icon: 'pi pi-globe' },
    { id: 'account', name: 'Conta', icon: 'pi pi-user' },
    { id: 'projects', name: 'Projetos', icon: 'pi pi-folder-open' },
    { id: 'reports', name: 'Relatórios', icon: 'pi pi-chart-bar' },
  ];

  faqItems: FaqItem[] = [
    {
      category: 'account',
      question: 'Como posso mudar minha senha?',
      answer: 'Para mudar sua senha, clique em "Meu Perfil" -> "Segurança" e altere sua senha.',
      isOpen: false
    },
    {
      category: 'account',
      question: 'Como lançar horas?',
      answer: 'Acesse "Lançamento de Horas", preencha as informações necessárias e clique em "Enviar Lançamento".',
      isOpen: false
    },
    {
      category: 'projects',
      question: 'Como lançar horas diretamente em um projeto?',
      answer: 'Acesse "Projetos", clique no projeto que você deseja adicionar horas, clique no botão "Adicionar Horas" no canto direito e preencha as informações necessárias e clique em "Enviar Lançamento".',
      isOpen: false
    },
    {
      category: 'reports',
      question: 'Como exportar relatórios?',
      answer: 'Na seção de relatórios, selecione o período desejado e clique em "Exportar". Você pode escolher entre formatos PDF, Excel ou CSV.',
      isOpen: false
    }
  ];

  quickLinks = [
    { title: 'Acessar Configurações', icon: 'pi pi-cog', description: 'Clique aqui para acessar suas configurações' },
    { title: 'Suporte', icon: 'pi pi-headphones', description: 'Entre em contato com nossa equipe' },
    { title: 'Contate-nos', icon: 'pi pi-comments', description: 'Tire suas dúvidas preenchendo um formulário' }
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
  }
}
