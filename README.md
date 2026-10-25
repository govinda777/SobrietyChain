# 🕊️ Serena — Marcos de Sobriedade Web3

> *"Concedei-me, Senhor, a serenidade necessária para aceitar as coisas que não posso modificar, coragem para modificar aquelas que posso e sabedoria para distinguir umas das outras."*

O **Serena** é um dApp descentralizado e 100% estático voltado a membros e comunidades de recuperação comportamental (inspirado na tradição das fichas de **Alcoólicos Anônimos**). Ele permite que qualquer pessoa comemore seus marcos de sobriedade de forma anônima, perpétua e gratuita através de contratos inteligentes na rede **Base**.

---

## 💎 Características Principais

- **Hospedagem 100% Estática:** Arquitetura SPA em React + Vite + Tailwind CSS pronta para o **GitHub Pages** (sem backend intermediário).
- **Anonimato Absoluto:** Utiliza o **Thirdweb Embedded Wallets** (in-app wallets via e-mail, Google ou Passkey), sem nunca exigir nomes, documentos ou dados pessoais.
- **Gasless / Sem Custos (ERC-4337):** Transações patrocinadas via **Account Abstraction**, permitindo que o usuário resgate suas fichas sem ter saldo em ETH na carteira.
- **Contrato Edition Drop (ERC-1155):** Padrão eficiente em que cada Token ID representa um marco específico.

---

## 🏅 Mapeamento dos Marcos e Fichas

| Token ID | Marco | Raridade | Cor Representativa | Lema |
| :---: | :--- | :--- | :--- | :--- |
| **0** | **Ficha de 24 Horas** | Comum | Prata (`#94A3B8`) | *"Apenas por hoje."* |
| **1** | **Ficha de 30 Dias** | Incomum | Carmim (`#F43F5E`) | *"Um dia de cada vez."* |
| **2** | **Ficha de 90 Dias** | Rara | Âmbar (`#F59E0B`) | *"A clareza se consolida."* |
| **3** | **Ficha de 6 Meses** | Épica | Esmeralda (`#10B981`) | *"Renovação e Esperança."* |
| **4** | **Ficha de 1 Ano** | Lendária | Safira (`#3B82F6`) | *"Uma nova maneira de viver."* |

---

## 🛠️ Configuração do Thirdweb Dashboard (Passo a Passo)

Para colocar o dApp em pleno funcionamento com resgate on-chain e transações patrocinadas:

### 1. Criar API Key & Obter Client ID
1. Acesse o [Thirdweb Dashboard](https://thirdweb.com/dashboard/settings/api-keys).
2. Clique em **Create API Key**.
3. Dê um nome ao seu projeto (ex: `Serena-Sobriety`).
4. Em **Allowed Domains**, adicione:
   - `localhost:5173` (para desenvolvimento local)
   - `*.github.io` (para o GitHub Pages) ou o seu domínio personalizado.
5. Copie o seu **Client ID** (chave pública).

### 2. Fazer Deploy do Contrato Edition Drop (ERC-1155)
1. No dashboard da Thirdweb, acesse a aba **Contracts** > **Deploy Contract**.
2. Procure por **Edition Drop** (ou acesse diretamente `thirdweb.com/explore/drops`).
3. Clique em **Deploy Now**.
4. Preencha os metadados do contrato:
   - **Name:** `Serena - Marcos de Sobriedade`
   - **Symbol:** `SERENA`
   - **Network:** Selecione **Base Sepolia** (para testes) ou **Base** (para produção).
5. Confirme o deploy na sua carteira.
6. Copie o **endereço do contrato** gerado.

### 3. Cadastrar os 5 Tokens (Token IDs 0 a 4)
No painel do contrato recém-criado:
1. Vá na aba **NFTs** e clique em **Create / Lazy Mint**.
2. Cadastre em sequência cada um dos 5 marcos:
   - **Token ID 0:** Ficha de 24 Horas (inserir imagem da ficha prata)
   - **Token ID 1:** Ficha de 30 Dias (inserir imagem da ficha carmim)
   - **Token ID 2:** Ficha de 90 Dias (inserir imagem da ficha âmbar)
   - **Token ID 3:** Ficha de 6 Meses (inserir imagem da ficha esmeralda)
   - **Token ID 4:** Ficha de 1 Ano (inserir imagem da ficha safira)
3. Na aba **Claim Conditions** de cada token:
   - Defina o preço como **0 ETH** (gratuito).
   - Defina a quantidade máxima que cada carteira pode resgatar (ex: 1 por carteira ou livre).

### 4. Ativar o Patrocínio de Gas (Gasless / Account Abstraction)
1. No dashboard da Thirdweb, vá em **Account Abstraction** ou em **Settings** da sua API Key.
2. Ative a opção **Gas Sponsorship**.
3. Adicione fundos ao Paymaster de patrocínio (a Thirdweb oferece créditos gratuitos generosos para testnet e início em mainnet) ou vincule sua fatura para cobrir as taxas mínimas da rede Base.

---

## 💻 Executando Localmente

### Pré-requisitos
- **Node.js** v18 ou superior instalado.
- Gerenciador de pacotes **npm** ou **yarn**.

### Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/SEU-USUARIO/SobrietyChain.git
cd SobrietyChain

# 2. Instalar as dependências
npm install

# 3. Criar arquivo de configuração .env
cp .env.example .env
```

Abra o arquivo `.env` e preencha com suas credenciais:

```env
VITE_THIRDWEB_CLIENT_ID=seu_client_id_do_thirdweb
VITE_EDITION_DROP_ADDRESS=0x_seu_endereco_do_contrato
VITE_ACTIVE_CHAIN=base-sepolia
```

> 📖 **Precisa de ajuda para obter essas chaves?** Consulte nosso [**Tutorial Detalhado do `.env` (Passo a Passo)**](docs/TUTORIAL_ENV.md) com ilustrações do Thirdweb Dashboard e guia de resolução de dúvidas.


### Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Acesse a aplicação no navegador em `http://localhost:5173`.

---

## 🚀 Deploy Automatizado no GitHub Pages

O repositório já inclui o workflow do GitHub Actions em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### 1. Configurar Secrets no GitHub
No seu repositório no GitHub:
1. Vá em **Settings** > **Secrets and variables** > **Actions**.
2. Em **Repository secrets**, clique em **New repository secret** e adicione:
   - `VITE_THIRDWEB_CLIENT_ID`: Seu Client ID da Thirdweb.
   - `VITE_EDITION_DROP_ADDRESS`: Endereço do contrato Edition Drop.
   - `VITE_ACTIVE_CHAIN`: `base-sepolia` ou `base`.

### 2. Habilitar o GitHub Pages
1. No repositório, acesse **Settings** > **Pages**.
2. Na seção **Build and deployment**:
   - **Source:** Selecione `Deploy from a branch`.
   - **Branch:** Selecione `gh-pages` e a pasta `/ (root)`.
3. Clique em **Save**.

A cada `git push` na branch `main`, o GitHub Actions compilará os arquivos estáticos e fará o deploy automático na branch `gh-pages`.

---

## 🛡️ Privacidade e Tradições

O dApp Serena segue estritamente a tradição do anonimato:
- Nenhum dado pessoal é transmitido a servidores centrais.
- O histórico temporal do contador de 24 horas fica armazenado exclusivamente no `localStorage` do dispositivo do usuário.
- O login via e-mail/Google gera uma carteira criptográfica isolada por chave assimétrica via MPC (*Multi-Party Computation* da Thirdweb).
