// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import { BaseScript } from "../Base.s.sol";
import "forge-std/console.sol";

contract DeployOrganization is BaseScript {
    address public systemDiamond;
    address public organization;
    string public jsonWriteKey = "org";
    string public inputPath;
    string public outputPath;


    function run() public  broadcaster {
        (bool success, bytes memory result) = systemDiamond.call(
            abi.encodeWithSignature(
                "createOrganization(string,address,string)",
                "1Hive",
                deployer,
                "1Hive DAO Organization"
            )
        );

        if (success) {
            organization = abi.decode(result, (address));
            console.log("Organization created at:", organization);
        } else {
            console.log("Organization creation failed:");
            console.logBytes(result);
            revert("Organization creation failed");
        }
    }

    function _readInputJson() internal override {
        string memory root = vm.projectRoot();
        string memory chainIdStr = vm.toString(block.chainid);
        inputPath = string.concat(root, "/deployments/diamond.", chainIdStr, ".json");
        outputPath = string.concat(root, "/deployments/organization.", chainIdStr, ".json");

        string memory json = vm.readFile(inputPath);
        systemDiamond = vm.parseJsonAddress(json, ".SystemDiamond");
    }

    function _writeOutputJson() internal override {
        vm.serializeString(jsonWriteKey, "Organization", vm.toString(organization));
        vm.writeJson(jsonWriteKey, outputPath);
    }
}
