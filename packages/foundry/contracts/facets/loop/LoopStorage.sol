// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import{IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

library LoopStorage {
    bytes32 internal constant STORAGE_SLOT = keccak256("diamond.loop.storage");

    struct Layout {
        address loopAdmin;
        IERC20 token;
        uint256 periodLength;
        uint256 percentPerPeriod;
        uint256 firstPeriodStart;
        address trustedBackendSigner;
        mapping(address => Claimer) claimers;
        mapping(uint256 => Period) periods;
    }

    struct Claimer {
        uint256 registeredForPeriod;
        uint256 latestClaimPeriod;
    }

    struct Period {
        uint256 totalRegisteredUsers;
        uint256 maxPayout;
    }

    function layout() internal pure returns (Layout storage ds) {
        bytes32 position = STORAGE_SLOT;
        assembly {
            ds.slot := position
        }
    }
}
