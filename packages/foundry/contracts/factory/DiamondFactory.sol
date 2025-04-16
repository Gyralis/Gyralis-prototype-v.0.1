// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import { Diamond } from "src/Diamond.sol";
import { DiamondFactoryBase } from "./DiamondFactoryBase.sol";
import { IDiamondFactory } from "./IDiamondFactory.sol";

/**
 * @notice Factory that deploys new diamonds.
 * NOTE: This contract is structured so that it can be a facet itself.
 */
contract DiamondFactory is IDiamondFactory, DiamondFactoryBase {

    constructor() {
        owner = msg.sender;
        emit OwnerSet(owner);
    }

    /// @inheritdoc IDiamondFactory
    function createDiamond(Diamond.InitParams calldata initParams) external override onlyAuthorized returns (address diamond) {
        diamond = _createDiamond(initParams);
    }

     function setSystemDiamond(address _systemDiamond) external {
        require(msg.sender == owner, "Not owner");
        systemDiamond = _systemDiamond;
        emit SystemDiamondSet(_systemDiamond);
    }
}
