// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A contract for swapping and transferring tokens across chains.
contract TokenTransferor is OwnerIsCreator {
    using SafeERC20 for IERC20;

    // Custom errors
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error NothingToWithdraw();
    error FailedToWithdrawEth(address owner, address target, uint256 value);
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector);
    error InvalidReceiverAddress();
    error InsufficientAllowance(address token, uint256 required, uint256 allowance);
    error SwapFailed();
    error ExchangeRateNotSet();

    // Events
    event TokensTransferred(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        address token,
        uint256 tokenAmount,
        address feeToken,
        uint256 fees
    );

    event TokenSwapped(
        address indexed fromToken,
        address indexed toToken,
        uint256 fromAmount,
        uint256 toAmount
    );

    // State variables
    mapping(uint64 => bool) public allowlistedChains;
    mapping(address => mapping(address => uint256)) public exchangeRates;
    IRouterClient private s_router;
    IERC20 private s_linkToken;

    constructor(address _router, address _link) {
        s_router = IRouterClient(_router);
        s_linkToken = IERC20(_link);
    }

    // Modifiers
    modifier onlyAllowlistedChain(uint64 _destinationChainSelector) {
        if (!allowlistedChains[_destinationChainSelector])
            revert DestinationChainNotAllowlisted(_destinationChainSelector);
        _;
    }

    modifier validateReceiver(address _receiver) {
        if (_receiver == address(0)) revert InvalidReceiverAddress();
        _;
    }

    // Functions for chain management
    function allowlistDestinationChain(uint64 _destinationChainSelector, bool allowed) external onlyOwner {
        allowlistedChains[_destinationChainSelector] = allowed;
    }

    // Functions for swap management
    function setExchangeRate(address fromToken, address toToken, uint256 rate) external onlyOwner {
        exchangeRates[fromToken][toToken] = rate;
    }

    // Main function: Swap and Transfer
    function swapAndTransferTokens(
        uint64 _destinationChainSelector,
        address _receiver,
        address _fromToken,
        address _toToken,
        uint256 _fromAmount,
        uint256 _minToAmount
    ) external onlyAllowlistedChain(_destinationChainSelector) validateReceiver(_receiver) returns (bytes32 messageId) {
        // First, swap the tokens
        uint256 swappedAmount = _swapTokens(_fromToken, _toToken, _fromAmount, _minToAmount);

        // Then transfer the swapped tokens
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _toToken,
            swappedAmount,
            address(s_linkToken)
        );

        uint256 fees = s_router.getFee(_destinationChainSelector, evm2AnyMessage);

        if (fees > s_linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

        s_linkToken.approve(address(s_router), fees);
        IERC20(_toToken).approve(address(s_router), swappedAmount);

        messageId = s_router.ccipSend(_destinationChainSelector, evm2AnyMessage);

        emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _toToken,
            swappedAmount,
            address(s_linkToken),
            fees
        );

        return messageId;
    }

    // Internal swap function
    function _swapTokens(
        address _fromToken,
        address _toToken,
        uint256 _fromAmount,
        uint256 _minToAmount
    ) internal returns (uint256) {
        uint256 rate = exchangeRates[_fromToken][_toToken];
        if (rate == 0) revert ExchangeRateNotSet();

        uint256 toAmount = (_fromAmount * rate) / 1e18;
        if (toAmount < _minToAmount) revert SwapFailed();

        IERC20(_fromToken).safeTransferFrom(msg.sender, address(this), _fromAmount);
        IERC20(_toToken).safeTransfer(msg.sender, toAmount);

        emit TokenSwapped(_fromToken, _toToken, _fromAmount, toAmount);

        return toAmount;
    }

    // Existing functions from TokenTransferor
    function transferTokensPayLINK(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    )
        external
        onlyOwner
        onlyAllowlistedChain(_destinationChainSelector)
        validateReceiver(_receiver)
        returns (bytes32 messageId)
    {
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _token,
            _amount,
            address(s_linkToken)
        );

        uint256 fees = s_router.getFee(
            _destinationChainSelector,
            evm2AnyMessage
        );

        if (fees > s_linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

        s_linkToken.approve(address(s_router), fees);

        IERC20(_token).approve(address(s_router), _amount);

        messageId = s_router.ccipSend(
            _destinationChainSelector,
            evm2AnyMessage
        );

        emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _token,
            _amount,
            address(s_linkToken),
            fees
        );

        return messageId;
    }

    function transferTokensPayNative(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    )
        external
        payable
        onlyOwner
        onlyAllowlistedChain(_destinationChainSelector)
        validateReceiver(_receiver)
        returns (bytes32 messageId)
    {
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _token,
            _amount,
            address(0)
        );

        uint256 fees = s_router.getFee(
            _destinationChainSelector,
            evm2AnyMessage
        );

        if (fees > msg.value)
            revert NotEnoughBalance(msg.value, fees);

        IERC20(_token).approve(address(s_router), _amount);

        messageId = s_router.ccipSend{value: fees}(
            _destinationChainSelector,
            evm2AnyMessage
        );

        emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _token,
            _amount,
            address(0),
            fees
        );

        return messageId;
    }

    function _buildCCIPMessage(
        address _receiver,
        address _token,
        uint256 _amount,
        address _feeTokenAddress
    ) private pure returns (Client.EVM2AnyMessage memory) {
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });

        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver),
                data: "",
                tokenAmounts: tokenAmounts,
                extraArgs: Client._argsToBytes(
                    Client.EVMExtraArgsV1({gasLimit: 0})
                ),
                feeToken: _feeTokenAddress
            });
    }

    // Utility functions
    receive() external payable {}

    function withdraw(address _beneficiary) public onlyOwner {
        uint256 amount = address(this).balance;
        if (amount == 0) revert NothingToWithdraw();
        (bool sent, ) = _beneficiary.call{value: amount}("");
        if (!sent) revert FailedToWithdrawEth(msg.sender, _beneficiary, amount);
    }

    function withdrawToken(address _beneficiary, address _token) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));
        if (amount == 0) revert NothingToWithdraw();
        IERC20(_token).safeTransfer(_beneficiary, amount);
    }
}