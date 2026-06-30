# Front-end do Restaurante - PI3B

Este é o repositório front-end do projeto de restaurante (PI3B), desenvolvido utilizando **React**, **Vite** e configurado para suporte a **PWA**.

---

## 🚀 Passo a Passo para Execução

Após clonar o repositório, siga as etapas abaixo para instalar as dependências e rodar a aplicação localmente:

### 1. Navegar para a pasta do projeto
Entre no diretório do projeto clonado:
```bash
cd front-pi3b-restaurante
```

### 2. Instalar as dependências
Instale todos os pacotes necessários utilizando o npm:
```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento
Execute o projeto localmente em modo de desenvolvimento:
```bash
npm run dev
```

### 4. Acessar no navegador
Abra o seu navegador e acesse o endereço fornecido no terminal (geralmente [http://localhost:5173](http://localhost:5173)).

---

## 🛠️ Outros Comandos Úteis

* **Gerar build de produção:**
  ```bash
  npm run build
  ```
* **Visualizar a build de produção localmente:**
  ```bash
  npm run preview
  ```
* **Rodar o Linter (verificação de estilo/erros de código):**
  ```bash
  npm run lint
  ```

---

## 📁 Estrutura de Pastas

A estrutura básica do diretório `src/` está organizada da seguinte forma para facilitar a escalabilidade do projeto:

* **`public/`**: Arquivos estáticos disponibilizados diretamente na raiz do servidor (ex: ícones do PWA, manifestos, favicon).
* **`src/`**: Todo o código-fonte da aplicação React.
  * **`assets/`**: Imagens, logotipos, fontes e outros recursos estáticos de mídia.
  * **`components/`**: Componentes de interface do usuário comuns e reutilizáveis (botões, inputs, cards, modais).
  * **`hooks/`**: Custom hooks do React para compartilhar lógica de estado entre componentes.
  * **`pages/`**: Páginas ou telas completas da aplicação (ex: Cardápio, Dashboard, Carrinho).
  * **`routes/`**: Configurações de rotas e navegação da aplicação.
  * **`services/`**: Serviços de integração, configurações de clientes HTTP (ex: Axios) e requisições para a API.
  * **`store/`**: Gerenciamento de estado global (ex: Context API, Redux ou Zustand).
  * **`App.jsx`**: Componente raiz da aplicação React.
  * **`main.jsx`**: Ponto de entrada que inicializa e renderiza a aplicação na DOM.
  * **`index.css`**: Estilos CSS globais da aplicação.
