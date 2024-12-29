import { expect } from "chai";
import { ethers } from "hardhat";
import { ElectionVoting } from "../typechain-types";

describe("ElectionVoting - Extended Tests", function () {
  let voting: ElectionVoting;

  before(async () => {
    const VotingFactory = await ethers.getContractFactory("ElectionVoting");
    voting = (await VotingFactory.deploy()) as ElectionVoting;
    await voting.waitForDeployment();
  });

  it("Should create a poll and verify its details", async function () {
    const pollTitle = "Favorite Movie";
    const choices = ["Inception", "Interstellar"];
    const duration = 7200; // 2 hours

    await voting.createPoll(pollTitle, choices, duration);
    const polls = await voting.getAllPolls();

    expect(polls[0]).to.include(pollTitle);
    expect(polls[2][0]).to.deep.equal(choices);
  });

  it("Should allow multiple polls with unique titles and options", async function () {
    const newPolls = [
      { title: "Best Food", options: ["Pizza", "Sushi"] },
      { title: "Favorite Sport", options: ["Soccer", "Basketball"] },
      { title: "Best Season", options: ["Summer", "Winter"] },
    ];

    for (const poll of newPolls) {
      await voting.createPoll(poll.title, poll.options, 7200);
    }

    const allPolls = await voting.getAllPolls();
    expect(allPolls[0].length).to.equal(4); // Including the first poll created
  });

  it("Should register a vote for an existing option in a poll", async function () {
    const pollId = 0;
    const optionIndex = 0;

    await voting.castVote(pollId, optionIndex);
    const results = await voting.getPollResults(pollId);

    expect(results[optionIndex]).to.equal(1);
  });

  it("Should not allow a user to vote more than once in the same poll", async function () {
    const pollId = 0;
    const optionIndex = 0;

    await expect(voting.castVote(pollId, optionIndex)).to.be.revertedWith("You have already voted in this poll");
  });

  it("Should reject votes after the poll has concluded", async function () {
    const pollId = 0;

    // Simulate time passing beyond the poll duration
    const futureTime = Math.floor(Date.now() / 1000) + 7201; // 2 hours + 1 second
    await ethers.provider.send("evm_setNextBlockTimestamp", [futureTime]);
    await ethers.provider.send("evm_mine", []);

    await expect(voting.castVote(pollId, 1)).to.be.revertedWith("Poll has already ended");
  });
});
