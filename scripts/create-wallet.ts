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

  console.log('='.repeat(75));
  console.log('✨ NOVA CARTEIRA ADMINISTRADORA GERADA (SOBRIETYCHAIN)');
  console.log('='.repeat(75));
  console.log(`\n📍 Endereço Público (Pode compartilhar):`);
  console.log(`   ${account.address}`);
  console.log(`   👉 Use este endereço para solicitar ETH gratuito nas torneiras (faucets) da Base Sepolia.`);
  console.log(`\n🔑 Chave Privada (ADMIN_PRIVATE_KEY):`);
  console.log(`   ${privateKey}`);

  console.log('\n' + '-'.repeat(75));
  console.log('🛡️  BOA PRÁTICA DE CUSTÓDIA: SALVE IMEDIATAMENTE NO PROTON PASS');
  console.log('-'.repeat(75));
  console.log('Para evitar perda de acesso ou vazamento acidental em commits do Git:');
  console.log('1. Abra o seu Proton Pass (https://pass.proton.me ou aplicativo desktop/extensão).');
  console.log('2. Crie um novo item:');
  console.log('   - Tipo: "Nota Segura" ou "Login"');
  console.log('   - Título: "SobrietyChain - Admin Wallet (Base Sepolia)"');
  console.log(`   - Campo Usuário: ${account.address}`);
  console.log(`   - Campo Senha / Nota Secreta: ${privateKey}`);
  console.log('3. Marque a tag: #Web3 #SobrietyChain');
  console.log('-'.repeat(75));

  console.log(`\n⚡ Comando rápido para exportar temporariamente na sua sessão do terminal:`);
  console.log(`   export ADMIN_PRIVATE_KEY="${privateKey}"`);
  console.log('\n' + '='.repeat(75));
  console.log('⚠️  AVISO CRÍTICO DE SEGURANÇA:');
  console.log('   • NUNCA comite a ADMIN_PRIVATE_KEY em arquivos públicos no GitHub.');
  console.log('   • Esta chave é gerada para testes e deploy de contratos.');
  console.log('   • O Proton Pass criptografa com criptografia de ponta a ponta (E2EE),');
  console.log('     garantindo que somente você tenha acesso à chave mestra.');
  console.log('='.repeat(75) + '\n');
}

main();
