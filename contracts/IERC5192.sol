// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title EIP-5192 Minimal Soulbound Token Interface
/// @notice Interface conforme definido na especificação oficial EIP-5192.
interface IERC5192 {
    /// @notice Emitido quando um token se torna permanentemente bloqueado (Soulbound)
    event Locked(uint256 tokenId);

    /// @notice Emitido caso um token seja desbloqueado (não utilizado neste protocolo)
    event Unlocked(uint256 tokenId);

    /// @notice Retorna se o token está bloqueado (intransferível)
    /// @param tokenId Identificador do token
    /// @return true se o token for Soulbound (sempre true no SobrietyChain)
    function locked(uint256 tokenId) external view returns (bool);
}
