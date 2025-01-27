// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IOrganizationFactory {

    /**
     * @dev Emitted when a new organization is created.
     * @param id The unique identifier of the organization.
     * @param organizationAddress The address of the newly created organization contract.
     * @param name The name of the organization.
     * @param admin The address of the organization admin.
     * @param description A description of the organization.
     */
    event OrganizationCreated(
        uint256 indexed id,
        address indexed organizationAddress,
        string name,
        address indexed admin,
        string description
    );

    /**
     * @notice Initializes the OrganizationFactoryFacet.
     */
    function OrganizationFactory_init(address diamondFactory, address facetRegistry) external;

    /**
     * @notice Creates a new Organization contract.
     * @param name The name of the organization.
     * @param admin The address of the organization admin.
     * @param description The description of the organization.
     */
    function createOrganization(string memory name, address admin, string memory description) external;

    /**
     * @notice Fetches an organization address by ID.
     * @param id The ID of the organization.
     * @return address The address of the organization contract.
     */
    function getOrganizationById(uint256 id) external view returns (address);

    /**
     * @notice Fetches the total number of created organizations.
     * @return uint256 The total count of organizations.
     */
    function getOrganizationCount() external view returns (uint256);
}
