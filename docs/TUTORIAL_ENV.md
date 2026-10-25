# 📋 Guia de Configuração do `.env` via Código e Scripts (IaC)

Este tutorial ensina como configurar o ambiente do **SobrietyChain dApp** adotando a estratégia de **Infraestrutura como Código (IaC)**: utilizando comandos de terminal e scripts automatizados em TypeScript, eliminando cliques manuais em painéis visuais.

---

## ⚡ Fluxo Rápido: Setup Completo em 5 Passos

```bash
# 1. Autenticar no Thirdweb com sua conta do GitHub
npx thirdweb login

# 2. Copiar o template de variáveis
cp .env.example .env

# 3. Gerar uma carteira nova e segura de testes (Gera o ADMIN_PRIVATE_KEY)
npm run create-wallet

# 4. Rodar o script de deploy automatizado do contrato (Preenche o .env sozinho)
export ADMIN_PRIVATE_KEY="0x_chave_privada_gerada_no_passo_anterior"
npm run deploy:contract

# 5. Sincronizar as variáveis com o GitHub Pages via GitHub CLI
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

### Passo 1: Autenticar o Terminal com `thirdweb login` e Criar o Projeto

No seu terminal, execute o comando de login:

```bash
npx thirdweb login
# ou simplesmente: thirdweb login (se instalado globalmente)
```

1. **O navegador abrirá automaticamente** na página do Thirdweb.
2. Como você já conectou seu GitHub, o Thirdweb abrirá uma janela modal chamada **"Create Project"** (Criar Projeto).
3. **Preencha exatamente os campos dessa janela:**

```text
┌────────────────────────────────────────────────────────┐
│ Create Project                                      [X]│
├────────────────────────────────────────────────────────┤
│ Project Name:                                          │
│ [ SobrietyChain                                      ] │
│                                                        │
│ Allowed Domains:                 [ ] Allow all domains │
│ [ localhost:5173, *.github.io                        ] │
│                                                        │
│   (Dica: você também pode marcar "Allow all domains"   │
│    para facilitar durante a fase de desenvolvimento)   │
│                                                        │
│ [Cancel]                                    [ Create ] │
└────────────────────────────────────────────────────────┘
```

4. **Clique no botão branco "Create":**
   - O projeto será criado instantaneamente.
   - O navegador exibirá a página do projeto recém-criado com o seu **Client ID** e um botão de cópia ao lado.
   - **Copie o Client ID** (um texto parecido com `9b821a37c04e28e1...`).
5. **No terminal:** O terminal exibirá a mensagem de confirmação de que o login foi concluído com sucesso.

---

### Passo 2: Inicializar o Arquivo `.env` e Inserir o Client ID

1. Crie sua cópia local a partir do modelo do repositório:
   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` e cole o seu **Client ID** copiado no passo anterior:
   ```env
   VITE_THIRDWEB_CLIENT_ID=seu_client_id_copiado_aqui
   ```
   *(Ou exporte no seu terminal com: `export VITE_THIRDWEB_CLIENT_ID="seu_client_id_copiado_aqui"`)*.

---

---

### Passo 3: Como Conseguir a Chave Privada de Testes (`ADMIN_PRIVATE_KEY`)

A `ADMIN_PRIVATE_KEY` é a chave criptográfica que assina a criação do contrato inteligente na rede **Base Sepolia**.

> [!CAUTION]
> **REGRA DE OURO DE SEGURANÇA:**
> - **NUNCA** use sua carteira pessoal principal (que guarda dinheiro ou criptomoedas reais).
> - Crie e use uma carteira **NOVA e EXCLUSIVA** apenas para desenvolvimento/testes.

Você pode obter essa chave de duas formas:

#### Opção A: Gerar uma Carteira Nova no Terminal com 1 Comando (Recomendado)
Criamos um script que gera uma carteira segura para você instantaneamente:

```bash
npm run create-wallet
```

O terminal exibirá:
1. **Endereço Público (0x...):** Para onde você enviará o ETH gratuito de teste.
2. **Chave Privada (0x...):** A chave que você usará no comando `export ADMIN_PRIVATE_KEY="0x..."`.

#### Opção B: Exportar do MetaMask (Conta Secundária)
Se você já utiliza o MetaMask:
1. Abra o MetaMask no navegador.
2. Clique no seletor de contas no topo $\rightarrow$ **"Adicionar conta"** $\rightarrow$ Nomeie como `Dev Base Sepolia`.
3. Clique nos três pontinhos verticais (`⋮`) ao lado do nome da conta $\rightarrow$ **"Detalhes da conta"**.
4. Clique em **"Mostrar chave privada"**, digite a senha da sua carteira e confirme.
5. Copie a sequência hexadecimal exibida (começando ou não com `0x`).

---

### Passo 4: Como Obter Saldo Gratuito de Teste (Faucet da Base Sepolia)

Para que sua carteira de testes consiga registrar o contrato na rede Base Sepolia, ela precisa de uma fração minúscula de ETH de teste (custa **R$ 0,00**):

1. Copie o **Endereço Público** da sua carteira de testes (o endereço que começa com `0x...`, **NÃO** a chave privada).
2. Acesse uma das torneiras públicas gratuitas:
   - 🚰 [Base Faucet Oficial](https://www.base.org/faucets) (ou [basefaucet.com](https://basefaucet.com))
   - 🚰 [Chainlink Sepolia Faucet](https://faucets.chain.link)
   - 🚰 [Superchain Faucet](https://console.optimism.io/faucet)
3. Cole seu endereço público e solicite os fundos de teste. Em poucos segundos você receberá ETH de teste na Base Sepolia.

---

### Passo 5: Deploy do Contrato e Preenchimento Automático de `VITE_EDITION_DROP_ADDRESS`

Agora que você tem a chave de testes e fundos de faucet, faça o deploy com:

```bash
# 1. Defina a chave privada da carteira de testes
export ADMIN_PRIVATE_KEY="0x_sua_chave_privada_gerada_acima"

# 2. Execute o script de deploy automatizado
npm run deploy:contract
```

#### O que o script faz com o `VITE_EDITION_DROP_ADDRESS`:
O script se conecta à rede Base Sepolia, publica o contrato inteligente e **edita o arquivo `.env` para você automaticamente**, substituindo o endereço zerado pelo endereço real do contrato recém-criado:

```text
📄 Arquivo .env verificado com sucesso.
🚀 Iniciando deploy do contrato Edition Drop na rede: Base Sepolia...
👤 Carteira Administradora: 0x9812...4b1F
🎉 Contrato deployado com sucesso!
📍 Endereço na Base Sepolia: 0x83A648B1b62b08384914c1737F9bF1B1a798939c
✅ Arquivo .env atualizado com o endereço do contrato automaticamente!
```

---

## 🔍 Onde Achar o `VITE_EDITION_DROP_ADDRESS` no Dashboard Manualmente?

Caso você prefira copiar o endereço do contrato manualmente através da interface web do Thirdweb em vez do script:

1. Acesse: [thirdweb.com/dashboard/contracts](https://thirdweb.com/dashboard/contracts)
2. Clique no seu contrato **SobrietyChain** (tipo *Edition Drop*).
3. No topo da página, logo abaixo do nome do contrato, localize o endereço hexadecimal com o ícone de cópia:

```text
┌──────────────────────────────────────────────────────────────┐
│  SobrietyChain - Marcos de Sobriedade                        │
│                                                              │
│  0x83A648B1b62b08384914c1737F9bF1B1a798939c  [📋 Copiar]    │
│  Base Sepolia (Chain ID: 84532)                              │
└──────────────────────────────────────────────────────────────┘
```

4. Clique no ícone de cópia ao lado de `0x83A6...`.
5. Abra o arquivo `.env` na raiz do projeto e cole o endereço:

```env
VITE_EDITION_DROP_ADDRESS=0x83A648B1b62b08384914c1737F9bF1B1a798939c
```

---

### Passo 6: Sincronizar Secrets com o GitHub Pages via Terminal (GitHub CLI)

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

### Passo 7: Testar Localmente e Publicar

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
