// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import {Test,console2} from "forge-std/Test.sol";
import{LoopFacet,LoopStorage} from 'contracts/facets/loop/LoopFacet.sol';

import{ILoop} from 'contracts/facets/loop/LoopFacet.sol';
import {IERC20,MockERC20 as ERC20} from 'forge-std/mocks/MockERC20.sol';

import { MessageHashUtils } from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract BadToken {}
contract WERC20 is ERC20 {
  function mint(address _rec, uint _am) external {
    _mint(_rec,_am);
  }
}
contract WLoopFacet is LoopFacet {

  function getPeriodMaxPayout() external view returns(uint) {
    return _getPeriodMaxPayout(LoopStorage.layout().token.balanceOf(address(this)));
  }
  function getPeriodIndividualPayout() external /*view*/ returns(uint) {
    LoopStorage.Layout storage ds = LoopStorage.layout();
    uint256 currentPeriod = getCurrentPeriod();
    LoopStorage.Period storage period = ds.periods[currentPeriod];
    return _getPeriodIndividualPayout(period);
  }
  function getClaimerData(address _claimer) external view returns(uint,uint){
    LoopStorage.Claimer storage ds = LoopStorage.layout().claimers[_claimer];
    return (ds.registeredForPeriod,ds.latestClaimPeriod);
  }
}

contract LoopFacetBaseTest is Test {
  event Initialize(address indexed token, uint256 periodLength, uint256 percentPerPeriod);
  event Register(address indexed sender, uint256 periodNumber);
  event TrustedBackendSignerUpdated(address indexed newSigner);
  event SetPercentPerPeriod(uint256 percentPerPeriod);
  event Claim(address indexed claimer, uint256 periodNumber, uint256 payout);
  event Transfer(address indexed from, address indexed to, uint256 value);

  WLoopFacet loop;
  WERC20 token;
  address [] bad_addresses;
  address admin;
  Account be_signer = makeAccount("back_end_signer");

  function setUp() public virtual{
    admin = makeAddr('ADMIN_SENDER');
    token = new WERC20();
    token.initialize('MOKC TOKEN','mTKN',18);
    loop = new WLoopFacet();
    bad_addresses.push(address(0));
    bad_addresses.push(makeAddr('BAD_ADD'));
    bad_addresses.push(address(new BadToken()));
  } 
 
  function _randAddr(uint _am) internal returns(address[]memory) {
    address[]memory _a = new address[](_am);
    for(uint i = 0;i<_am;i++){
      _a[i] = makeAddr(string.concat('USER#',Strings.toString(_am)));
    }
    return _a;
  }
  function _digestAndSign(address _claimer,uint _nextPeriod) internal view returns (bytes memory) {
    bytes32 _digestedMsg = keccak256(abi.encodePacked(_claimer,_nextPeriod,address(loop)));
    bytes32 eth_msg_hash = MessageHashUtils.toEthSignedMessageHash(_digestedMsg);
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(be_signer.key, eth_msg_hash);
    return abi.encodePacked(r, s, v);
  }

  modifier allowClaimer(address _claimer) virtual {
     uint _nextPeriod = loop.getCurrentPeriod() +1;
     address [] memory  _extraUsers = _randAddr(_nextPeriod); 
     bytes memory _signature;
     for(uint i = 0;i<_nextPeriod;i++){
       address _a = _extraUsers[i];
       _signature = _digestAndSign(_a, _nextPeriod);
       vm.prank(_a);
       vm.expectEmit(address(loop));
       emit Register(_a,_nextPeriod); 
       loop.claimAndRegister(_signature);
     }
     _signature = _digestAndSign(_claimer, _nextPeriod);
     vm.prank(_claimer);
     vm.expectEmit(address(loop));
     emit Register(_claimer,_nextPeriod); 
     loop.claimAndRegister(_signature);
     vm.warp(block.timestamp + 101);
    _;
  }
  modifier validAdd(address _claimer) {
    vm.assume(_claimer != address(loop));
    vm.assume(address(this)!= _claimer);
    vm.assume(_claimer != address(0));
    vm.assume(_claimer != be_signer.addr);
    _;
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
    emit Initialize(address(token),11,11);
    loop.Loop_init(address(token),admin,11,11,be_signer.addr);
  }
  function test_init_reinit()external{
    vm.expectEmit(address(loop));
    emit Initialize(address(token),11,11);
    loop.Loop_init(address(token),admin,11,11,be_signer.addr);
    vm.expectRevert();
    loop.Loop_init(address(token),admin,11,11,be_signer.addr);
  }
}

contract LoopFacet_AuthedFunctionsTest is LoopFacetBaseTest {
  function setUp() public virtual override {
    super.setUp();
    vm.expectEmit(address(loop));
    emit Initialize(address(token),11,11);
    loop.Loop_init(address(token),admin,11,11,be_signer.addr);
  }
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
  function test_set_trusted_backend_signer_same_as_contract() external {
    vm.prank(admin);
    vm.expectRevert(ILoop.INVALID_SIGNER_ADDRESS.selector);
    loop.setTrustedBackendSigner(address(loop));
  }
  function test_set_trusted_backend_signer_ok() external {
    address _admin = makeAddr('ADDR');
    vm.prank(admin);
    vm.expectEmit(address(loop));
    emit TrustedBackendSignerUpdated(_admin);
    loop.setTrustedBackendSigner(_admin);
  }
} 

contract LoopFacet_SetPercentTest is LoopFacetBaseTest {
  function setUp() public virtual override {
    super.setUp();
    vm.expectEmit(address(loop));
    emit Initialize(address(token),11,11);
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
    emit SetPercentPerPeriod(_p);
    loop.setPercentPerPeriod(_p);
    (,,uint p_stored,)=loop.getLoopDetails();
    assertEq(uint8(p_stored),_p,'stored!=sent');
  }
}

contract LoopFacer_externalFuncsTest is LoopFacetBaseTest{
  function setUp() public virtual override {
    uint32 _n = 100;
    super.setUp();
    vm.expectEmit(address(loop));
    emit Initialize(address(token),_n,_n);
    loop.Loop_init(address(token),admin,_n,_n,be_signer.addr);
  }
  /**
    functions 
    1. getCurrentPeriod() -> ??
    2. _getPeriodMaxPayout        [needs wrapper] 
    3. _getPeriodIndividualPayout [needs wrapper]
  */  
  
  function test_period_always_is_valid(uint8 _delta) external {
    _delta = uint8(bound(_delta,0,120));
    uint expected = _delta>99? 4:3;
    vm.warp(block.timestamp +  5 minutes + _delta);
    uint t = loop.getCurrentPeriod();
    assertEq(t,expected,'smth went wrong');
  } 
}

contract LoopFacet_claimTest is LoopFacetBaseTest {
  function setUp() public virtual override {
    uint32 _n = 100;
    super.setUp();
    vm.expectEmit(address(loop));
    emit Initialize(address(token),_n,_n);
    loop.Loop_init(address(token),admin,_n,_n,be_signer.addr);
  }
  /**
   *  Cases(claimAndRegister)
   *  - claimer is not registered to z period
   *  - signature doesn't verofy
   *  - user can't claim
   *  - _claim
   *    - balance == 0
   *    - not enough token balance (not handled)
   *  claim)
   *  - user can't claim
   *  - _claim
   *    - balance == 0
   *    - not enough token balance (not handled)
  **/
  function test_claim_user_cant_claim() external {
    address w = makeAddr('RANDOM');
    vm.prank(w);
    vm.expectRevert(ILoop.CannotClaim.selector);
    loop.claim();
  }
  function test_claims_not_even_a_unit(uint8 _am,address _claimer) external validAdd(_claimer) allowClaimer(_claimer){
    token.mint(address(loop),1);
    uint _period = loop.getCurrentPeriod() ;
    vm.prank(_claimer);
    vm.expectEmit(address(token));
    emit Transfer(address(loop),_claimer,0);
    vm.expectEmit(address(loop));
    emit Claim(_claimer,_period,0);
    loop.claim();
    // quedo grabado en el st?
    (uint _r,uint _c)= loop.getClaimerData(_claimer);
    assertEq(_r,_c);
    assertEq(_r,1);
  }
  function test_claims_smth(address _claimer) external validAdd(_claimer) allowClaimer(_claimer){
    uint am = 1.09212e18;
    token.mint(address(loop),am);
    uint _period = loop.getCurrentPeriod() ;
    uint _expected = am/ (_period +1) ;
    vm.prank(_claimer);
    vm.expectEmit(address(token));
    emit Transfer(address(loop),_claimer,_expected);
    vm.expectEmit(address(loop));
    emit Claim(_claimer,_period,_expected);
    loop.claim();
    // quedo grabado en el st?
    (uint _r,uint _c)= loop.getClaimerData(_claimer);
    assertEq(_r,_c);
    assertEq(_r,1);
    (uint t, uint m ) = loop.getCurrentPeriodData();
    assertEq(t,_period+1);
    assertEq(m,_expected*2);
  }
}  

contract LoopFacet_ClaimWSignature is LoopFacetBaseTest {
    uint32 delta_period;
    uint32 percentaje;
    function _nextPeriod() internal {
       vm.warp(block.timestamp + delta_period + 1);
    }
    function setUp() public virtual override {
      delta_period= 100;
      percentaje = delta_period /2;
      uint32 _n = delta_period;
      super.setUp();
      vm.expectEmit(address(loop));
      emit Initialize(address(token),_n,percentaje);
      loop.Loop_init(address(token),admin,_n,percentaje,be_signer.addr);
    }
    function test_claimAndRegister_invalidSignature() external {
        address user = makeAddr("USER_WITH_BAD_SIG");
        uint nextPeriod = loop.getCurrentPeriod() + 1;
        bytes memory fakeSignature = _digestAndSign(makeAddr("FAKE_USER"), nextPeriod);

        vm.prank(user);
        vm.expectRevert(bytes("Invalid eligibility signature"));

        loop.claimAndRegister(fakeSignature);
    }
    function test_claimAndRegister_cannotClaim() external {
        address user = makeAddr("USER_NO_CLAIM");
        uint nextPeriod = loop.getCurrentPeriod() + 1;
        bytes memory signature = _digestAndSign(user, nextPeriod);

        vm.prank(user);
        loop.claimAndRegister(signature);

        // Se adelanta el tiempo para simular el bloqueo de claim
        vm.prank(user);
        vm.expectRevert(ILoop.CannotClaim.selector);
        loop.claim();
    }

    function test_claimAndRegister_withZeroBalance() external {
        address user = makeAddr("USER_ZERO_BALANCE");
        uint nextPeriod = loop.getCurrentPeriod() + 1;
        bytes memory signature = _digestAndSign(user, nextPeriod);

        vm.prank(user);
        loop.claimAndRegister(signature);

        uint period = loop.getCurrentPeriod();

        _nextPeriod();
        vm.prank(user);
        vm.expectRevert(ILoop.FaucetBalanceIsZero.selector);
        loop.claim();

        (uint r, uint c) = loop.getClaimerData(user);
        assertEq(0, c, "Claimed MUST be zero");
        assertEq(r, 1, "User SHOULD be registered ok");
    }

    function test_claimAndRegister_withBalance() external {
        address user = makeAddr("USER_BALANCE");
        uint am = 1.09212e18;
        token.mint(address(loop), am);
        uint nextPeriod = loop.getCurrentPeriod() + 1;
        bytes memory signature = _digestAndSign(user, nextPeriod);

        vm.prank(user);
        loop.claimAndRegister(signature);
        
        _nextPeriod();
        uint period = loop.getCurrentPeriod();
        (,,uint percentage,) = loop.getLoopDetails();
        uint expectedClaim = (am /100)*percentage;
        vm.prank(user);
        vm.expectEmit(address(token));
        emit Transfer(address(loop), user, expectedClaim);
        vm.expectEmit(address(loop));
        emit Claim(user, period, expectedClaim);

        loop.claim();

        (uint r, uint c) = loop.getClaimerData(user);
        assertEq(r, c, "claim and register MUST be equal");
        assertEq(r, 1, "User SHOULD be registered ok");

        (uint total, uint minted) = loop.getCurrentPeriodData();
        assertEq(total, 1, "Total registered incorrect");
        assertEq(minted, expectedClaim, "Minted is equal to expected claim");
    }
}


