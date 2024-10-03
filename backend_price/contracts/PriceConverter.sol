// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceConverter {

    function getDerivedPrice(
        address _base,
        address _quote
    ) public view returns (int256) {
        (, int256 basePrice, , , ) = AggregatorV3Interface(_base).latestRoundData();
        uint8 baseDecimals = AggregatorV3Interface(_base).decimals();

        (, int256 quotePrice, , , ) = AggregatorV3Interface(_quote).latestRoundData();
        uint8 quoteDecimals = AggregatorV3Interface(_quote).decimals();

        int256 scaledBasePrice = scalePrice(basePrice, baseDecimals, 18);
        int256 scaledQuotePrice = scalePrice(quotePrice, quoteDecimals, 18);

        return (scaledBasePrice * 1e18) / scaledQuotePrice;
    }

    function scalePrice(
        int256 _price,
        uint8 _priceDecimals,
        uint8 _decimals
    ) internal pure returns (int256) {
        if (_priceDecimals < _decimals) {
            return _price * int256(10 ** uint256(_decimals - _priceDecimals));
        } else if (_priceDecimals > _decimals) {
            return _price / int256(10 ** uint256(_priceDecimals - _decimals));
        }
        return _price;
    }
}
