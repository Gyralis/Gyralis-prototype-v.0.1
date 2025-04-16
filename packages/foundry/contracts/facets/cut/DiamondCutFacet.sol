// SPDX-License-Identifier: MIT License
pragma solidity >=0.8.20;

import { IDiamondCut, IDiamond } from "./IDiamondCut.sol";
import { Facet } from "../Facet.sol";
import { DiamondCutBase } from "./DiamondCutBase.sol";

contract DiamondCutFacet is IDiamondCut, DiamondCutBase, Facet {
    function DiamondCut_init(address _systemAdmin) external onlyInitializing {
        _addInterface(type(IDiamondCut).interfaceId);
        _setSystemAdmin(_systemAdmin);
    }

    /// @inheritdoc IDiamondCut
    function diamondCut(
        IDiamond.FacetCut[] memory facetCuts,
        address init,
        bytes memory initData
    )
        external
        onlySystemAdmin
        reinitializer(_getInitializedVersion() + 1)
    {
        _diamondCut(facetCuts, init, initData);
    }

    function setSystemAdmin(address _admin) external onlyDiamondOwner {
        _setSystemAdmin(_admin);
    }
}
