// SPDX-License-Identifier: MIT License
pragma solidity >=0.8.20;

import { Script } from "forge-std/Script.sol";
import "forge-std/console2.sol";
import { FacetHelper } from "../contracts/utils/FacetHelper.sol";
import { DiamondCutFacetHelper } from "../contracts/utils/DiamondCutFacetHelper.sol";
import { DiamondLoupeFacetHelper } from "../contracts/utils/DiamondLoupeFacetHelper.sol";
import { AccessControlFacetHelper } from "../contracts/utils/AccessControlFacetHelper.sol";
import { OrganizationFactoryHelper } from "../contracts/utils/OrganizationFactoryHelper.sol";
import { OrganizationHelper } from "../contracts/utils/OrganizationHelper.sol";
import {LoopFactoryHelper} from "../contracts/utils/LoopFactoryHelper.sol";
import {LoopHelper} from "../contracts/utils/LoopHelper.sol";
// import { OwnableFacetHelper } from "test/facets/ownable/ownable.t.sol";
// import { Ownable2StepFacetHelper } from "test/facets/ownable2step/ownable2step.t.sol";
// import { NFTOwnedFacetHelper } from "test/facets/nft-owned/nft-owned.t.sol";
// import { ERC20FacetHelper } from "test/facets/erc20/erc20.t.sol";
// import { ERC20MintableFacetHelper } from "test/facets/erc20-mintable/erc20-mintable.t.sol";
// import { ERC20BurnableFacetHelper } from "test/facets/erc20-burnable/erc20-burnable.t.sol";

contract BaseScript is Script {
    bytes32 internal salt;
    FacetHelper[] internal facetHelpers;
    address deployer;
    address systemAdmin;
    // NOTE this is foundry's generated pk, DOES NOT hold any money
    uint _testerPk = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 ;
    //address trustedBackendSigner = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    modifier broadcaster() virtual{
        //address deployer =  0xa0Ee7A142d267C1f36714E4a8F75612F20a79720;
        //vm.startBroadcast(deployer);
        vm.startBroadcast(_testerPk);
        _;
        vm.stopBroadcast();
    }

    function setUp() public virtual {
        // console2.log("ETH_KEYSTORE_ACCOUNT: %s",vm.envAddress("ETH_KEYSTORE_ACCOUNT"));
        // uint256 privateKey = vm.envUint("ETH_KEYSTORE_ACCOUNT");
        // deployer = vm.rememberKey(privateKey);


        //salt = vm.envBytes32("SALT");
        salt = keccak256('MASSIVA_LA_SALT_BRO');

        facetHelpers.push(new DiamondCutFacetHelper());
        facetHelpers.push(new DiamondLoupeFacetHelper());
        facetHelpers.push(new AccessControlFacetHelper());
        facetHelpers.push(new OrganizationFactoryHelper());
        facetHelpers.push(new OrganizationHelper());
        facetHelpers.push(new LoopFactoryHelper());
        facetHelpers.push(new LoopHelper());

    }
    function resolveKeystoreAccount(string memory accountName) internal returns (address) {
    string[] memory inputs = new string[](4);
    inputs[0] = "cast";
    inputs[1] = "wallet";
    inputs[2] = "address";
    inputs[3] = accountName;

    bytes memory result = vm.ffi(inputs);
    return abi.decode(result, (address));
}
}
