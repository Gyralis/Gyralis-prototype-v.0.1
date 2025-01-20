pragma solidity >=0.8.20;

library OrganizationFactoryStorage {
    bytes32 constant FACET_ORGANIZATION_FACTORY_STORAGE_POSITION = keccak256("diamond.organization.factory.storage");

    struct Layout {
        mapping(uint256 => address) organizationById;
        uint256 organizationCounter;
        address diamondFactory;
        address facetRegistry;

    }

    function layout() internal pure returns (Layout storage ds) {
        bytes32 position = FACET_ORGANIZATION_FACTORY_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }
}