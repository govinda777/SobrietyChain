import { createThirdwebClient, getContract, sendTransaction } from 'thirdweb';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { lazyMint, setClaimConditions } from 'thirdweb/extensions/erc1155';
import { sepolia, baseSepolia, base } from 'thirdweb/chains';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const envPath = path.resolve(process.cwd(), '.env');

  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }

  const clientId = process.env.VITE_THIRDWEB_CLIENT_ID;
  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  const contractAddress = process.env.VITE_EDITION_DROP_ADDRESS;
  const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    console.error('❌ Erro: VITE_EDITION_DROP_ADDRESS não configurado no .env.');
    process.exit(1);
  }

  const client = createThirdwebClient(
    secretKey ? { secretKey } : { clientId: clientId || '' }
  );

  const rawKey = (adminPrivateKey || '').trim().replace(/['"]/g, '');
  const formattedKey = (rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`) as `0x${string}`;
  const account = privateKeyToAccount({ client, privateKey: formattedKey });

  const chainEnv = process.env.VITE_ACTIVE_CHAIN;
  const network =
    chainEnv === 'base'
      ? base
      : chainEnv === 'base-sepolia'
      ? baseSepolia
      : sepolia;

  console.log(`🚀 Configurando tokens no contrato: ${contractAddress} (${network.name})...`);
  console.log(`👤 Administrador: ${account.address}`);

  const contract = getContract({
    client,
    chain: network,
    address: contractAddress,
  });

  // Metadados oficiais dos 5 marcos de sobriedade
  const nfts = [
    {
      name: 'Ficha de 24 Horas',
      description: 'O início de tudo. A vitória fundamental conquistada minuto a minuto, completando o primeiro ciclo de sobriedade.',
      attributes: [
        { trait_type: 'Marco', value: '24 Horas' },
        { trait_type: 'Raridade', value: 'Comum' },
        { trait_type: 'Lema', value: 'Apenas por hoje' },
      ],
    },
    {
      name: 'Ficha de 30 Dias',
      description: 'Um mês de mente limpa e novos hábitos sendo forjados. A névoa começa a dissipar, revelando a serenidade.',
      attributes: [
        { trait_type: 'Marco', value: '30 Dias' },
        { trait_type: 'Raridade', value: 'Incomum' },
        { trait_type: 'Lema', value: 'Um dia de cada vez' },
      ],
    },
    {
      name: 'Ficha de 90 Dias',
      description: 'O marco dos três meses consolida o compromisso com a recuperação e demonstra a força da persistência.',
      attributes: [
        { trait_type: 'Marco', value: '90 Dias' },
        { trait_type: 'Raridade', value: 'Rara' },
        { trait_type: 'Lema', value: 'A clareza se consolida' },
      ],
    },
    {
      name: 'Ficha de 6 Meses',
      description: 'Meio ano de liberdade. A reconstrução pessoal e espiritual se torna evidente para você e ao seu redor.',
      attributes: [
        { trait_type: 'Marco', value: '6 Meses' },
        { trait_type: 'Raridade', value: 'Épica' },
        { trait_type: 'Lema', value: 'Renovação e Esperança' },
      ],
    },
    {
      name: 'Ficha de 1 Ano',
      description: 'Um ano inteiro sem ceder. Um testemunho vivo de resiliência, humildade e triunfo pessoal contínuo.',
      attributes: [
        { trait_type: 'Marco', value: '1 Ano' },
        { trait_type: 'Raridade', value: 'Lendária' },
        { trait_type: 'Lema', value: 'Uma nova maneira de viver' },
      ],
    },
  ];

  try {
    console.log(`📦 1/2. Criando / Lazy-minting das 5 fichas no contrato...`);
    const mintTx = lazyMint({
      contract,
      nfts,
    });
    const txResult = await sendTransaction({ transaction: mintTx, account });
    console.log(`✅ Fichas criadas on-chain! Tx: ${txResult.transactionHash}`);

    console.log(`🔓 2/2. Liberando regras de resgate gratuito (0 ETH) para cada Token ID...`);
    for (let i = 0n; i < 5n; i++) {
      console.log(`   Configurando Claim Condition para o Token ID ${i}...`);
      const claimTx = setClaimConditions({
        contract,
        tokenId: i,
        phases: [
          {
            price: 0,
            maxClaimableSupply: 1000000n,
            quantityLimitPerWallet: 1n,
          },
        ],
      });
      await sendTransaction({ transaction: claimTx, account });
    }

    console.log('\n' + '='.repeat(70));
    console.log('🎉 TUDO PRONTO! O contrato está 100% configurado para resgate.');
    console.log('='.repeat(70));
    console.log('👉 Agora você pode testar o dApp no seu navegador:');
    console.log('   npm run dev\n');

  } catch (error) {
    console.error('❌ Falha ao configurar tokens:', error);
    process.exit(1);
  }
}

main();
