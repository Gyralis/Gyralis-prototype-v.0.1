## Key Properties (loop)

    Diamond Architecture Implementation
        Uses EIP-2535 Diamond pattern for modular upgrades
        Allows selective feature additions and modifications
        Optimizes gas costs through storage layout

    EIP-7201 Compliance
        Implements namespaced storage pattern
        Prevents storage collisions
        Enables secure contract upgrades

    User Registration System
        Off-chain verification mechanism
        Secure user identity validation
        Role-based access control
        Identity mapping to blockchain addresses

    Claim Management
        Automated registration during first claim
        Validation of claim eligibility
        Secure claim processing pipeline
        Event emission for tracking

    Epoch System
        Time-based periods for claim management
        Reset of claim capabilities at epoch boundaries
        Historical epoch data preservation
        User balances remain untouched across epochs
        Claim window management per epoch
        Configurable epoch duration
