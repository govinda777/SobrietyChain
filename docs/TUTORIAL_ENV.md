# 📋 Guia de Configuração do `.env` via Código e Scripts (IaC)

Este tutorial ensina como configurar o ambiente do **SobrietyChain dApp** adotando a estratégia de **Infraestrutura como Código (IaC)**: utilizando comandos de terminal e scripts automatizados em TypeScript, eliminando cliques manuais em painéis visuais.

---

## ⚡ Fluxo Rápido: Setup Completo em 4 Passos

```bash
# 1. Autenticar no Thirdweb com sua conta do GitHub
npx thirdweb login

# 2. Copiar o template de variáveis
cp .env.example .env

# 3. Rodar o script de deploy automatizado do contrato (Preenche o .env sozinho)
export ADMIN_PRIVATE_KEY="0x_sua_chave_privada_da_base_sepolia"
npm run deploy:contract

# 4. Sincronizar as variáveis com o GitHub Pages via GitHub CLI
gh secret set -f .env
```

---

## 📦 Como Instalar e Executar a CLI do Thirdweb

Você tem duas maneiras simples de executar o comando `thirdweb`:

### Opção A: Executar diretamente via `npx` (Sem precisar instalar nada)
O Node.js já vem com o utilitário `npx`. Basta rodar diretamente no terminal do projeto:
```bash
npx thirdweb login
```

### Opção B: Instalar Globalmente no seu computador
Se você preferir ter o comando `thirdweb` disponível em qualquer pasta do seu terminal sem precisar digitar `npx`:
```bash
# Instalar globalmente via npm
npm install -g thirdweb

# Verificar a instalação
thirdweb --version

# Agora você pode chamar direto:
thirdweb login
```

---

## 🛠️ Passo a Passo Detalhado (Estratégia por Código)

### Passo 1: Autenticar o Terminal com seu GitHub (Apenas 1 vez)

Como você já conectou sua conta do GitHub ao Thirdweb:

```bash
npx thirdweb login
# ou simplesmente: thirdweb login (se tiver instalado globalmente)
```

- O terminal abrirá uma janela rápida no navegador para você confirmar a permissão do seu GitHub.
- Uma vez autenticado, suas credenciais de desenvolvedor ficam salvas localmente em `~/.thirdweb`.

---

### Passo 2: Inicializar o Arquivo `.env` Local

Crie sua cópia local a partir do modelo do repositório:

```bash
cp .env.example .env
```

Defina o seu **Client ID** no arquivo `.env` (ou exporte no terminal):

```bash
# Você pode ver suas chaves via CLI ou no painel:
export VITE_THIRDWEB_CLIENT_ID="seu_client_id_aqui"
```

---

### Passo 3: Deploy do Contrato e Preenchimento Automático do `.env` via Script

Não é necessário entrar no dashboard para criar o contrato Edition Drop. Criamos um script que faz tudo por você: [`scripts/deploy-contract.ts`](../scripts/deploy-contract.ts).

O script executa as seguintes etapas programaticamente:
1. Conecta-se à rede **Base Sepolia** (ou **Base Mainnet**);
2. Faz o deploy do contrato **Edition Drop (ERC-1155)** com o nome e símbolo oficiais do SobrietyChain;
3. Captura o endereço do contrato recém-criado na blockchain;
4. **Escreve automaticamente o valor em `VITE_EDITION_DROP_ADDRESS` dentro do seu `.env`**.

#### Como Executar:

```bash
# 1. Defina a chave privada da carteira de testes que assinará a criação
export ADMIN_PRIVATE_KEY="0x_sua_chave_privada_de_testnet"

# 2. Execute o script automatizado
npm run deploy:contract
```

#### Saída Esperada no Terminal:

```text
📄 Arquivo .env verificado com sucesso.
🚀 Iniciando deploy do contrato Edition Drop na rede: Base Sepolia...
👤 Carteira Administradora: 0x9812...4b1F
🎉 Contrato deployado com sucesso!
📍 Endereço na Base Sepolia: 0x83A648B1b62b08384914c1737F9bF1B1a798939c
✅ Arquivo .env atualizado com o endereço do contrato automaticamente!
```

---

### Passo 4: Sincronizar Secrets com o GitHub Pages via Terminal (GitHub CLI)

Para que o deploy automático do GitHub Actions funcione sem precisar abrir as configurações do GitHub no navegador, use a **GitHub CLI (`gh`)**:

```bash
# Envia todas as chaves do seu .env local diretamente para os Secrets do repositório
gh secret set -f .env
```

Ou, se preferir enviar individualmente via terminal:

```bash
gh secret set VITE_THIRDWEB_CLIENT_ID -b "seu_client_id"
gh secret set VITE_EDITION_DROP_ADDRESS -b "0x_endereco_do_contrato"
gh secret set VITE_ACTIVE_CHAIN -b "base-sepolia"
```

---

### Passo 5: Testar Localmente e Publicar

```bash
# 1. Testar a aplicação rodando localmente
npm run dev
# Acesse no navegador: http://localhost:5173

# 2. Enviar alterações para a branch main (dispara deploy automático para gh-pages)
git add .
git commit -m "chore: configuracao do ambiente via scripts IaC"
git push origin main
```

---

## 📌 Tabela de Variáveis Geradas no `.env`

| Variável | Escopo | Obrigatória? | Descrição | Como é Preenchida |
| :--- | :--- | :---: | :--- | :--- |
| `VITE_THIRDWEB_CLIENT_ID` | Frontend | **Sim** | Identificador público da aplicação no Thirdweb. | Manual ou via `npx thirdweb login` |
| `VITE_EDITION_DROP_ADDRESS` | Frontend | **Sim** | Endereço do contrato Edition Drop (ERC-1155) na Base. | **Automático** via `npm run deploy:contract` |
| `VITE_ACTIVE_CHAIN` | Frontend | **Sim** | Rede ativa (`base-sepolia` ou `base`). | Padrão: `base-sepolia` |
| `ADMIN_PRIVATE_KEY` | Scripts / CI | Para Deploy | Chave privada que assina a criação do contrato. | `export ADMIN_PRIVATE_KEY="0x..."` |

> [!IMPORTANT]
> **Segurança:** O arquivo `.env` está incluído no `.gitignore` e **nunca** é enviado ao repositório público do GitHub. As chaves públicas (`VITE_*`) são compiladas com segurança apenas para o frontend estático.

---

## 📖 Apêndice: Método Alternativo via Dashboard Visual

Caso em algum momento você prefira fazer a configuração manualmente através do navegador:

1. **Obter Client ID:** Acesse [thirdweb.com/dashboard/settings/api-keys](https://thirdweb.com/dashboard/settings/api-keys) $\rightarrow$ Crie um projeto com nome `SobrietyChain` e configure Allowed Domains como `localhost:5173, *.github.io`.
2. **Deploy do Contrato:** Acesse [thirdweb.com/thirdweb.eth/DropERC1155](https://thirdweb.com/thirdweb.eth/DropERC1155) $\rightarrow$ Clique em **Deploy Now** na rede **Base Sepolia**.
3. **Copiar Endereço:** Copie o endereço `0x...` gerado no topo da página e cole na linha `VITE_EDITION_DROP_ADDRESS` do seu `.env`.

---

## 🔍 Resolução de Dúvidas (Troubleshooting)

### 1. `Erro: ADMIN_PRIVATE_KEY não definida`
- **Causa:** O script de deploy precisa de uma carteira para assinar a transação na blockchain da Base Sepolia.
- **Solução:** No seu terminal, digite: `export ADMIN_PRIVATE_KEY="0x_sua_chave"` antes de rodar `npm run deploy:contract`.

### 2. `Erro: Insufficient funds for gas` ao rodar o script de deploy
- **Causa:** A carteira da chave privada não possui saldo de ETH de teste na rede Base Sepolia.
- **Solução:** Obtenha ETH de teste gratuito em torneiras públicas da Base Sepolia (ex: [faucets.chain.link](https://faucets.chain.link) ou [basefaucet.com](https://basefaucet.com)) enviando para o endereço da sua carteira de testes.

### 3. Mensagem no dApp: *"CORS / Unauthorized Domain"*
- **Causa:** O domínio `localhost:5173` ou seu domínio no GitHub Pages não foi adicionado na lista de domínios permitidos da API Key.
- **Solução:** Adicione `localhost:5173, *.github.io` nas configurações de Allowed Domains do seu Client ID.
