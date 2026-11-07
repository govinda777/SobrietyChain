# Guia Passo a Passo: Migração do SobrietyChain para a Rede Base Sepolia (ou Base Mainnet)

Este documento descreve de ponta a ponta como migrar o dApp **SobrietyChain** da rede atual (`sepolia`) para a **Base Sepolia** (L2 Testnet) ou **Base Mainnet** (Produção).

---

## 🎯 Por que migrar para a Base Sepolia?

1. **Arquitetura Original:** O SobrietyChain foi desenhado para rodar na L2 **Base** (Ethereum Layer 2).
2. **Resolução de Indexação de NFTs:** Na Base Sepolia (`Chain ID: 84532`), o serviço *Thirdweb Insight Indexer* opera normalmente (diferente da Sepolia L1, onde foi descontinuado).
3. **Custos Mínimos e Finalidade Rápida:** Blocos fechados a cada 2 segundos e compatibilidade nativa com Account Abstraction (ERC-4337 / Gasless).

---

## 📋 Pré-requisitos

1. **Carteira Administradora:** Uma chave privada (`ADMIN_PRIVATE_KEY`) com saldo de teste em **Base Sepolia ETH**.
   - Se ainda não tiver uma chave gerada, execute no terminal:
     ```bash
     npm run create-wallet
     ```
   - 🛡️ **Guarda Segura no Proton Pass (Recomendado):**
     Ao gerar a carteira, o terminal exibirá as instruções para salvar imediatamente no **Proton Pass** (`https://pass.proton.me`):
     - **Tipo:** Nota Segura ou Login
     - **Título:** `SobrietyChain - Admin Wallet (Base Sepolia)`
     - **Endereço Público:** Salve no campo de usuário (para pedir faucets)
     - **Chave Privada (`0x...`):** Salve no cofre criptografado de ponta a ponta (E2EE)
     - *Dica:* Nunca comite a chave privada em arquivos do Git.
   - Obtenha fundos gratuitos para Base Sepolia em torneiras (faucets) oficiais usando o endereço gerado:
     - [Coinbase Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
     - [Superchain Faucet](https://faucets.superchain.fail/) (selecione *Base Sepolia*)
     - [QuickNode Faucet](https://faucet.quicknode.com/base/sepolia)
2. **Thirdweb API Key:** O seu `VITE_THIRDWEB_CLIENT_ID` já existente.

---

## 🚀 Método 1: Migração 100% Automatizada via Terminal (Recomendado)

O projeto possui esteiras de Infrastructure as Code (IaC) prontas para provisionar e configurar tudo automaticamente:

### Passo 1: Atualizar a Rede no Arquivo `.env`
Abra o seu arquivo `.env` na raiz do projeto e altere a variável `VITE_ACTIVE_CHAIN`:
```bash
# Para testes na L2 Base Sepolia:
VITE_ACTIVE_CHAIN=base-sepolia

# (Quando for para produção real, utilize: VITE_ACTIVE_CHAIN=base)
```

### Passo 2: Exportar a Chave Administradora no Terminal
Exporte a chave privada da carteira com fundos na Base Sepolia:
```bash
export ADMIN_PRIVATE_KEY="0x_sua_chave_privada_aqui"
```

### Passo 3: Deploy do Contrato Edition Drop na Base Sepolia
Execute o script automatizado de deploy:
```bash
npm run deploy:contract
```
*O script irá:*
- Conectar automaticamente à rede **Base Sepolia**.
- Fazer o deploy do contrato **DropERC1155**.
- Atualizar o endereço `VITE_EDITION_DROP_ADDRESS` dentro do seu `.env` automaticamente.

### Passo 4: Cadastrar as Fichas e Regras de Claim Gratuito (0 ETH)
Execute o script que cadastra os metadados dos 5 marcos e libera as condições de resgate:
```bash
npm run setup:tokens
```
*O script irá:*
- Fazer o *Lazy Mint* das 5 fichas (24h, 30d, 90d, 6m e 1 ano).
- Configurar as *Claim Conditions* com preço **0 ETH** para cada token.

---

## 🖥️ Método 2: Migração Manual via Thirdweb Dashboard (Alternativa Visual)

Se preferir fazer o processo visualmente pelo navegador:

1. Acesse o [Thirdweb Dashboard](https://thirdweb.com/dashboard/contracts).
2. Clique em **Deploy Contract** > **Explore** > Selecione **Edition Drop (ERC-1155)**.
3. Preencha os dados:
   - **Name:** `SobrietyChain - Marcos de Sobriedade`
   - **Symbol:** `SOBRIETY`
   - **Network:** Selecione **Base Sepolia** (ou **Base**).
4. Confirme o deploy na sua carteira.
5. Copie o endereço do contrato gerado (ex: `0xABC...`).
6. No seu arquivo `.env`, atualize:
   ```env
   VITE_EDITION_DROP_ADDRESS=0xABC...
   VITE_ACTIVE_CHAIN=base-sepolia
   ```
7. Na aba **NFTs** do contrato no Dashboard, clique em **Create / Lazy Mint** e cadastre os 5 tokens (Token IDs `0` a `4`).
8. Na aba **Claim Conditions** de cada token, adicione uma fase pública com **Price = 0 ETH**.

---

## ⚡ Passo Final: Ativar o Gasless (Account Abstraction) na Base Sepolia

Para que os usuários continuem resgatando as fichas sem pagar taxas de gás:

1. Acesse: [Thirdweb Dashboard > Settings > API Keys](https://thirdweb.com/dashboard/settings/api-keys).
2. Clique na sua API Key (`b67fe9ec84ede5edd5998dfd5eced2a4`).
3. Na seção **Account Abstraction (Smart Wallets)**:
   - Certifique-se de que a opção **Sponsor Gas** está ativada.
   - Verifique se a rede **Base Sepolia** (Chain ID: `84532`) está selecionada nas redes patrocinadas.
4. Na seção **Domain Restrictions (Allowed Domains)**, garanta que constem:
   ```text
   localhost:5173, govinda777.github.io
   ```
5. Clique em **Save**.

---

## 🧪 Testando a Migração Localmente

Com o `.env` atualizado para `VITE_ACTIVE_CHAIN=base-sepolia`:

```bash
# 1. Compilar o frontend
npm run build

# 2. Iniciar o servidor
npm run dev
```

1. Abra `http://localhost:5173/`.
2. Observe no topo da tela o indicador: `Rede Base (Base Sepolia) • Gas Patrocinado`.
3. Conecte sua carteira e efetue o resgate da Ficha de 24 Horas com gas 100% patrocinado!

---

## 🌐 Atualizando o Deploy no GitHub Pages (CI/CD)

Quando for subir as alterações para o ar:
1. Vá no seu repositório no GitHub: **Settings** > **Secrets and variables** > **Actions**.
2. Atualize os segredos:
   - `VITE_ACTIVE_CHAIN`: `base-sepolia` (ou `base` se for produção).
   - `VITE_EDITION_DROP_ADDRESS`: O novo endereço do contrato gerado na Base.
3. Faça o commit e push para a branch `main`:
   ```bash
   git add .
   git commit -m "feat: migracao da rede para Base Sepolia"
   git push origin main
   ```
O workflow do GitHub Actions fará o build e deploy estático atualizado automaticamente no GitHub Pages!
