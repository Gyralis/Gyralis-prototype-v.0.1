// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import { BaseScript } from "../Base.s.sol";
import { TestToken } from "src/utils/TestToken.sol";
import "forge-std/console.sol";

contract DeployTestToken is BaseScript {
    TestToken public token;
    string public jsonWriteKey = "org";
    string public outputPath;

    function run() public  broadcaster {
        token = new TestToken("Honey", "HNY");
    }

    function _readInputJson() internal override {
        string memory root = vm.projectRoot();
        string memory chainIdStr = vm.toString(block.chainid);
        outputPath = string.concat(root, "/deployments/organization.", chainIdStr, ".json");
    }

    function _writeOutputJson() internal override {
        vm.serializeString(jsonWriteKey, "TestToken", vm.toString(address(token)));
        vm.writeJson(jsonWriteKey, outputPath);
        console.log("TestToken deployed at:", address(token));
    }
}
