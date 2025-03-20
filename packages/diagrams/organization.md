## Organization diagrams
> **NOTE** As a reminder, `organization` follows the diamond structure, so you **WON'T** find most of the functions on the desired contract. Those functions are being delegated to other contracts (ej. `DiamondCutFacet`).

```mermaid
classDiagram
    class Diamond {
        +DiamondCut_init()
        +diamondCut(facetCuts, init, initData)
    }

    class Facet {
        +facet : address
        +selectors : bytes4[]
    }

    class IDiamond {
        +FacetCut[] facetCuts
        +FacetCutAction action
    }

    class DiamondLoupe {
        +DiamondLoupe_init()
        +facetAddress(selector: bytes4) address
        +facetAddresses() address[]
        +facetFunctionSelectors(facet: address) bytes4[]
        +facets() Facet[]
        +supportsInterface(interfaceId: bytes4) bool
    }


    class Organization {
        +Organization_init(_name: string, _admin: address, _description: string)
        +addAdmin(newAdmin: address)
        +createNewLoop(systemDiamond: address, token: address, periodLength: uint256, percentPerPeriod: uint256) address
        +getOrganizationAdmin() address
        +getOrganizationDescription() string
        +getOrganizationName() string
        +removeAdmin(adminToRemove: address)
    }

    class Events {
        +DiamondCut(facetCuts: FacetCut[], init: address, initData: bytes)
        +Initialized(version: uint64)
        +Claim(claimer: address, periodNumber: uint256, payout: uint256)
        +FunctionAccessChanged(functionSig: bytes4, role: uint8, enabled: bool)
        +Register(sender: address, periodNumber: uint256)
        +SetPercentPerPeriod(percentPerPeriod: uint256)
        +UserRoleUpdated(user: address, role: uint8, enabled: bool)
        +Withdraw(admin: address, to: address, amount: uint256)
        +LoopCreated(loopAddress: address, token: address, periodLength: uint256, percentPerPeriod: uint256)
        +OrganizationCreated(id: uint256, organizationAddress: address, name: string, admin: address, description: string)
    }
    class OrganizationProxy {
        delegates()
    }
    class Errors {
        +AddressEmptyCode(target: address)
        +CallerIsNotAuthorized()
        +CallerIsNotOwner()
        +DelegateNotAllowed()
        +DiamondCut_CannotRemoveFromOtherFacet(facet: address, selector: bytes4)
        +DiamondCut_FacetIsNotContract(facet: address)
        +DiamondCut_FacetIsZeroAddress()
        +DiamondCut_FunctionAlreadyExists(selector: bytes4)
        +DiamondCut_FunctionFromSameFacet(selector: bytes4)
        +DiamondCut_ImmutableFacet()
        +DiamondCut_IncorrectFacetCutAction()
        +DiamondCut_InitIsNotContract(init: address)
        +DiamondCut_NonExistingFunction(selector: bytes4)
        +DiamondCut_SelectorArrayEmpty(facet: address)
        +DiamondCut_SelectorIsZero()
        +FailedCall()
        +InvalidInitialization()
        +NotInitializing()
        +OnlyDelegate()
        +ReentrancyGuardReentrantCall()
        +AccessControl_CallerIsNotAuthorized()
        +AccessControl_CannotRemoveAdmin()
        +AlreadyRegistered()
        +CannotClaim()
        +FaucetBalanceIsZero()
        +InvalidPeriodLength()
        +InvalidPeriodPercentage()
        +NotAuthorized()
    }
    OrganizationProxy-->Facet
    Facet --> Diamond
    Diamond --> IDiamond
    Facet --> DiamondLoupe
    Facet --> Errors
    Facet --> Events
    Facet-->Organization
```
