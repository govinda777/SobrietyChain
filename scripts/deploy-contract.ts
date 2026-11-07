import { createThirdwebClient } from 'thirdweb';
import { privateKeyToAccount, getWalletBalance } from 'thirdweb/wallets';
import { deployPublishedContract } from 'thirdweb/deploys';
import { sepolia, baseSepolia, base } from 'thirdweb/chains';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script IaC: Faz o deploy do contrato Edition Drop na Base e atualiza o .env automaticamente.
 * Utiliza os nós RPC nativos autenticados da Thirdweb via THIRDWEB_SECRET_KEY para evitar
 * erros 401 (Allowed Domains) e Rate Limit (-32007) de endpoints públicos.
 */
async function main() {
  const envPath = path.resolve(process.cwd(), '.env');
  const envExamplePath = path.resolve(process.cwd(), '.env.example');

  // Garante que o arquivo .env existe a partir do .env.example
  if (!fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('📄 Arquivo .env criado a partir de .env.example');
  }

  // Carrega variáveis do .env se existirem
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }

  const clientId = process.env.VITE_THIRDWEB_CLIENT_ID || '00000000000000000000000000000000';
  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

  if (!secretKey && !clientId) {
    console.error('❌ Erro: Configure sua chave do Thirdweb no ambiente ou faça login com: npx thirdweb login');
    process.exit(1);
  }

  if (!secretKey) {
    console.warn('⚠️  Aviso: THIRDWEB_SECRET_KEY não detectada no terminal.');
    console.warn('   Se o seu Client ID tiver restrição de domínios (Allowed Domains), o deploy retornará 401.');
    console.warn('   Recomendado: export THIRDWEB_SECRET_KEY="<SUA_SECRET_KEY>"\n');
  }

  const client = createThirdwebClient(
    secretKey ? { secretKey } : { clientId }
  );

  // Define a carteira de deploy
  let rawKey = adminPrivateKey ? adminPrivateKey.trim().replace(/['"]/g, '') : '';

  if (!rawKey || rawKey.includes('sua_chave') || rawKey.includes('your_private_key')) {
    console.error('\n❌ Erro: ADMIN_PRIVATE_KEY inválida ou ainda com texto de exemplo/placeholder.');
    console.log('👉 Para gerar uma chave real de testes válida em 1 segundo, execute:');
    console.log('   npm run create-wallet\n');
    console.log('Depois copie a chave real exibida e exporte com:');
    console.log('   export ADMIN_PRIVATE_KEY="0x..."\n');
    process.exit(1);
  }

  // Garante o prefixo 0x
  const formattedKey = (rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`) as `0x${string}`;

  // Valida formato de 32 bytes hexadecimais (64 caracteres hex + '0x' = 66 caracteres)
  if (!/^0x[0-9a-fA-F]{64}$/.test(formattedKey)) {
    console.error('\n❌ Erro: Formato da chave privada inválido.');
    console.error(`   Recebido: ${formattedKey.slice(0, 10)}... (tamanho: ${formattedKey.length} caracteres)`);
    console.error('   Esperado: Chave hexadecimal de 32 bytes (64 caracteres + 0x = 66 caracteres).');
    console.log('\n👉 Dica: Execute "npm run create-wallet" para gerar uma chave perfeitamente formatada.\n');
    process.exit(1);
  }

  const account = privateKeyToAccount({ client, privateKey: formattedKey });
  const chainEnv = process.env.VITE_ACTIVE_CHAIN;
  const network =
    chainEnv === 'base'
      ? base
      : chainEnv === 'base-sepolia'
      ? baseSepolia
      : sepolia;

  console.log(`🚀 Conectando à rede: ${network.name}...`);
  console.log(`👤 Carteira Administradora: ${account.address}`);

  // Verifica o saldo da carteira antes de tentar o deploy
  try {
    const balance = await getWalletBalance({
      client,
      chain: network,
      address: account.address,
    });

    console.log(`💰 Saldo atual: ${balance.displayValue} ${balance.symbol}`);

    if (balance.value === 0n) {
      console.log('\n' + '='.repeat(70));
      console.log(`⚠️  SALDO INSUFICIENTE PARA O DEPLOY NA ${network.name.toUpperCase()}`);
      console.log('='.repeat(70));
      console.log(`A sua carteira (${account.address}) está com 0 ${balance.symbol} de teste.`);
      console.log('Para registrar o contrato na blockchain, você precisa de uma fração de ETH gratuito.');
      console.log('\n👉 PASSO RÁPIDO PARA RESOLVER:');
      console.log('1. Acesse: https://faucets.chain.link ou https://sepoliafaucet.com');
      console.log(`2. Cole seu endereço: ${account.address}`);
      console.log('3. Clique em solicitar e aguarde 10 segundos.');
      console.log('4. Rode o comando novamente: npm run deploy:contract');
      console.log('='.repeat(70) + '\n');
      process.exit(1);
    }
  } catch (balanceError) {
    console.warn('⚠️ Não foi possível verificar o saldo previamente. Tentando deploy direto...');
  }

  try {
    const contractAddress = await deployPublishedContract({
      client,
      chain: network,
      account,
      contractId: 'DropERC1155',
      contractParams: {
        _defaultAdmin: account.address,
        _name: 'SobrietyChain - Marcos de Sobriedade',
        _symbol: 'SOBRIETY',
        _contractURI: '',
        _trustedForwarders: [],
        _saleRecipient: account.address,
        _royaltyRecipient: account.address,
        _royaltyBps: 0n,
        _platformFeeBps: 0n,
        _platformFeeRecipient: account.address,
        name: 'SobrietyChain - Marcos de Sobriedade',
        symbol: 'SOBRIETY',
        description: 'Fichas perpétuas de incentivo comportamental e sobriedade.',
        primary_sale_recipient: account.address,
      },
    });

    console.log(`\n🎉 Contrato deployado com sucesso!`);
    console.log(`📍 Endereço na ${network.name}: ${contractAddress}`);

    // Atualiza o arquivo .env automaticamente
    let envContent = fs.readFileSync(envPath, 'utf-8');

    if (envContent.includes('VITE_EDITION_DROP_ADDRESS=')) {
      envContent = envContent.replace(
        /VITE_EDITION_DROP_ADDRESS=.*/,
        `VITE_EDITION_DROP_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nVITE_EDITION_DROP_ADDRESS=${contractAddress}\n`;
    }

    fs.writeFileSync(envPath, envContent, 'utf-8');
    console.log('✅ Arquivo .env atualizado com o endereço do contrato automaticamente!\n');

  } catch (error: unknown) {
    console.error('❌ Falha ao realizar deploy do contrato:', error);
    const errMsg =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null
        ? JSON.stringify(error)
        : String(error);

    if (errMsg.includes('401') || errMsg.includes('Unauthorized')) {
      console.log('\n' + '='.repeat(75));
      console.log('🔒 DIAGNÓSTICO (ERRO 401 UNAUTHORIZED):');
      console.log('O VITE_THIRDWEB_CLIENT_ID possui restrição de domínio (Allowed Domains)');
      console.log('ativa para navegadores e recusa chamadas diretas via Node.js/Terminal.');
      console.log('\n👉 COMO RESOLVER COM SEGURANÇA (Sem abrir All Domains):');
      console.log('1. Copie a Secret Key da sua chave no Thirdweb Dashboard.');
      console.log('2. Exporte no terminal antes de rodar o deploy:');
      console.log('   export THIRDWEB_SECRET_KEY="<SUA_SECRET_KEY>"');
      console.log('   npm run deploy:contract');
      console.log('📖 Guia completo: docs/DEPLOY_CONTRACT_GUIDE.md');
      console.log('='.repeat(75) + '\n');
    } else if (errMsg.includes('-32007') || errMsg.includes('request limit reached') || errMsg.includes('429')) {
      console.log('\n' + '='.repeat(75));
      console.log('🚦 DIAGNÓSTICO (RPC RATE LIMIT / -32007):');
      console.log('O endpoint RPC atingiu o limite de requisições por segundo.');
      console.log('Certifique-se de exportar a THIRDWEB_SECRET_KEY para autenticar no');
      console.log('gateway dedicado da Thirdweb e aguarde alguns segundos antes de tentar novamente.');
      console.log('📖 Guia completo: docs/DEPLOY_CONTRACT_GUIDE.md');
      console.log('='.repeat(75) + '\n');
    }
    process.exit(1);
  }
}

main();
