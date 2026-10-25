# 💻 Guia 100% via Código: Setup do SobrietyChain sem Interface Visual

Este guia foi elaborado para desenvolvedores que preferem operar via **terminal e código (Infrastructure as Code - IaC)**, eliminando cliques no Thirdweb Dashboard e no GitHub.

---

## 🚀 Fluxo Rápido em 3 Comandos

```bash
# 1. Autenticar no Thirdweb via GitHub (Apenas 1 vez)
npx thirdweb login

# 2. Deploy do contrato Edition Drop na Base Sepolia e auto-preenchimento do .env
npm run deploy:contract

# 3. Configurar os Secrets do GitHub Pages direto pelo terminal
gh secret set -f .env
```

## 📦 Como Instalar a CLI do Thirdweb

Você tem duas opções simples:

1. **Sem instalar nada (via `npx`):** O Node.js executa sob demanda automaticamente:
   ```bash
   npx thirdweb login
   ```
2. **Instalação global no sistema:**
   ```bash
   npm install -g thirdweb
   # Após instalar globalmente, você pode executar diretamente:
   thirdweb login
   ```

---

## 🛠️ Passo a Passo Detalhado

### 1. Autenticar no Thirdweb pelo Terminal
Como você já conectou sua conta do GitHub ao Thirdweb:

```bash
npx thirdweb login
```

- Uma janela rápida será aberta para validar seu token de autorização.
- Uma vez autenticado, o Thirdweb salvará suas credenciais localmente em `~/.thirdweb`.

---

### 2. Obter o Client ID via CLI ou API
Você pode visualizar suas chaves ou projetos usando a CLI:

```bash
# Ou gerar uma nova chave diretamente caso necessário
npx thirdweb api keys
```

Insira o seu `VITE_THIRDWEB_CLIENT_ID` no seu `.env` (ou exporte no terminal):

```bash
export VITE_THIRDWEB_CLIENT_ID="seu_client_id"
```

---

### 3. Deploy do Contrato e Preenchimento Automático do `.env`

Criamos o script [`scripts/deploy-contract.ts`](../scripts/deploy-contract.ts) que:
1. Conecta-se à rede **Base Sepolia** (ou Base Mainnet);
2. Faz o deploy do contrato **Edition Drop (ERC-1155)** com os parâmetros oficiais do SobrietyChain;
3. Captura o endereço do contrato recém-gerado;
4. **Escreve automaticamente o valor em `VITE_EDITION_DROP_ADDRESS` dentro do seu `.env`**.

Basta rodar:

```bash
# Defina a chave privada que assinará a criação do contrato (apenas para o deploy)
export ADMIN_PRIVATE_KEY="0x_sua_chave_privada_de_testnet"

# Executa o deploy programático
npm run deploy:contract
```

Ao finalizar, seu arquivo `.env` estará automaticamente preenchido:
```env
VITE_THIRDWEB_CLIENT_ID=seu_client_id
VITE_EDITION_DROP_ADDRESS=0x_endereco_gerado_pelo_script
VITE_ACTIVE_CHAIN=base-sepolia
```

---

### 4. Configurar os Secrets do GitHub Pages via Terminal (GitHub CLI)

Se você tem a ferramenta oficial da GitHub instalada (`gh`), **não precisa abrir o site do GitHub** para colar secrets:

```bash
# Faz o upload de todas as variáveis do seu .env local para os Secrets do GitHub
gh secret set -f .env
```

Ou de forma individual:

```bash
gh secret set VITE_THIRDWEB_CLIENT_ID -b "seu_client_id"
gh secret set VITE_EDITION_DROP_ADDRESS -b "0x_endereco_do_contrato"
gh secret set VITE_ACTIVE_CHAIN -b "base-sepolia"
```

---

### 5. Testar e Subir

Agora basta rodar localmente ou enviar para a branch `main`:

```bash
# Testar localmente
npm run dev

# Disparar o deploy para o GitHub Pages
git add .
git commit -m "chore: setup de ambiente via código"
git push origin main
```
