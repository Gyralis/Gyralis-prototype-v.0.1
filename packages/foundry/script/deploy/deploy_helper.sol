// SPDX-License-Identifier: MIT License
pragma solidity >=0.8.20;

import { Script , console2 } from "forge-std/Script.sol";
abstract contract DeployHelper is Script{
    //@custom:internal-vars
    bytes32 internal salt;
    uint internal deployer_pk;
    bytes32 internal deployment_chain;
    address deployer_address;

    modifier broadcaster() virtual {
        salt = vm.envBytes32("SALT");
        deployer_address = vm.envAddress('DEPLOYER_ADD');
        deployer_pk = vm.envUint('DEPLOYER_PK');
        deployment_chain = vm.envBytes32('CHAIN_NAME');
        console2.log('Deploying to',uint(deployment_chain));
        console2.log('Deploying by',deployer_address);
        vm.startBroadcast();
        _;
        vm.stopBroadcast();
    }
}
