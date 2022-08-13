// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract MagicBeans {
    uint256 private constant DAY_IN_SECONDS = 10; //for final version should be seconds in a day 86400
    uint8 private constant OWNER_FEE_PERCENT = 5;
    uint8 private constant DAILY_PERCENT = 5;

    address payable public owner;
    mapping(address => uint256) public Beans;
    mapping(address => uint256) public lastHarvest;

    constructor() {
        owner = payable(msg.sender);
    }

    function plantBeans() public payable {
        rePlantBeans();

        uint256 ownersFee = (msg.value * OWNER_FEE_PERCENT) / 100;
        uint256 clearValue = msg.value - ownersFee;

        Beans[msg.sender] = Beans[msg.sender] + clearValue;

        payable(owner).transfer(ownersFee);
    }

    function sellHarvest() external {
        uint256 hasBeans = howManyBeansGrown(msg.sender);

        require(hasBeans > 0, "You have not Beans for sale!");
        require(address(this).balance >= hasBeans, "Money ran out!");

        lastHarvest[msg.sender] = block.timestamp;

        payable(msg.sender).transfer(hasBeans);
    }

    function rePlantBeans() public {
        uint256 hasBeans = howManyBeansGrown(msg.sender);

        if (hasBeans > 0) Beans[msg.sender] = Beans[msg.sender] + hasBeans;

        lastHarvest[msg.sender] = block.timestamp;
    }

    function howManyBeansGrown(address _adr) public view returns (uint256) {
        uint256 amount = (Beans[_adr] *
            DAILY_PERCENT *
            (block.timestamp - lastHarvest[_adr])) / (DAY_IN_SECONDS * 100);
        return amount;
    }

    receive() external payable {
        plantBeans();
    }
}
