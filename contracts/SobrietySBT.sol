// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IERC5192.sol";

/// @title Base64
/// @notice Biblioteca auxiliar para serialização de strings em Base64 para Metadados e SVGs On-Chain.
library Base64 {
    string internal constant _TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

        string memory table = _TABLE;
        string memory result = new string(4 * ((data.length + 2) / 3));

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            let dataPtr := data
            let endPtr := add(data, mload(data))

            for {} lt(dataPtr, endPtr) {} {
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)

                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1)
            }

            switch mod(mload(data), 3)
            case 1 {
                mstore8(sub(resultPtr, 1), 0x3d)
                mstore8(sub(resultPtr, 2), 0x3d)
            }
            case 2 {
                mstore8(sub(resultPtr, 1), 0x3d)
            }
        }

        return result;
    }
}

/// @title SobrietySBT (v2.0)
/// @notice Contrato inteligente de fichas comemorativas de sobriedade com validação temporal on-chain,
/// tokens intransferíveis (Soulbound Token ERC-5192) e metadados SVG 100% On-Chain.
contract SobrietySBT is IERC5192 {
    string public name = "SobrietyChain Milestones";
    string public symbol = "SOBRIETY";
    address public owner;

    // Mapping de saldos ERC-1155: owner => tokenId => balance
    mapping(address => mapping(uint256 => uint256)) private _balances;

    // Registro imutável de quando o usuário iniciou sua jornada on-chain (Unix Epoch Seconds)
    mapping(address => uint256) public userStartTimes;

    // Tabela de requisitos mínimos de tempo em segundos para cada Token ID (0 a 4)
    uint256[5] public requiredDurations = [
        1 days,    // Token 0: 24 Horas
        30 days,   // Token 1: 30 Dias
        90 days,   // Token 2: 90 Dias
        180 days,  // Token 3: 6 Meses
        365 days   // Token 4: 1 Ano
    ];

    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event JourneyStarted(address indexed user, uint256 startTime);
    event JourneyReset(address indexed user, uint256 newStartTime);

    modifier onlyOwner() {
        require(msg.sender == owner, "SobrietyChain: Apenas o owner pode executar");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ==========================================
    // GESTÃO DE JORNADA E VALIDAÇÃO TEMPORAL
    // ==========================================

    /// @notice Registra o início da jornada de sobriedade on-chain para a carteira chamadora
    function startJourney() external {
        require(userStartTimes[msg.sender] == 0, "SobrietyChain: Jornada ja iniciada");
        userStartTimes[msg.sender] = block.timestamp;
        emit JourneyStarted(msg.sender, block.timestamp);
    }

    /// @notice Permite ao usuário reiniciar voluntariamente sua jornada após recaída, de acordo com o princípio da sinceridade
    function resetJourney() external {
        userStartTimes[msg.sender] = block.timestamp;
        emit JourneyReset(msg.sender, block.timestamp);
    }

    /// @notice Retorna o tempo decorrido em segundos desde o início da jornada
    function getElapsedTime(address user) external view returns (uint256) {
        uint256 start = userStartTimes[user];
        if (start == 0 || block.timestamp < start) return 0;
        return block.timestamp - start;
    }

    /// @notice Verifica se uma ficha específica está desbloqueada para resgate on-chain
    function isMilestoneUnlocked(address user, uint256 tokenId) public view returns (bool) {
        if (tokenId >= 5) return false;
        uint256 start = userStartTimes[user];
        if (start == 0) return false;
        return (block.timestamp - start) >= requiredDurations[tokenId];
    }

    // ==========================================
    // RESGATE DE FICHAS (CLAIM COM TRAVA ON-CHAIN)
    // ==========================================

    /// @notice Executa o resgate comemorativo da ficha validando o tempo decorrido estritamente on-chain
    /// @param tokenId Identificador do marco (0: 24h, 1: 30d, 2: 90d, 3: 6m, 4: 1a)
    function claimMilestone(uint256 tokenId) external {
        require(tokenId < 5, "SobrietyChain: Token ID invalido");
        require(userStartTimes[msg.sender] > 0, "SobrietyChain: Jornada nao iniciada. Inicie primeiro.");
        require(isMilestoneUnlocked(msg.sender, tokenId), "SobrietyChain: Tempo de sobriedade insuficiente para este marco");

        _balances[msg.sender][tokenId] += 1;
        emit TransferSingle(msg.sender, address(0), msg.sender, tokenId, 1);
        emit Locked(tokenId);
    }

    // ==========================================
    // INTERFACE ERC-1155 (LEITURA)
    // ==========================================

    function balanceOf(address account, uint256 id) public view returns (uint256) {
        require(account != address(0), "SobrietyChain: Consulta para endereco zero");
        return _balances[account][id];
    }

    // ==========================================
    // INTERFACE ERC-5192: SOULBOUND (INTRANSFERÍVEL)
    // ==========================================

    function locked(uint256 tokenId) external pure override returns (bool) {
        require(tokenId < 5, "SobrietyChain: Token ID invalido");
        return true; // Fichas sao permanentemente intransferiveis
    }

    function safeTransferFrom(address, address, uint256, uint256, bytes memory) public pure {
        revert("SobrietyChain: Fichas sao intransferiveis e vinculadas a alma (Soulbound ERC-5192)");
    }

    function safeBatchTransferFrom(address, address, uint256[] memory, uint256[] memory, bytes memory) public pure {
        revert("SobrietyChain: Fichas sao intransferiveis e vinculadas a alma (Soulbound ERC-5192)");
    }

    // ==========================================
    // METADADOS E SVGS 100% ON-CHAIN
    // ==========================================

    function getMilestoneMetadata(uint256 tokenId) public pure returns (string memory nameStr, string memory durationStr, string memory colorHex, string memory motto) {
        if (tokenId == 0) return ("Ficha de 24 Horas", "24 HORAS", "#94A3B8", "Apenas por hoje.");
        if (tokenId == 1) return ("Ficha de 30 Dias", "30 DIAS", "#F43F5E", "Um dia de cada vez.");
        if (tokenId == 2) return ("Ficha de 90 Dias", "90 DIAS", "#10B981", "A serenidade e fruto da persistencia.");
        if (tokenId == 3) return ("Ficha de 6 Meses", "6 MESES", "#0EA5E9", "A transformacao silenciosa acontece.");
        if (tokenId == 4) return ("Ficha de 1 Ano", "1 ANO", "#F59E0B", "Um novo ciclo de liberdade e esperanca.");
        revert("SobrietyChain: Token ID invalido");
    }

    function generateSVG(uint256 tokenId) public pure returns (string memory) {
        (, string memory durationStr, string memory colorHex, ) = getMilestoneMetadata(tokenId);

        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">',
            '<defs>',
            '<radialGradient id="coinGrad" cx="35%" cy="35%" r="65%">',
            '<stop offset="0%" stop-color="#ffffff"/>',
            '<stop offset="45%" stop-color="', colorHex, '"/>',
            '<stop offset="100%" stop-color="#0b0f17"/>',
            '</radialGradient>',
            '</defs>',
            '<circle cx="250" cy="250" r="230" fill="url(#coinGrad)" stroke="#ffffff" stroke-width="8"/>',
            '<circle cx="250" cy="250" r="200" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="3" stroke-dasharray="8 6"/>',
            '<text x="250" y="140" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="4">SOBRIETYCHAIN</text>',
            '<text x="250" y="270" font-family="sans-serif" font-size="52" font-weight="900" fill="#ffffff" text-anchor="middle">', durationStr, '</text>',
            '<line x1="180" y1="300" x2="320" y2="300" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>',
            '<text x="250" y="360" font-family="sans-serif" font-size="18" font-style="italic" fill="#ffffff" text-anchor="middle">APENAS POR HOJE</text>',
            '</svg>'
        ));
    }

    function uri(uint256 tokenId) public pure returns (string memory) {
        (string memory nameStr, , , string memory motto) = getMilestoneMetadata(tokenId);
        string memory svg = generateSVG(tokenId);

        string memory json = string(abi.encodePacked(
            '{"name": "', nameStr, '",',
            '"description": "Ficha oficial de sobriedade do SobrietyChain. ', motto, '",',
            '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
            '"attributes": [',
            '{"trait_type": "Soulbound", "value": "True"},',
            '{"trait_type": "OnChainMetadata", "value": "100%"},',
            '{"trait_type": "Token Standard", "value": "ERC-5192"}'
            ']}'
        ));

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }
}
