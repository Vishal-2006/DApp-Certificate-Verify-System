// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AcademicSBT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("RamcoInstituteSBT", "RITSBT") Ownable(msg.sender) {}

    // 1. MINT FUNCTION
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // 2. SOULBOUND LOGIC (Fixed Warnings)
    // We removed variable names (from, to, tokenId) to stop "Unused Variable" warnings.
    // We added 'pure' because we are not reading state, just crashing the transaction.

    function transferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert("Soulbound: Transfer is not allowed");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override(ERC721, IERC721) {
        revert("Soulbound: Transfer is not allowed");
    }

    // REQUIRED OVERRIDES
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}