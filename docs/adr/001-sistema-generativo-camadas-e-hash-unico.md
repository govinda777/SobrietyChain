# ADR 001: Pipeline Generativo de Camadas, Hash Único (DNA) e Infraestrutura como Código (IaC) no Thirdweb

- **Status:** Aprovado
- **Data:** 2026-10-25
- **Decisores:** Arquiteto de Soluções Web3, Engenharia Frontend & DevOps
- **Referência:** Padrão arquitetural de [crypto-punks-generator](https://github.com/govinda777/crypto-punks-generator) e Thirdweb v5 SDK

---

## 1. Contexto e Motivação

No dApp **Serena**, os usuários conquistam medalhas e fichas de sobriedade on-chain com representação visual única e imutável.

Originalmente, o processo de subir coleções Web3 envolvia etapas manuais no Thirdweb Dashboard (clicar em botões, arrastar pastas no navegador para upload em lote e configurar permissões manualmente). Essa abordagem manual:
- É propensa a falhas operacionais e inconsistências humanas;
- Dificulta a reprodutibilidade idêntica entre ambientes (Testnet Base Sepolia vs. Mainnet Base);
- Impede a automação contínua via CI/CD (GitHub Actions).

### Objetivo desta ADR
Adotar uma arquitetura **100% Infraestrutura como Código (IaC) e Pipeline-as-Code**. Todas as etapas — desde a geração algorítmica das imagens e hashes criptográficos até o upload no IPFS, lazy-minting on-chain e configuração de regras de resgate (claim conditions) — são executadas **estritamente por scripts programáticos versionados em código**.

---

## 2. Visão Geral da Arquitetura (Diagrama Macro)

O fluxo completo funciona como uma esteira contínua e determinística:

```mermaid
flowchart LR
    subgraph S1["1. Gerador Local / CI"]
        A["Camadas PNG (1024x1024)"] --> B["Motor Sharp / Canvas"]
        B --> C["Cálculo SHA-256 (DNA)"]
        C --> D["output/ (Images + JSONs)"]
    end

    subgraph S2["2. Armazenamento Descentralizado"]
        D --> E["Thirdweb Storage SDK"]
        E --> F["IPFS Cluster (Pinning)"]
        F --> G["Base URI: ipfs://QmXy..."]
    end

    subgraph S3["3. Smart Contract (Base L2)"]
        G --> H["Extension: lazyMint"]
        H --> I["Extension: setClaimConditions"]
        I --> J["Tokens Prontos (0 ETH / Gasless)"]
    end

    subgraph S4["4. Experiência do Usuário"]
        J --> K["Serena dApp (Vite SPA)"]
        K --> L["Resgate via <ClaimButton />"]
    end
```

---

## 3. Modelo de Decomposição de Camadas (Layer Stacking)

Inspirado na técnica do `crypto-punks-generator`, as medalhas são compostas por uma pilha ordenada de imagens transparentes (Z-Index). Cada elemento gráfico é desenhado com alinhamento concêntrico perfeito:

### 3.1. Visão Esquemática da Sobreposição

```
                   [ CAMADA SUPERIOR / Z-INDEX 6 ]
                   ┌─────────────────────────────┐
                   │   06_finish (Pátina/Glow)   │ ──> Reflexos metálicos, luz volumétrica
                   └──────────────┬──────────────┘
                                  │
                   ┌──────────────▼──────────────┐
                   │  05_inscriptions (Lemas)    │ ──> "Apenas por hoje", "Serenidade"
                   └──────────────┬──────────────┘
                                  │
                   ┌──────────────▼──────────────┐
                   │ 04_center_emblem (Símbolos) │ ──> Numerais: XXIV, I, III, VI, 1 ANO
                   └──────────────┬──────────────┘
                                  │
                   ┌──────────────▼──────────────┐
                   │    03_coin_rim (Bordas)     │ ──> Chanfro clássico, anel de estrelas
                   └──────────────┬──────────────┘
                                  │
                   ┌──────────────▼──────────────┐
                   │   02_coin_base (Materiais)  │ ──> Prata, Carmim, Âmbar, Esmeralda, Safira
                   └──────────────┬──────────────┘
                                  │
                   ┌──────────────▼──────────────┐
                   │  01_background (Ambiente)   │ ──> Fundo escuro sereno / Transparente
                   └─────────────────────────────┘
                   [ CAMADA INFERIOR / Z-INDEX 1 ]
```

### 3.2. Anatomia Gráfica da Ficha de Sobriedade

```
                  ╭─────────────────────────────────╮
               ╭──╯          SERENA DAPP            ╰──╮
             ╭─╯     ★    ★    ★    ★    ★    ★        ╰─╮   <-- 03_coin_rim (Borda com Estrelas)
           ╭─╯                                         ╰─╮
          ╭╯     ╭─────────────────────────────────╮     ╰╮
         ╭╯      │         "APENAS POR HOJE"       │      ╰╮  <-- 05_inscriptions (Lema Curvo)
        ╭╯       ╰─────────────────────────────────╯       ╰╮
        │                                                   │
        │                    ╭─────────╮                    │
        │                    │  XXIV   │                    │  <-- 04_center_emblem (Marco Central)
        │                    │  HORAS  │                    │
        │                    ╰─────────╯                    │
        │                                                   │
        ╰╮       ╭─────────────────────────────────╮       ╭╯
         ╰╮      │       SOBRIEDADE & CORAGEM      │      ╭╯  <-- 02_coin_base (Textura Prata / Metal)
          ╰╮     ╰─────────────────────────────────╯     ╭╯
           ╰─╮                                         ╭─╮    <-- 06_finish (Gradiente de Luz Radial)
             ╰─╮     ★    ★    ★    ★    ★    ★        ╭─╯
               ╰──╮          REDE BASE              ╭──╯
                  ╰─────────────────────────────────╯
```

---

## 4. O Modelo de Geração Criptográfica de DNA (Hash Único)

Para garantir que cada token gerado seja matematicamente comprovável e livre de colisões, o sistema implementa um pipeline criptográfico determinístico:

```mermaid
flowchart TD
    subgraph Entradas["Entradas Canônicas dos Traços"]
        T1["Base: base_24h_silver"]
        T2["Borda: rim_classic_bevel"]
        T3["Emblema: emblem_24_hours"]
        T4["Lema: text_just_for_today"]
        T5["Acabamento: finish_polished"]
        SEED["Semente Temporal / ID"]
    end

    subgraph Serializacao["Serializador Determinístico"]
        T1 & T2 & T3 & T4 & T5 & SEED --> ORD["Ordenação Alfabética das Chaves"]
        ORD --> STR["String Canônica: base:...|emblem:...|rim:...|seed:..."]
    end

    subgraph Criptografia["Motor Criptográfico"]
        STR --> SHA["SHA-256 Digest Engine"]
        SHA --> HASH["DNA Hash (64 caracteres hexadecimais)"]
    end

    subgraph Verificacao["Verificação de Unicidade"]
        HASH --> SET{"Hash existe no Set global?"}
        SET -- "Sim (Colisão)" --> REGEN["Descarta e gera nova semente"]
        SET -- "Não (Único)" --> REGISTRO["Salva no Registro & Compoe Imagem"]
    end
```

### 4.1. Fórmula Matemática do DNA

$$\text{DNA Hash} = \mathcal{H}_{\text{SHA-256}}\left( \bigoplus_{i=1}^{n} \left( k_i \parallel \text{":"} \parallel v_i \parallel \text{"|"} \right) \parallel \text{"seed:"} \parallel \mathcal{S} \right)$$

Onde:
- $k_i$ são os identificadores das camadas ordenados lexicograficamente ($k_1 \le k_2 \le \dots \le k_n$).
- $v_i$ são os nomes dos arquivos PNG escolhidos.
- $\mathcal{S}$ é a semente de entropia (Timestamp Unix ou ID do Marco).

---

## 5. Comparativo: Método Manual vs. Pipeline IaC

```mermaid
flowchart TD
    subgraph Manual["Abordagem Manual (Antiga)"]
        M1["Exporta PNGs manualmente"] --> M2["Abre navegador no Thirdweb"]
        M2 --> M3["Clica em Batch Upload"]
        M3 --> M4["Arrasta pastas e espera"]
        M4 --> M5["Clica em assinar no MetaMask"]
        M5 --> M6["Ajusta Claim Conditions na mão"]
        style Manual fill:#3f1d1d,stroke:#f87171,color:#fca5a5
    end

    subgraph IaC["Abordagem IaC (Adotada)"]
        I1["Comando CLI: npm run pipeline:deploy"] --> I2["Sharp compõe todas as camadas"]
        I2 --> I3["Calcula DNA SHA-256 & Metadados"]
        I3 --> I4["Thirdweb Storage SDK sobe ao IPFS"]
        I4 --> I5["Script executa lazyMint on-chain"]
        I5 --> I6["Script executa setClaimConditions"]
        style IaC fill:#064e3b,stroke:#34d399,color:#a7f3d0
    end
```

| Critério | Abordagem Manual (Dashboard) | Abordagem IaC (Código Automatizado) |
| :--- | :--- | :--- |
| **Tempo de Execução** | ~30 a 45 minutos de cliques manuais | **Menos de 2 minutos** (1 comando) |
| **Reprodutibilidade** | Baixa (sujeita a esquecimento de passos) | **100% determinística** via código |
| **Rastreabilidade Git** | Nenhuma (feita direto no browser) | Total (PRs, histórico de commits e diffs) |
| **Ambientes (Staging/Prod)** | Requer refazer tudo na mão para Mainnet | Alternância instantânea via flag `--network` |
| **Integração CI/CD** | Impossível | **Nativa** via GitHub Actions |

---

## 6. Diagrama de Sequência da Execução do Pipeline IaC

O diagrama abaixo detalha a coreografia de chamadas entre os scripts, o nó IPFS e o contrato na rede Base:

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Desenvolvedor / CI (GitHub Actions)
    participant Pipe as scripts/pipeline.ts
    participant Gen as scripts/generate.ts
    participant Storage as Thirdweb Storage (IPFS)
    participant Chain as Contrato Base (ERC-1155)
    participant Client as Serena dApp (Frontend)

    Dev->>Pipe: Executa: npm run pipeline:deploy --network base-sepolia
    Pipe->>Gen: 1. Gera imagens e metadados com DNA Hash
    Gen-->>Pipe: Retorna pasta output/ (PNGs + JSONs)
    
    Pipe->>Storage: 2. upload({ client, files: outputFiles })
    Storage-->>Pipe: Retorna Base URI (ipfs://QmSobrietyFichas123/)
    
    Pipe->>Chain: 3. lazyMint(amount: 5, baseURI: ipfs://Qm.../)
    Note over Pipe,Chain: Transação assinada via Admin Private Key
    Chain-->>Pipe: Confirmação on-chain (Tx Hash)
    
    Pipe->>Chain: 4. setClaimConditions(tokenIds: [0..4], price: 0 ETH)
    Chain-->>Pipe: Regras de resgate gravadas com sucesso
    
    Pipe->>Pipe: 5. Atualiza .env local e Secrets com novo endereço
    
    Dev->>Client: Build e Deploy no GitHub Pages
    Client->>Chain: 6. Usuário final clica em <ClaimButton /> (Gasless)
    Chain-->>Client: Ficha cunhada diretamente na carteira anônima!
```

---

## 7. Modelo de Metadados JSON Gerado

Para cada token cunhado, o gerador emite um arquivo JSON estritamente alinhado aos padrões **ERC-1155** e **OpenSea Standard**:

```json
{
  "id": "0",
  "name": "Ficha Serena #0000 — 24 Horas",
  "description": "Ficha comemorativa do primeiro ciclo de 24 horas de sobriedade. Apenas por hoje.",
  "image": "ipfs://QmSobrietyHash/0.png",
  "dna": "c5f1a9b7e3d824610538a0f2b963174e50821c97a34612e58749bc1365ad4820",
  "properties": {
    "category": "sobriety_milestone",
    "generation": 1,
    "tier": "Prata"
  },
  "attributes": [
    {
      "trait_type": "Marco Temporal",
      "value": "24 Horas"
    },
    {
      "trait_type": "Material da Moeda",
      "value": "Prata Fina 999"
    },
    {
      "trait_type": "Borda",
      "value": "Chanfro Clássico"
    },
    {
      "trait_type": "Emblema Central",
      "value": "XXIV Numeral"
    },
    {
      "trait_type": "Lema Gravado",
      "value": "Apenas por hoje"
    },
    {
      "trait_type": "Acabamento",
      "value": "Polido Brilhante"
    },
    {
      "trait_type": "Raridade",
      "value": "Comum"
    },
    {
      "trait_type": "DNA Hash",
      "value": "c5f1a9b7e3d824610538a0f2b963174e50821c97a34612e58749bc1365ad4820"
    }
  ]
}
```

---

## 8. Arquitetura dos Arquivos de Script no Projeto

A estrutura de código dedicada a esse pipeline dentro do repositório Serena:

```
SobrietyChain/
 ├── docs/
 │    └── adr/
 │         └── 001-sistema-generativo-camadas-e-hash-unico.md
 ├── generator/
 │    ├── layers/                       # Assets originais em PNG transparente (1024x1024)
 │    │    ├── 01_background/           # Planos de fundo
 │    │    ├── 02_coin_base/            # Materiais: prata, carmim, ambar, esmeralda, safira
 │    │    ├── 03_coin_rim/             # Anéis externos e relevos
 │    │    ├── 04_center_emblem/        # Numerais romanos e símbolos
 │    │    ├── 05_inscriptions/         # Frases inspiracionais
 │    │    └── 06_finish/               # Reflexos, pátina e iluminação
 │    └── output/                       # Diretório gerado (ignorado pelo git)
 │         ├── images/                  # 0.png, 1.png, 2.png, 3.png, 4.png
 │         └── metadata/                # 0.json, 1.json, 2.json, 3.json, 4.json
 ├── scripts/
 │    ├── generate.ts                   # Motor de camadas + cálculo SHA-256
 │    ├── upload-storage.ts             # Pinning em lote no IPFS via Thirdweb Storage
 │    ├── lazy-mint.ts                  # Registro on-chain dos tokens na Base
 │    ├── set-claim-conditions.ts       # Regras de resgate gratuito (0 ETH)
 │    └── pipeline.ts                   # Orquestrador unificado CLI
 └── .github/
      └── workflows/
           └── deploy-collection.yml    # Pipeline automatizado de CI/CD
```

---

## 9. Comandos Operacionais

O time opera a infraestrutura diretamente pelo terminal:

```bash
# 1. Testar apenas a geração local das imagens e cálculo dos hashes
npm run generate

# 2. Executar o pipeline completo em ambiente de testes (Base Sepolia)
npm run pipeline:deploy -- --network base-sepolia

# 3. Executar o pipeline completo em ambiente de produção (Base Mainnet)
npm run pipeline:deploy -- --network base
```

---

## 10. Conclusão

Com a aprovação desta ADR, o dApp Serena adota as melhores práticas de **Engenharia de Software Web3**, combinando:
1. **Arte generativa em camadas** no estilo consagrado do `crypto-punks-generator`;
2. **Identidade criptográfica imutável (DNA)** por meio de hashes SHA-256;
3. **Automação ponta a ponta (IaC)**, tornando o processo de publicação de coleções rápido, seguro, auditável e 100% livre de intervenções manuais em dashboards.
