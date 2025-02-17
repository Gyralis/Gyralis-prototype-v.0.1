pragma solidity >=0.8.20;

library OrganizationStorage {
    bytes32 constant STORAGE_POSITION = keccak256("diamond.organization.storage");

    struct Layout {
        string name;
        address admin;
        string description;
        mapping(address => bool) faucets;
    }

    function layout() internal pure returns (Layout storage ds) {
        bytes32 position = STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }
}