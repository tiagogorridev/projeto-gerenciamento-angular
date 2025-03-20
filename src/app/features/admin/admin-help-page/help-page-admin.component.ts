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
  selector: 'app-help-page-admin',
  templateUrl: './help-page-admin.component.html',
  styleUrls: ['./help-page-admin.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class HelpPageAdminComponent implements OnInit {
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
      answer: 'Para mudar sua senha, clique em "Meu Perfil" e na aba "Segurança" altere sua senha.',
      isOpen: false
    },
    {
      category: 'account',
      question: 'Como adicionar um novo usuário?',
      answer: 'Clique em "Gerenciar Usuários" e depois em "Adicionar Novo". Preencha as informações necessárias e defina as permissões apropriadas.',
      isOpen: false
    },
    {
      category: 'projects',
      question: 'Como criar um novo projeto?',
      answer: 'Clique em "Projetos" e depois em "Novo Projeto", preencha as informações básicas como nome e descrição, e adicione os membros da equipe.',
      isOpen: false
    },
    {
      category: 'reports',
      question: 'Como exportar relatórios?',
      answer: 'Na seção de relatórios, selecione o período desejado e clique em "Exportar". Você pode escoler entre formatos PDF.',
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
