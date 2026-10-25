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

### 1. Autenticar no Thirdweb e Criar o Projeto Inicial

Ao rodar o comando de login:

```bash
npx thirdweb login
# ou: thirdweb login
```

1. O navegador abrirá automaticamente.
2. Como seu GitHub já está conectado e sua equipe ainda não tem um projeto ativo, o Thirdweb abrirá a janela modal **"Create Project"**.
3. **Preencha os campos da janela:**
   - **Project Name:** `SobrietyChain`
   - **Allowed Domains:** `localhost:5173, *.github.io` *(ou marque a caixinha "Allow all domains")*
   - Clique no botão branco **"Create"**.
4. A página exibirá o seu **Client ID**. Copie este valor.
5. O terminal confirmará que a sessão foi autenticada.

---

### 2. Configurar o Client ID no `.env`

Cole o Client ID copiado no seu arquivo `.env`:

```env
VITE_THIRDWEB_CLIENT_ID=seu_client_id_copiado
```

*(Ou exporte no seu terminal com `export VITE_THIRDWEB_CLIENT_ID="seu_client_id_copiado"`)*.

---

### 3. Gerar a Carteira de Testes e Obter a Chave (`ADMIN_PRIVATE_KEY`)

Para assinar a criação do contrato na Base Sepolia, você precisa de uma chave privada de testes. **Nunca utilize sua carteira principal com dinheiro real.**

Gere uma carteira segura e descartável diretamente no terminal:

```bash
npm run create-wallet
```

O comando exibirá o seu **Endereço Público** e a **Chave Privada**.

> 🚰 **Solicite ETH de teste gratuito:** Cole o endereço público gerado em [base.org/faucets](https://www.base.org/faucets) ou [basefaucet.com](https://basefaucet.com) para receber frações de ETH de teste na Base Sepolia (custo zero).

---

### 4. Deploy do Contrato e Preenchimento Automático do `.env`

Criamos o script [`scripts/deploy-contract.ts`](../scripts/deploy-contract.ts) que:
1. Conecta-se à rede **Base Sepolia** (ou Base Mainnet);
2. Faz o deploy do contrato **Edition Drop (ERC-1155)** com os parâmetros oficiais do SobrietyChain;
3. Captura o endereço do contrato recém-gerado;
4. **Escreve automaticamente o valor em `VITE_EDITION_DROP_ADDRESS` dentro do seu `.env`**.

Basta rodar:

```bash
# 1. Defina a chave privada gerada no passo anterior
export ADMIN_PRIVATE_KEY="0x_sua_chave_privada_gerada_acima"

# 2. Executa o deploy programático
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
