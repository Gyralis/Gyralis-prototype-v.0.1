// SPDX-License-Identifier: MIT License
pragma solidity >=0.8.20;

import { IFacetRegistry } from "./IFacetRegistry.sol";
import { FacetRegistryBase } from "./FacetRegistryBase.sol";

contract FacetRegistry is IFacetRegistry, FacetRegistryBase {
    // todo: add owner protection

    constructor() {
        owner = msg.sender;
        emit OwnerSet(owner);
    }

    /// @inheritdoc IFacetRegistry
    function addFacet(address facet, bytes4[] memory selectors) external onlyOwner {
        _addFacet(facet, selectors);
    }

    /// @inheritdoc IFacetRegistry
    function removeFacet(address facet) external onlyOwner {
        _removeFacet(facet);
    }

    /// @inheritdoc IFacetRegistry
    function deployFacet(
        bytes32 salt,
        bytes memory creationCode,
        bytes4[] memory selectors
    )
        external
        override
        onlyOwner
        returns (address facet)
    {
        facet = _deployFacet(salt, creationCode, selectors);
    }

    /// @inheritdoc IFacetRegistry
    function computeFacetAddress(
        bytes32 salt,
        bytes memory creationCode
    )
        external
        view
        override
        returns (address facet)
    {
        facet = _computeFacetAddress(salt, creationCode);
    }

    /// @inheritdoc IFacetRegistry
    function facetSelectors(address facet) external view returns (bytes4[] memory) {
        return _facetSelectors(facet);
    }

    /// @inheritdoc IFacetRegistry
    function facetAddresses() external view returns (address[] memory) {
        return _facetAddresses();
    }

     function getFacetBySelector(bytes4 selector) external view returns (address) {
        return _getFacetBySelector(selector);
     }
}
