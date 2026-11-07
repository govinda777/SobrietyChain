# CHANGELOG: SobrietyChain (Serena)

Todas as alterações notáveis, correções de segurança, mitigações de incidentes e guias de configuração local deste projeto estão documentados neste arquivo.

O formato é baseado no padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e adere ao [Semantic Versioning (SemVer)](https://semver.org/lang/pt-BR/).

---

## [2.0.0] - 2026-11-05

### 🚀 Novas Funcionalidades (ADR 003)
- **Contratos Solidity Customizados (`SobrietySBT.sol`):**
  - Implementação de contrato inteligente próprio para substituir contratos genéricos pré-construídos.
  - Interface oficial **EIP-5192 (Minimal Soulbound Tokens)** em [`contracts/IERC5192.sol`](contracts/IERC5192.sol).
  - Bloqueio definitivo e irrevogável de transferências secundárias (`safeTransferFrom` e `safeBatchTransferFrom` revertem transações), assegurando que as fichas de sobriedade sejam intransferíveis e vinculadas estritamente à identidade de quem as conquistou.
- **Validação Temporal On-Chain:**
  - Adicionadas as funções `startJourney()` e `claimMilestone(tokenId)`.
  - O cálculo do tempo decorrido agora é verificado matematicamente pela EVM (`block.timestamp - userStartTimes[msg.sender] >= requiredDurations[tokenId]`), eliminando qualquer vulnerabilidade de manipulação do relógio no cliente.
- **Metadados e Imagens SVG 100% On-Chain:**
  - Geração dinâmica de medalhas vetoriais SVG e JSONs de metadados codificados em Base64 diretamente em Solidity, eliminando a dependência de IPFS externo ou gateways gerenciados.

### 🛡️ Correções e Mitigações de Incidentes
- **Resolução do erro "Error loading NFTs" no Modal de Conexão:**
  - **Causa Raiz:** O componente `<ConnectButton />` da Thirdweb tentava consultar a API de telemetria/indexação (*Thirdweb Insight Indexer*) em rede testnet, sofrendo com restrições severas de rate limit e rejeições CORS (401/403) por falta de origens permitidas.
  - **Mitigação no Frontend ([`src/components/Header.tsx`](src/components/Header.tsx)):**
    - Configurado `detailsModal` com `assetTabs: ['token']` e supressão de botões externos ruidosos (`hideBuyFunds: true`, `hideSendFunds: true`, `hideReceiveFunds: true`).
    - O modal agora preserva a experiência limpa, e o inventário de fichas continua sendo consultado com resiliência total via chamadas RPC atômicas (`eth_call: balanceOf`), que operam com 100% de disponibilidade.

### 📚 Documentação e Governança
- **`TECHNICAL_DOCUMENTATION.md`:** Criação e consolidação do documento canônico em inglês cobrindo a arquitetura em C4 Model, fórmulas matemáticas do relógio epocal, diagramas de sequência ERC-4337 (Gasless) e diagnósticos forenses.
- **`docs/adr/003-evolucao-v2-validacao-onchain-soulbound-e-resiliencia.md`:** Registro formal de decisão arquitetural para a transição v1.0 $\to$ v2.0.

---

## 🛠️ Guia Prático: O que Você Precisa Fazer Localmente

Para rodar a aplicação com as novas melhorias e garantir que não haja erros de indexação ou CORS no seu ambiente local, siga os passos abaixo:

### 1. Configurar Origens Permitidas no Thirdweb Dashboard
1. Acesse o painel de desenvolvedor da Thirdweb: [thirdweb.com/dashboard/settings/api-keys](https://thirdweb.com/dashboard/settings/api-keys).
2. Selecione a chave de API associada ao seu `VITE_THIRDWEB_CLIENT_ID` (`b67fe9ec84ede5edd5998dfd5eced2a4`).
3. Na seção **Domain Restrictions / Allowed Domains**, defina com restrição estrita:
   ```text
   localhost:5173, govinda777.github.io
   ```
   > **Atenção:** 
   > - Evite usar `*.github.io` curinga, pois isso autorizaria qualquer página do GitHub a utilizar o seu Client ID e cotas de patrocínio.
   > - Não inclua `https://` nem o subdiretório `/SobrietyChain/`, pois o cabeçalho HTTP `Origin` do navegador avalia apenas o Host FQDN (`govinda777.github.io`).
4. Clique em **Save** (as alterações levam até 5 minutos para propagar globalmente nos nós de borda da Thirdweb).

### 2. Verificar o Arquivo `.env` Local
Certifique-se de que o seu arquivo `.env` na raiz do projeto contém as definições ativas:
```bash
# Client ID público do Thirdweb SDK v5
VITE_THIRDWEB_CLIENT_ID=b67fe9ec84ede5edd5998dfd5eced2a4

# Endereço do contrato ativo
VITE_EDITION_DROP_ADDRESS=0x2Fe5Abb5B7103dF986de19E485Af3ba93E08a080

# Rede: 'sepolia' ou 'base-sepolia' para testes, 'base' para produção
VITE_ACTIVE_CHAIN=sepolia
```

### 3. Rodar o Servidor Local de Desenvolvimento
No terminal do projeto, execute:
```bash
# 1. Instalar as dependências (caso tenha atualizado branch)
npm install

# 2. Executar validação de tipagem e compilação do Vite
npm run build

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```

Abra o navegador no endereço exibido (normalmente `http://localhost:5173/`).

### 4. O que Validar no Navegador
1. **Relógio de Sobriedade:** Observe o tick de segundos fluindo normalmente e a contagem do ciclo diário de 24h.
2. **Conexão de Carteira:** Clique em *"Entrar com Serenidade"*. O modal abrirá com login anônimo via Google, Passkey ou E-mail.
3. **Modal de Ativos:** Ao clicar no botão de perfil da carteira conectada, o modal de detalhes não exibirá mais a aba problemática de NFTs que gerava o erro *"Error loading NFTs"*.
4. **Resgate de Fichas:** O card da Ficha de 24 Horas indicará seu saldo conquistado e o botão *"Resgatar Mais Uma Ficha"* funcionará com transação patrocinada (gasless).
