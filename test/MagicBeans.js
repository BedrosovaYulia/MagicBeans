const { expect } = require("chai");
const { ethers } = require("hardhat");
let accounts;
let myMagicBeansContract;

describe("MagicBeans", function () {
  it("Contract should be successfully deployed", async function () {
    accounts = await ethers.getSigners();
    MagicBeansContract = await ethers.getContractFactory("MagicBeans");
    myMagicBeansContract = await MagicBeansContract.deploy();
    await myMagicBeansContract.deployed();
    expect(await myMagicBeansContract.owner()).to.equal(accounts[0].address);
  });

  it("Hamster№1 should has 9.5 beans planted", async function () {
    const amount = new ethers.BigNumber.from(10).pow(16).mul(100);
    const expectedBalance = new ethers.BigNumber.from(10).pow(16).mul(95);
    await myMagicBeansContract.connect(accounts[1]).plantBeans({ value: amount });
    const beans = await myMagicBeansContract.Beans(accounts[1].address);
    console.log("Hamster№1 has "+beans+" beans planted");
    expect(beans).to.equal(expectedBalance);
  });

  it("Hamster№1 should has 9.5 beans for sale", async function () {
    await network.provider.send("evm_increaseTime", [200]);
    await network.provider.send("evm_mine");
    const expectedBalance = new ethers.BigNumber.from(10).pow(16).mul(95);
    const beansForSale = await myMagicBeansContract.connect(accounts[1]).howManyBeansGrown(accounts[1].address);
    console.log("Hamster№1 has " + beansForSale + " beans for sale");
    expect(beansForSale).to.equal(expectedBalance);
  });

  it("Hamster№2 should has 19 beans planted", async function () {
    const amount = new ethers.BigNumber.from(10).pow(16).mul(100);
    const expectedBalance = new ethers.BigNumber.from(10).pow(16).mul(190);
    await myMagicBeansContract.connect(accounts[2]).plantBeans({ value: amount });
    await network.provider.send("evm_increaseTime", [200]);
    await myMagicBeansContract.connect(accounts[2]).rePlantBeans();
    const beans = await myMagicBeansContract.Beans(accounts[2].address);
    console.log("Hamster№2 has " + beans + " beans planted");
    expect(beans).to.equal(expectedBalance);
  });

  it("Hamster№2 should make good money", async function () {
    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");
    await myMagicBeansContract.connect(accounts[2]).sellHarvest();
  });


});
