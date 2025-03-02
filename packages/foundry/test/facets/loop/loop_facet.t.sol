// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import {Test,console2} from "forge-std/Test.sol";
import{LoopFacet,ILoop} from 'contracts/facets/loop/LoopFacet.sol';
import {IERC20,MockERC20 as ERC20} from 'forge-std/mocks/MockERC20.sol';

contract BadToken {}

contract LoopFacetBaseTest is Test {
  LoopFacet loop;
  ERC20 token;
  address [] bad_addresses;
  address admin;
  Account be_signer = makeAccount("back_end_signer");

  function setUp() public virtual{
    admin = makeAddr('ADMIN_SENDER');
    token = new ERC20();
    token.initialize('MOKC TOKEN','mTKN',18);
    loop = new LoopFacet();
    bad_addresses.push(address(0));
    bad_addresses.push(makeAddr('BAD_ADD'));
    bad_addresses.push(address(new BadToken()));
  } 
 
}
contract LoopFacet_Initializer is LoopFacetBaseTest {
  // Address (0)
  // Code len == 0
  // !supportsInterface
  function test_init_reverts_invalid_token(uint8 _l) external{
    _l = uint8(bound(_l,0,2));
    address bad_addr = bad_addresses[_l];
    vm.expectRevert(ILoop.INVALID_ADDRESS.selector);
    loop.Loop_init(bad_addr,admin,11,11,be_signer.addr);
  }
  function test_init_bad_loop_admin()external{
    vm.expectRevert(ILoop.INVALID_ADMIN_ADDRESS.selector);
    loop.Loop_init(address(token),address(0),11,11,be_signer.addr);
  }
  function test_init_reverts_invalid_period_len()external{
    vm.expectRevert(ILoop.InvalidPeriodLength.selector);
    loop.Loop_init(address(token),admin,0,11,be_signer.addr);
  }
  function test_init_reverts_bad_percentPerPeriod(uint8 _a)external{
    _a=uint8(bound(_a,0,1));
    uint8 [2] memory _m = [0,101];
    vm.expectRevert(ILoop.InvalidPeriodPercentage.selector);
    loop.Loop_init(address(token),admin,1,_m[_a],be_signer.addr);
  }
  function test_init_ok()external{
    vm.expectEmit(address(loop));
    emit ILoop.Initialize(address(token),11,11);
    loop.Loop_init(address(token),admin,11,11,be_signer.addr);
  }
  function test_init_reinit()external{
    vm.expectEmit(address(loop));
    emit ILoop.Initialize(address(token),11,11);
    loop.Loop_init(address(token),admin,11,11,be_signer.addr);
    vm.expectRevert();
    loop.Loop_init(address(token),admin,11,11,be_signer.addr);
  }
}

contract LoopFacet_AuthedFunctionsTest is LoopFacetBaseTest {

  function test_set_trusted_backend_signer_reverts_unauthorized() external {
    address _badSender = makeAddr('bad_sender');
    address _admin = makeAddr('ADDR');
    vm.prank(_badSender);
    vm.expectRevert();
    loop.setTrustedBackendSigner(_admin);
  }
  function test_set_trusted_backend_signer_reverts_bad_address() external {
    address _badSender = makeAddr('bad_sender');
    address _admin = address(0);
    vm.prank(admin);
    vm.expectRevert();
    loop.setTrustedBackendSigner(_admin);
  }
  function test_set_trusted_backend_signer_ok() external {
    address _badSender = makeAddr('bad_sender');
    address _admin = makeAddr('ADDR');
    vm.prank(admin);
    vm.expectEmit(address(loop));
    emit ILoop.TrustedBackendSignerUpdated(_admin);
    loop.setTrustedBackendSigner(_admin);
  }
} 

contract LoopFacet_SetPercentTest is LoopFacetBaseTest {
  function setUp() public virtual override {
    super.setUp();
    vm.expectEmit(address(loop));
    emit ILoop.Initialize(address(token),11,11);
    loop.Loop_init(address(token),admin,11,11,be_signer.addr);
  }
  function test_set_percent_reverts_unauthorized()external {
    address _badSender = makeAddr('bad_sender');
    vm.prank(_badSender);
    vm.expectRevert();
    loop.setPercentPerPeriod(50);
  }
  function test_set_percent_reverts_bad_percentage ()external {
    vm.prank(admin);
    vm.expectRevert();
    loop.setPercentPerPeriod(101);
  }
  function test_set_percent_ok() external {
    address _admin = makeAddr('ADDR');
    uint8 _p = 55;
    vm.prank(admin);
    vm.expectEmit(address(loop));
    emit ILoop.SetPercentPerPeriod(_p);
    loop.setPercentPerPeriod(_p);
    (,,uint p_stored,)=loop.getLoopDetails();
    assertEq(uint8(p_stored),_p,'stored!=sent');
  }
}
