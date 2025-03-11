# **Sistema de Gerenciamento e Lançamento de Horas**
## **Índice**

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
  - [Dependências do Backend](#dependências-do-backend)
  - [Dependências do Frontend](#dependências-do-frontend)
- [Como rodar o projeto](#como-rodar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
  - [Instalação e execução](#instalação-e-execução)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [Contribuição](#contribuição)
- [Licença](#licença)
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
- Java 23
- Spring Boot 3.4.2
- JWT para autenticação

### **Frontend**:
- Angular 16.2.16
- Node 18.20.6
- Angular Material para UI

### **Banco de Dados**:
- MySQL

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

## **Como rodar o projeto**
### **Pré-requisitos**
Para executar o projeto localmente, é necessário ter instalado:

- [Java 23](https://openjdk.org/projects/jdk/23/)
- [Node.js](https://nodejs.org/) (versão 18.20.6)
- [MySQL](https://www.mysql.com/)
- [Angular CLI](https://angular.io/cli) (versão 16.2.16)
- [Maven](https://maven.apache.org/)

### **Configuração do Banco de Dados**
1. Abra o MySQL Workbench ou terminal MySQL
2. Execute os seguintes comandos SQL:

```sql
CREATE DATABASE sistema_gerenciamento_bd;
USE sistema_gerenciamento_bd;

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_login DATETIME,
    perfil ENUM('ADMIN', 'USUARIO') NOT NULL,
    ativo ENUM('ATIVO', 'INATIVO') DEFAULT 'ATIVO',
    deleted_at DATETIME NULL
);

CREATE TABLE clientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
    deleted_at DATETIME NULL
);

CREATE TABLE projetos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status ENUM('PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO') NOT NULL,
    id_usuario_responsavel BIGINT,
    horas_estimadas INT NOT NULL DEFAULT 0,
    custo_estimado DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tempo_registrado DECIMAL(10,2) NOT NULL DEFAULT 0,
    custo_registrado DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    prioridade ENUM('ALTA', 'MEDIA', 'BAIXA') NOT NULL,
    id_cliente BIGINT,
    deleted_at DATETIME NULL,
    FOREIGN KEY (id_usuario_responsavel) REFERENCES usuarios(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

CREATE TABLE tarefas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_projeto BIGINT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status ENUM('ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA', 'PAUSADA') NOT NULL,
    id_usuario_responsavel BIGINT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    horas_estimadas DECIMAL(10,2) NOT NULL DEFAULT 0,
    tempo_registrado DECIMAL(10,2) NOT NULL DEFAULT 0,
    valor_por_hora DECIMAL(10, 2),
    custo_registrado DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    deleted_at DATETIME NULL,
    FOREIGN KEY (id_projeto) REFERENCES projetos(id),
    FOREIGN KEY (id_usuario_responsavel) REFERENCES usuarios(id)
);

CREATE TABLE lancamentos_horas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_tarefa BIGINT NOT NULL,
    id_usuario BIGINT NOT NULL,
    id_projeto BIGINT NOT NULL,
    horas DECIMAL(5,2) NOT NULL,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    descricao TEXT,
    status ENUM('EM_ANALISE', 'APROVADO', 'REPROVADO') NOT NULL DEFAULT 'EM_ANALISE',
    FOREIGN KEY (id_tarefa) REFERENCES tarefas(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_projeto) REFERENCES projetos(id)
);

CREATE TABLE usuarios_projetos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT,
    id_projeto BIGINT,
    data_associacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_projeto) REFERENCES projetos(id),
    UNIQUE (id_usuario, id_projeto)
);
```

### **Instalação e execução**
1. Clone o repositório:

```bash
git clone https://github.com/tiagogorridev/projeto-gerenciamento-angular.git
cd projeto-gerenciamento-angular
```

2. Configure o backend:

```bash
cd backend

# Configure as variáveis de ambiente
export DB_URL=jdbc:mysql://localhost:3306/sistema_gerenciamento_bd
export DB_USERNAME=seu_usuario
export DB_PASSWORD=sua_senha

# Alternativa: Crie um arquivo application.properties na pasta src/main/resources com o conteúdo:
# spring.datasource.url=jdbc:mysql://localhost:3306/sistema_gerenciamento_bd
# spring.datasource.username=seu_usuario
# spring.datasource.password=sua_senha
# spring.jpa.hibernate.ddl-auto=validate

# Compile e execute o backend
mvn clean install
mvn spring-boot:run
```

3. Configure e execute o frontend:

```bash
cd ../frontend

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
ng serve
```

4. Acesse a aplicação em seu navegador:
   - Frontend: http://localhost:4200
   - API Backend: http://localhost:8080
   - Documentação da API: http://localhost:8080/swagger-ui.html

## **Estrutura do Banco de Dados**

O sistema utiliza um banco de dados relacional com as seguintes entidades principais:

- **Usuários**: Armazena dados dos usuários (administradores e usuários regulares)
- **Clientes**: Registro de clientes associados aos projetos
- **Projetos**: Informações sobre os projetos, incluindo prazos e custos
- **Tarefas**: Subdivide projetos em tarefas específicas
- **Lançamentos de Horas**: Registra horas trabalhadas por usuário/tarefa
- **Usuários-Projetos**: Relação de muitos para muitos entre usuários e projetos

## **Contribuição**
Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## **Licença**
Este projeto está licenciado sob a [MIT License](LICENSE).

## **Contato**
Para mais informações, entre em contato:
- Email: contato@exemplo.com
- GitHub: [tiagogorridev](https://github.com/tiagogorridev)
