// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AggregatorV3Interface.sol";

contract Donation {
    event DonationReceived(address indexed donor, uint256 amount);

    AggregatorV3Interface internal priceFeed;

    constructor(address _priceFeedAddress) {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    function donate() external payable {
        emit DonationReceived(msg.sender, msg.value);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getContractBalanceInUSD() external view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 contractBalance = address(this).balance;
        uint256 decimals = uint256(priceFeed.decimals());
        uint256 contractBalanceInUSD = (contractBalance * uint256(price)) / (10**decimals);
        return contractBalanceInUSD;
    }
}
