//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AMM {
    // The IERC20 interface allows us to access the token contracts
    IERC20 private immutable matic;
    IERC20 private immutable goflow;

    uint256 totalShares; // Stores the total amount of share issued for the pool
    uint256 totalMatic; // Stores the amount of Token1 locked in the pool
    uint256 totalGoflow; // Stores the amount of Token2 locked in the pool
    uint256 K; // Algorithmic constant used to determine price

    mapping(address => uint256) shares; // Stores the share holding of each provider

    // Pass the token addresses to the constructor
    constructor(IERC20 _matic, IERC20 _goflow) {
        matic = _matic;
        goflow = _goflow;
    }

    // Liquidity must be provided before we can make swaps from the pool
    modifier activePool() {
        require(totalShares > 0, "Zero Liquidity");
        _;
    }

    modifier validAmountCheck(IERC20 _token, uint256 _amount) {
        require(_amount > 0, "Amount cannot be zero!");
        require(_amount <= _token.balanceOf(msg.sender), "Insufficient amount");
        _;
    }

    modifier validSharesCheck(uint256 _amount) {
        require(_amount > 0, "Share amount cannot be zero!");
        require(_amount <= shares[msg.sender], "Insufficient share amount");
        _;
    }

    // Redefine state variables so we don't get a shadow warning
    function getPoolDetails()
        external
        view
        returns (uint256 maticAmount, uint256 goflowAmount, uint256 ammShares)
    {
        maticAmount = totalMatic;
        goflowAmount = totalGoflow;
        ammShares = totalShares;
    }

    // Allows a user to provide liquidity to the pool
    function provide(
        uint256 _amountMatic,
        uint256 _amountGoflow
    )
        external
        validAmountCheck(matic, _amountMatic)
        validAmountCheck(goflow, _amountGoflow)
        returns (uint256 share)
    {
        if (totalShares == 0) {
            // Initial liquidity provider is issued 100 Shares
            share = 100 * 10 ** 18;
        } else {
            uint256 share1 = totalShares * (_amountMatic / totalMatic);
            uint256 share2 = totalShares * (_amountGoflow / totalGoflow);
            require(
                share1 == share2,
                "Equivalent value of tokens not provided..."
            );
            share = share1;
        }

        require(share > 0, "Asset value less than threshold for contribution!");
        // Important! The frontend must call the token contract's approve function first.
        matic.transferFrom(msg.sender, address(this), _amountMatic);
        goflow.transferFrom(msg.sender, address(this), _amountGoflow);

        totalMatic += _amountMatic;
        totalGoflow += _amountGoflow;
        K = totalMatic * totalGoflow;

        totalShares += share;
        shares[msg.sender] += share;
    }

    // Returns the amount of GOFLOW user will get for given amount of MATIC
    function getSwapMaticEstimate(
        uint256 _amountMatic
    ) public view activePool returns (uint256 amountGoflow) {
        uint256 maticAfter = totalMatic + _amountMatic;
        uint256 goflowAfter = K / maticAfter;
        amountGoflow = totalGoflow - goflowAfter;

        // We don't want to completely empty the pool
        if (amountGoflow == totalGoflow) amountGoflow--;
    }

    // Swaps given amount of MATIC for GOFLOW
    function swapMatic(
        uint256 _amountMatic
    )
        external
        activePool
        validAmountCheck(matic, _amountMatic)
        returns (uint256 amountGoflow)
    {
        amountGoflow = getSwapMaticEstimate(_amountMatic);
        require(
            matic.allowance(msg.sender, address(this)) >= _amountMatic,
            "Insufficient allowance"
        );

        matic.transferFrom(msg.sender, address(this), _amountMatic);
        totalMatic += _amountMatic;
        totalGoflow -= amountGoflow;
        goflow.transfer(msg.sender, amountGoflow);
    }

    // Returns the amount of MATIC user will get for given amount of GOFLOW
    function getSwapGoflowEstimate(
        uint256 _amountGoflow
    ) public view activePool returns (uint256 amountMatic) {
        uint256 GoflowAfter = totalGoflow + _amountGoflow;
        uint256 maticAfter = K / GoflowAfter;
        amountMatic = totalMatic - maticAfter;

        // We don't want to completely empty the pool
        if (amountMatic == totalMatic) amountMatic--;
    }

    // Swaps given amount of GOFLOW for MATIC
    function swapGoflow(
        uint256 _amountGoflow
    )
        external
        activePool
        validAmountCheck(goflow, _amountGoflow)
        returns (uint256 amountMatic)
    {
        amountMatic = getSwapGoflowEstimate(_amountGoflow);

        goflow.transferFrom(msg.sender, address(this), _amountGoflow);
        totalGoflow += _amountGoflow;
        totalMatic -= amountMatic;
        matic.transfer(msg.sender, amountMatic);
    }

    //...

    function getMyHoldings(
        address user
    )
        external
        view
        returns (uint256 maticAmount, uint256 goflowAmount, uint256 myShare)
    {
        maticAmount = matic.balanceOf(user);
        goflowAmount = goflow.balanceOf(user);
        myShare = shares[user];
    }

    // How much MATIC you should also provide when putting _amountGoflow tokens in the pool
    function getEquivalentMaticEstimate(
        uint256 _amountGoflow
    ) public view activePool returns (uint256 reqMatic) {
        reqMatic = totalMatic * (_amountGoflow / totalGoflow);
    }

    // How much GOFLOW you should also provide when putting _amountMatic tokens in the pool
    function getEquivalentGoflowEstimate(
        uint256 _amountMatic
    ) public view activePool returns (uint256 reqGoflow) {
        reqGoflow = totalGoflow * (_amountMatic / totalMatic);
    }

    // Returns the amount of TOKENS you'll be given back with withdrawing your shares
    function getWithdrawEstimate(
        uint256 _share
    )
        public
        view
        activePool
        returns (uint256 amountMatic, uint256 amountGoflow)
    {
        require(_share <= totalShares, "Share should be less than totalShare");
        amountMatic = (_share * totalMatic) / totalShares;
        amountGoflow = (_share * totalGoflow) / totalShares;
    }

    // Removes proportional amount of liquidity from the pool
    function withdraw(
        uint256 _share
    )
        external
        activePool
        validSharesCheck(_share)
        returns (uint256 amountMatic, uint256 amountGoflow)
    {
        (amountMatic, amountGoflow) = getWithdrawEstimate(_share);

        shares[msg.sender] -= _share;
        totalShares -= _share;

        totalMatic -= amountMatic;
        totalGoflow -= amountGoflow;
        K = totalMatic * totalGoflow;

        matic.transfer(msg.sender, amountMatic);
        goflow.transfer(msg.sender, amountGoflow);
    }
}
