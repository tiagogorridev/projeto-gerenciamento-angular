# **Sistema de Gerenciamento e Lançamento de Horas**
## **Índice**

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
  - [Dependências do Backend](#dependências-do-backend)
  - [Dependências do Frontend](#dependências-do-frontend)
- [Como acessar o sistema](#como-acessar-o-sistema)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [Contato](#contato)

## **Sobre o projeto**
Este sistema foi desenvolvido para automatizar e otimizar o processo de gerenciamento de projetos e lançamento de horas trabalhadas. A aplicação oferece uma interface intuitiva tanto para administradores quanto para usuários regulares, permitindo o acompanhamento eficiente de projetos, tarefas e horas dedicadas.

## **Funcionalidades**

### **Administrador**
- Dashboard com gráficos e detalhes
- Gerenciamento completo de projetos (criar, editar, atualizar, excluir e filtrar)
- Gerenciamento completo de tarefas (criar, editar, atualizar, excluir e filtrar)
- Gestão de usuários (criar, inativar, reativar e filtrar)
- Gestão de clientes (criar, inativar, reativar e filtrar)
- Relatórios detalhados de projetos e tarefas
- Aprovação de horas registradas pelos usuários
- Alocação de usuários em projetos
- Atualização de informações pessoais
- Canal de suporte

### **Usuário**
- Dashboard personalizado
- Visualização e filtragem de projetos atribuídos
- Visualização de tarefas designadas
- Acesso a relatórios de projetos e tarefas
- Registro de horas trabalhadas
- Histórico de horas lançadas
- Atualização de informações pessoais
- Canal de suporte

## **Tecnologias utilizadas**
### **Backend**:
- Java 17
- Spring Boot 3.4.2
- JWT para autenticação

### **Frontend**:
- Angular 16.2.16
- Node 18.20.6
- Angular Material para UI

### **Banco de Dados**:
- MySQL
- Gerenciado via DBeaver

### **Gerenciamento de pacotes**:
- npm 10.8.2
- Maven

### **Dependências do Backend**
- **Spring Boot Starter Data JPA**: Integração com banco de dados
- **Spring Boot Starter Validation**: Validação de dados de entrada
- **Spring Boot Starter Web**: Criação de APIs RESTful
- **MySQL Connector/J**: Conector para MySQL
- **Spring Boot Starter Security**: Gerenciamento de autenticação e autorização
- **JJWT**: Implementação de JSON Web Tokens
- **Spring Boot Starter Test**: Suporte para testes automatizados
- **Spring Boot Starter Mail**: Envio de e-mails
- **Jakarta Mail API**: Integração de e-mails
- **Springdoc OpenAPI**: Documentação automática da API

### **Dependências do Frontend**
- **Angular CLI**: Ferramenta para desenvolvimento Angular
- **RxJS**: Programação reativa
- **Angular Material**: Componentes UI
- **NgRx**: Gerenciamento de estado

## **Como acessar o sistema**
O sistema está hospedado no Heroku e pode ser acessado pelos seguintes links:

- **Frontend**: [Sistema de Horas - Frontend](https://sistema-horas-front-c24bebf44baf.herokuapp.com/admin/admin-projetos)
- **Backend (API)**: [Sistema de Horas - Backend](https://sistema-horas-a6e4955506b7.herokuapp.com/)
- **Documentação da API**: [Swagger UI](https://sistema-horas-a6e4955506b7.herokuapp.com/swagger-ui/index.html)
- Dica: Para pegar um Bear Token, basta acessar o console!

### **Credenciais de acesso**
- **Login de Administrador:**
  - Email: tiagogorri@gmail.com
  - Senha: tiago123

- **Login de Usuário:**
  - Email: pedrosilva@gmail.com
  - Senha: pedro123

## **Estrutura do Banco de Dados**

O sistema utiliza um banco de dados relacional com as seguintes entidades principais:

- **Usuários**: Armazena dados dos usuários (administradores e usuários regulares)
- **Clientes**: Registro de clientes associados aos projetos
- **Projetos**: Informações sobre os projetos, incluindo prazos e custos
- **Tarefas**: Subdivide projetos em tarefas específicas
- **Lançamentos de Horas**: Registra horas trabalhadas por usuário/tarefa
- **Usuários-Projetos**: Relação de muitos para muitos entre usuários e projetos

## **Contato**
Para mais informações, entre em contato:
- Email: tiagogorri@gmail.com
- GitHub: [tiagogorridev](https://github.com/tiagogorridev)

