import { createThirdwebClient } from 'thirdweb';

// Obtém o Client ID das variáveis de ambiente do Vite
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID || '00000000000000000000000000000000';

if (!import.meta.env.VITE_THIRDWEB_CLIENT_ID) {
  console.warn(
    'Aviso Serena: VITE_THIRDWEB_CLIENT_ID não configurado. Defina sua chave pública no arquivo .env para interagir na blockchain.'
  );
}

/**
 * Cliente único do Thirdweb SDK v5 utilizado em toda a aplicação.
 */
export const client = createThirdwebClient({
  clientId,
});
