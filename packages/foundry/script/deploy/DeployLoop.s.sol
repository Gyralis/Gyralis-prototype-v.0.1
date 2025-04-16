// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import { BaseScript } from "../Base.s.sol";
import { TestToken } from "src/utils/TestToken.sol";
import "forge-std/console.sol";

contract DeployLoop is BaseScript {
    address public organization;
    address public systemDiamond;
    address public testToken;
    address public loop;

    string public jsonWriteKey = "org";
    string public inputPath;
    string public outputPath;

    function run() public  broadcaster {
        (bool success, bytes memory result) = organization.call(
            abi.encodeWithSignature(
                "createNewLoop(address,address,uint256,uint256)",
                systemDiamond,
                testToken,
                10,
                10
            )
        );

        if (success) {
            loop = abi.decode(result, (address));
            console.log("Loop created at:", loop);
            TestToken(testToken).transfer(loop, 1000 * 1e18);
        } else {
            console.log("Loop creation failed:");
            console.logBytes(result);
            revert("Loop failed");
        }
    }

    function _readInputJson() internal override {
        string memory root = vm.projectRoot();
        string memory chainIdStr = vm.toString(block.chainid);
        inputPath = string.concat(root, "/deployments/organization.", chainIdStr, ".json");
        outputPath = inputPath;

        string memory json = vm.readFile(inputPath);
        organization = vm.parseJsonAddress(json, ".Organization");
        testToken = vm.parseJsonAddress(json, ".TestToken");

        string memory diamondPath = string.concat(root, "/deployments/diamond.", chainIdStr, ".json");
        string memory diamondJson = vm.readFile(diamondPath);
        systemDiamond = vm.parseJsonAddress(diamondJson, ".SystemDiamond");
    }

    function _writeOutputJson() internal override {
        vm.serializeString(jsonWriteKey, "Loop", vm.toString(loop));
        vm.writeJson(jsonWriteKey, outputPath);
    }
}
