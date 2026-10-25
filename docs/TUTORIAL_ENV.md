# 📋 Guia Passo a Passo: Configuração do Arquivo `.env`

Este tutorial orienta como obter e preencher corretamente todas as variáveis de ambiente necessárias para rodar o **SobrietyChain dApp** localmente e em produção no **GitHub Pages**.

> 💡 **Prefere fazer tudo via terminal e código sem acessar telas visuais?**  
> Veja nosso guia [**Setup 100% via Código (CLI e Scripts)**](SETUP_VIA_CODE.md).

---

## 📌 Tabela de Variáveis do Projeto

| Variável | Escopo | Obrigatória? | Descrição | Onde Obter |
| :--- | :--- | :---: | :--- | :--- |
| `VITE_THIRDWEB_CLIENT_ID` | Frontend | **Sim** | Identificador público da aplicação no Thirdweb. | [Thirdweb Dashboard](https://thirdweb.com/dashboard/settings/api-keys) |
| `VITE_EDITION_DROP_ADDRESS` | Frontend | **Sim** | Endereço do contrato Edition Drop (ERC-1155) na Base. | Página do Contrato no Thirdweb |
| `VITE_ACTIVE_CHAIN` | Frontend | **Sim** | Rede ativa (`base-sepolia` ou `base`). | Manual (`base-sepolia` por padrão) |
| `THIRDWEB_SECRET_KEY` | Scripts / CI | Apenas p/ Scripts | Chave secreta para automações e pinning no IPFS. | [Thirdweb Dashboard](https://thirdweb.com/dashboard/settings/api-keys) |
| `ADMIN_PRIVATE_KEY` | Scripts / CI | Apenas p/ Scripts | Chave da carteira que administra o contrato. | Exportada do MetaMask / Coinbase Wallet |

> [!IMPORTANT]
> **Regra de Segurança de Ouro:** O prefixo `VITE_` indica que a variável é embutida no código estático compilado da aplicação web. Portanto, **NUNCA** coloque chaves privadas (`PRIVATE_KEY`) ou chaves secretas (`SECRET_KEY`) com o prefixo `VITE_`.

---

## 🛠️ Passo 1: Criar o Arquivo Local

No terminal, na raiz do projeto `SobrietyChain`:

```bash
# Copia o modelo de exemplo para criar o arquivo real
cp .env.example .env
```

Abra o arquivo `.env` recém-criado em seu editor de código favorito.

---

## 🔑 Passo 2: Obter o `VITE_THIRDWEB_CLIENT_ID`

O **Client ID** permite que a aplicação utilize a infraestrutura do Thirdweb (Embedded Wallets, RPCs de alta velocidade e Paymaster para transações patrocinadas).

```
1. Acesse o Dashboard: https://thirdweb.com/dashboard
2. Conecte sua carteira (MetaMask, Coinbase ou Social).
3. No menu superior ou lateral, clique em "Settings" > "API Keys".
4. Clique no botão azul "+ Create API Key".
```

```
┌────────────────────────────────────────────────────────┐
│  Create API Key                                        │
├────────────────────────────────────────────────────────┤
│  Name: Serena Sobriety dApp                            │
│                                                        │
│  Allowed Domains (CORS):                               │
│  ├── http://localhost:5173      (para testes locais)   │
│  ├── http://localhost:3000                             │
│  └── https://*.github.io        (para o GitHub Pages)  │
│                                                        │
│  Enabled Services:                                     │
│  [X] Wallets / In-App Wallets                          │
│  [X] RPC & Bundler (Account Abstraction)               │
│  [X] Storage (IPFS)                                    │
└────────────────────────────────────────────────────────┘
```

5. Clique em **Next / Save**.
6. O dashboard exibirá duas informações:
   - **Client ID** (visível e público) $\rightarrow$ **Copie este valor**.
   - **Secret Key** (exibido apenas uma vez) $\rightarrow$ Guarde em seu gerenciador de senhas para uso em scripts.
7. Cole no seu `.env`:

```env
VITE_THIRDWEB_CLIENT_ID=seu_client_id_publico_aqui
```

---

## 📜 Passo 3: Obter o `VITE_EDITION_DROP_ADDRESS`

Este é o endereço do contrato inteligente que emite as fichas comemorativas na blockchain.

### Se você já fez o deploy do contrato:
1. Acesse a aba **Contracts** no [Thirdweb Dashboard](https://thirdweb.com/dashboard/contracts).
2. Selecione o contrato **Serena - Marcos de Sobriedade** (tipo *Edition Drop*).
3. No topo da página, ao lado do nome do contrato, clique no ícone de cópia para copiar o endereço hexadecimal (formato `0x...`).

### Se você ainda NÃO fez o deploy do contrato:
1. No Thirdweb Dashboard, vá em **Explore** > busque por **Edition Drop** (ou acesse diretamente [thirdweb.com/thirdweb.eth/DropERC1155](https://thirdweb.com/thirdweb.eth/DropERC1155)).
2. Clique no botão **Deploy Now**.
3. Preencha os campos básicos:
   - **Name:** `Serena - Marcos de Sobriedade`
   - **Symbol:** `SERENA`
   - **Network:** Escolha **Base Sepolia** (para testes gratuitos) ou **Base** (para produção).
4. Confirme a transação na sua carteira.
5. Copie o endereço gerado e adicione ao `.env`:

```env
VITE_EDITION_DROP_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

---

## 🌐 Passo 4: Definir a Rede Ativa (`VITE_ACTIVE_CHAIN`)

A variável `VITE_ACTIVE_CHAIN` define em qual rede Ethereum L2 a aplicação conectará os usuários:

### Opção A: Ambiente de Testes / Desenvolvimento (Recomendado)
Use **Base Sepolia** para testar sem gastar dinheiro real:

```env
VITE_ACTIVE_CHAIN=base-sepolia
```

### Opção B: Ambiente de Produção
Quando estiver pronto para o lançamento oficial:

```env
VITE_ACTIVE_CHAIN=base
```

---

## 📄 Exemplo Final do Arquivo `.env` Completo

O seu arquivo `.env` final deve ter a seguinte aparência:

```env
# Serena Web3 — Configurações de Ambiente Locais
VITE_THIRDWEB_CLIENT_ID=9b821a37c04e28e1d7495b4e9a128f73
VITE_EDITION_DROP_ADDRESS=0x83A648B1b62b08384914c1737F9bF1B1a798939c
VITE_ACTIVE_CHAIN=base-sepolia
```

---

## 🚀 Configuração para Produção no GitHub Pages

O GitHub Pages constrói o site em uma máquina remota virtual via GitHub Actions. Por essa razão, o arquivo `.env` do seu computador **não** sobe para o GitHub (ele está ignorado pelo `.gitignore`).

Para que o site online funcione com os seus dados:

1. Acesse o seu repositório no GitHub: `https://github.com/govinda777/SobrietyChain`.
2. Clique na aba **Settings** (Configurações).
3. Na barra lateral esquerda, clique em **Secrets and variables** > **Actions**.
4. Na seção **Repository secrets**, clique no botão verde **New repository secret** e cadastre cada variável:

```
┌────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Nome do Secret                 │ Valor a Inserir                                        │
├────────────────────────────────┼────────────────────────────────────────────────────────┤
│ VITE_THIRDWEB_CLIENT_ID        │ O seu Client ID da Thirdweb                            │
│ VITE_EDITION_DROP_ADDRESS      │ O endereço 0x... do contrato na Base                   │
│ VITE_ACTIVE_CHAIN              │ base-sepolia (ou base)                                 │
└────────────────────────────────┴────────────────────────────────────────────────────────┘
```

> A cada novo `git push` na branch `main`, a Action lerá esses secrets automaticamente e gerará o build estático pronto para o GitHub Pages.

---

## 🔍 Resolução de Dúvidas e Problemas Frequentes

### 1. Mensagem no dApp: *"Endereço do contrato Edition Drop ainda não configurado"*
- **Causa:** O valor de `VITE_EDITION_DROP_ADDRESS` está vazio ou ainda com o valor padrão `0x0000000000000000000000000000000000000000`.
- **Solução:** Cole o endereço real do contrato no `.env` e reinicie o servidor com `npm run dev`.

### 2. Erro no console do navegador: *"Unauthorized domain / CORS Error"*
- **Causa:** O domínio atual não está na lista de permissões da sua API Key.
- **Solução:** Volte no Thirdweb Dashboard > Settings > API Keys > Edite sua chave e adicione `http://localhost:5173` ou `https://seu-usuario.github.io`.

### 3. A transação falha ao tentar resgatar uma ficha
- **Causa:** O contrato foi deployado, mas você ainda não configurou as **Claim Conditions** (regras de resgate gratuito a 0 ETH) para aquele Token ID específico.
- **Solução:** No painel do contrato no Thirdweb, vá na aba **NFTs** > Selecione o Token ID > **Claim Conditions** > Adicione uma fase pública com preço `0 ETH`.
