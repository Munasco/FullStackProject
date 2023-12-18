//SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract CurrencyConverter {
    function getLatestPrice(address aggregatorAddress) public view returns (int) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(aggregatorAddress);
       (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return answer;
    }
}

