import crypto from 'crypto';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { createThirdwebClient } from 'thirdweb';

/**
 * Utilitário: Gera uma carteira de testes descartável e segura para uso na Base Sepolia.
 */
function main() {
  const client = createThirdwebClient({
    clientId: '00000000000000000000000000000000',
  });

  // Gera uma chave privada criptograficamente segura de 32 bytes hexadecimais
  const randomHex = crypto.randomBytes(32).toString('hex');
  const privateKey = `0x${randomHex}` as const;
  const account = privateKeyToAccount({ client, privateKey });

  console.log('='.repeat(70));
  console.log('✨ NOVA CARTEIRA DEDICADA PARA DESENVOLVIMENTO / TESTES');
  console.log('='.repeat(70));
  console.log(`\n📍 Endereço Público (Compartilhável):`);
  console.log(`   ${account.address}`);
  console.log(`   👉 Use este endereço para solicitar ETH gratuito nas torneiras (faucets) da Base Sepolia.`);
  console.log(`\n🔑 Chave Privada (ADMIN_PRIVATE_KEY):`);
  console.log(`   ${privateKey}`);
  console.log(`\n⚡ Comando rápido para exportar no seu terminal:`);
  console.log(`   export ADMIN_PRIVATE_KEY="${privateKey}"`);
  console.log('\n' + '='.repeat(70));
  console.log('⚠️  AVISO DE SEGURANÇA:');
  console.log('   Esta carteira deve ser usada APENAS para testes (Base Sepolia).');
  console.log('   NUNCA envie dinheiro real ou criptomoedas da rede principal para ela.');
  console.log('='.repeat(70) + '\n');
}

main();
