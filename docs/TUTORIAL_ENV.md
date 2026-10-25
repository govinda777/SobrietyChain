# 📋 Guia de Configuração do `.env` (IaC)

Guia direto e objetivo para configurar as variáveis de ambiente do **SobrietyChain** via terminal e scripts automatizados.

---

## 📌 As Variáveis do Arquivo `.env`

```env
# 1. Chave pública do Thirdweb para o frontend
VITE_THIRDWEB_CLIENT_ID=seu_client_id_aqui

# 2. Endereço do contrato na Base Sepolia (preenchido automaticamente pelo script de deploy)
VITE_EDITION_DROP_ADDRESS=0x0000000000000000000000000000000000000000

# 3. Rede ativa ('base-sepolia' para testes ou 'base' para produção)
VITE_ACTIVE_CHAIN=base-sepolia
```

---

## 🚀 Passo a Passo de Configuração

### 1. Criar o Projeto no Thirdweb e Obter o Client ID
Execute o comando de login:
```bash
npx thirdweb login
```
1. Uma janela abrirá no navegador para criar o projeto.
2. Defina **Project Name:** `SobrietyChain` e **Allowed Domains:** `localhost:5173, *.github.io` (ou marque *Allow all domains*).
3. Clique em **Create** e copie o **Client ID** gerado.

---

### 2. Inicializar o `.env`
Crie o arquivo local a partir do modelo e cole o seu Client ID:
```bash
cp .env.example .env
```
No `.env`, atualize:
```env
VITE_THIRDWEB_CLIENT_ID=seu_client_id_copiado
```

---

### 3. Gerar Carteira de Testes e Obter Saldo (Faucet)
Para assinar o deploy do contrato na Base Sepolia sem gastar dinheiro real:

1. **Gere uma carteira de testes descartável:**
   ```bash
   npm run create-wallet
   ```
   O terminal exibirá o **Endereço Público** e a **Chave Privada** (`ADMIN_PRIVATE_KEY`).

2. **Pegue ETH de teste gratuito:**
   Copie o endereço público e solicite fundos em:
   - 🚰 [basefaucet.com](https://basefaucet.com) ou [base.org/faucets](https://www.base.org/faucets)

---

### 4. Deploy do Contrato (Preenchimento Automático do `.env`)
Exporte a chave privada gerada e rode o script de deploy:

```bash
export ADMIN_PRIVATE_KEY="0x_chave_privada_gerada_no_passo_3"
npm run deploy:contract
```

> ⚡ **Pronto!** O script publica o contrato na Base Sepolia e **atualiza a linha `VITE_EDITION_DROP_ADDRESS` no seu `.env` automaticamente**.

---

### 5. Sincronizar com o GitHub Pages
Envie as configurações para o GitHub Actions sem abrir o navegador:
```bash
gh secret set -f .env
```

---

## 🔍 Resolução Rápida de Erros

| Erro | Causa | Solução |
| :--- | :--- | :--- |
| **`timeout` no deploy** | Carteira sem saldo de gas na Base Sepolia | Pegue ETH gratuito em [basefaucet.com](https://basefaucet.com) para o endereço da carteira. |
| **`invalid private key`** | Formato de chave inválido ou texto de exemplo | Execute `npm run create-wallet` e copie a chave real exibida. |
| **`CORS / Unauthorized`** | Domínio não autorizado no Thirdweb | Adicione `localhost:5173, *.github.io` no campo Allowed Domains do seu projeto no Thirdweb. |
