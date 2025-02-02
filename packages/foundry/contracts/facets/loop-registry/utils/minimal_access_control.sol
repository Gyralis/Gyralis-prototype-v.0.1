// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;


library AccessControlStorage {
    bytes32 internal constant STORAGE_SLOT = keccak256("access-control.storage");

    struct Layout {
        mapping(address user => bytes32 roles) userRoles;
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}

abstract contract MinimalAccressControl {
     /**
     * @notice Emitted when a user role is updated.
     * @param user The user whose role is updated.
     * @param role The role that is updated.
     * @param enabled Whether the role is enabled.
     */
    event UserRoleUpdated(address indexed user, uint8 indexed role, bool enabled);

    function _setUserRole(address user, uint8 role, bool enabled) internal {
        if (enabled) {
            AccessControlStorage.layout().userRoles[user] |= bytes32(1 << role);
        } else {
            AccessControlStorage.layout().userRoles[user] &= ~bytes32(1 << role);
        }

        emit UserRoleUpdated(user, role, enabled);
    }
}
