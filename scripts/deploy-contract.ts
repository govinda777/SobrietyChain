import { createThirdwebClient } from 'thirdweb';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { deployPublishedContract } from 'thirdweb/deploys';
import { baseSepolia, base } from 'thirdweb/chains';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script IaC: Faz o deploy do contrato Edition Drop na Base e atualiza o .env automaticamente.
 */
async function main() {
  const envPath = path.resolve(process.cwd(), '.env');
  const envExamplePath = path.resolve(process.cwd(), '.env.example');

  // Garante que o arquivo .env existe a partir do .env.example
  if (!fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('📄 Arquivo .env criado a partir de .env.example');
  }

  const clientId = process.env.VITE_THIRDWEB_CLIENT_ID || '00000000000000000000000000000000';
  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

  if (!secretKey && !clientId) {
    console.error('❌ Erro: Configure sua chave do Thirdweb no ambiente ou faça login com: npx thirdweb login');
    process.exit(1);
  }

  const client = createThirdwebClient(
    secretKey ? { secretKey } : { clientId }
  );

  // Define a carteira de deploy
  if (!adminPrivateKey) {
    console.error('❌ Erro: ADMIN_PRIVATE_KEY não definida para assinar o deploy do contrato.');
    console.log('Dica: Gere ou use uma carteira de testes da Base Sepolia e defina: export ADMIN_PRIVATE_KEY="0x..."');
    process.exit(1);
  }

  const account = privateKeyToAccount({ client, privateKey: adminPrivateKey });
  const network = process.env.VITE_ACTIVE_CHAIN === 'base' ? base : baseSepolia;

  console.log(`🚀 Iniciando deploy do contrato Edition Drop na rede: ${network.name}...`);
  console.log(`👤 Carteira Administradora: ${account.address}`);

  try {
    const contractAddress = await deployPublishedContract({
      client,
      chain: network,
      account,
      contractId: 'DropERC1155',
      contractParams: {
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

  } catch (error) {
    console.error('❌ Falha ao realizar deploy do contrato:', error);
    process.exit(1);
  }
}

main();
