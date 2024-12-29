import { expect } from "chai";
import { ethers } from "hardhat";
import { Voting } from "../typechain-types";

describe("Voting", function () {
  let voting: Voting;

  before(async () => {
    const VotingFactory = await ethers.getContractFactory("Voting");
    voting = (await VotingFactory.deploy()) as Voting;
    await voting.waitForDeployment();
  });

  // it("Should allow creating an election", async function () {
  //   const options = ["Option 1", "Option 2"];
  //   await voting.createElection("Test Election", options, 3600);
  //   const election = await voting.elections(0);

  //   expect(election.name).to.equal("Test Election");
  //   expect(await voting.getOptions(0)).to.deep.equal(options);
  // });

  // it("Should allow creating multiple elections", async function () {
  //   const elections = [
  //     { name: "Favorite Color", options: ["Red", "Blue", "Green"] },
  //     { name: "Best Programming Language", options: ["JavaScript", "Python", "Rust"] },
  //     { name: "Preferred Drink", options: ["Coffee", "Tea", "Juice"] },
  //   ];

  //   for (const [index, election] of elections.entries()) {
  //     await voting.createElection(election.name, election.options, 3600);
  //     const createdElection = await voting.elections(index + 1);

  //     expect(createdElection.name).to.equal(election.name);
  //     expect(await voting.getOptions(index + 1)).to.deep.equal(election.options);
  //   }
  // });

  // it("Should allow voting for an option", async function () {
  //   await voting.vote(0, 1);
  //   const results = await voting.getResults(0);

  //   expect(results[1]).to.equal(1);
  // });

  // it("Should prevent double voting", async function () {
  //   await expect(voting.vote(0, 1)).to.be.revertedWith("You have already voted");
  // });

  // it("Should prevent voting after the election ends", async function () {
  //   const currentTime = Math.floor(Date.now() / 1000);
  //   await ethers.provider.send("evm_setNextBlockTimestamp", [currentTime + 3601]);
  //   await ethers.provider.send("evm_mine", []);

  //   await expect(voting.vote(0, 0)).to.be.revertedWith("Voting has ended");
  // });

  // Additional Tests:

  it("Should allow creating an election with a single option", async function () {
    const options = ["Only Option"];
    await voting.createElection("Single Option Election", options, 3600);
    const election = await voting.elections(1);

    expect(election.name).to.equal("Single Option Election");
    expect(await voting.getOptions(1)).to.deep.equal(options);
  });

  it("Should correctly handle multiple votes for different elections", async function () {
    await voting.createElection("Election 1", ["A", "B"], 3600);
    await voting.createElection("Election 2", ["X", "Y", "Z"], 3600);

    await voting.vote(0, 0); // Vote for "A" in Election 1
    await voting.vote(1, 2); // Vote for "Z" in Election 2

    const results1 = await voting.getResults(0);
    const results2 = await voting.getResults(1);

    expect(results1[0]).to.equal(1); // "A" should have 1 vote
    expect(results2[2]).to.equal(1); // "Z" should have 1 vote
  });

  it("Should allow only one vote per election per voter", async function () {
    const options = ["Option 1", "Option 2"];
    await voting.createElection("One Vote Test Election", options, 3600);

    await voting.vote(0, 1); // First vote
    await expect(voting.vote(0, 0)).to.be.revertedWith("You have already voted"); // Second vote, should fail
  });

  it("Should allow fetching election results correctly", async function () {
    await voting.createElection("Election with Results", ["Option 1", "Option 2"], 3600);

    await voting.vote(2, 0); // Vote for "Option 1"
    await voting.vote(2, 1); // Vote for "Option 2"
    await voting.vote(2, 0); // Vote for "Option 1"

    const results = await voting.getResults(2);
    expect(results[0]).to.equal(2); // "Option 1" should have 2 votes
    expect(results[1]).to.equal(1); // "Option 2" should have 1 vote
  });

  it("Should revert if trying to vote on a non-existent election", async function () {
    await expect(voting.vote(999, 0)).to.be.revertedWith("Election does not exist");
  });

  it("Should handle election expiration and prevent voting after expiration", async function () {
    const options = ["Expired Option 1", "Expired Option 2"];
    await voting.createElection("Expired Election", options, 1); // 1 second duration

    // Fast forward time to after the election has expired
    const currentTime = Math.floor(Date.now() / 1000);
    await ethers.provider.send("evm_setNextBlockTimestamp", [currentTime + 2]);
    await ethers.provider.send("evm_mine", []);

    await expect(voting.vote(3, 0)).to.be.revertedWith("Voting has ended");
  });
});
