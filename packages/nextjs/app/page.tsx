"use client";

import { useEffect, useState } from "react";
import deployedContracts from "../contracts/deployedContracts";
import { ethers } from "ethers";

export default function Home() {
  const [polls, setPolls] = useState<any[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [voteResults, setVoteResults] = useState<number[]>([]);
  const [pollName, setPollName] = useState("");
  const [pollOptions, setPollOptions] = useState("");

  const contractAddress = deployedContracts[31337].ElectionVoting.address;
  const contractABI = deployedContracts[31337].ElectionVoting.abi;

  const getContract = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return null;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  const fetchPolls = async () => {
    const contract = await getContract();
    if (!contract) return;

    try {
      const [names, endTimes, options] = await contract.getAllPolls();
      setPolls(
        names.map((name: string, index: number) => ({
          id: index,
          name,
          endTime: new Date(endTimes[index].toNumber() * 1000).toLocaleString(),
          options: options[index],
        })),
      );
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  const handleCreatePoll = async () => {
    const contract = await getContract();
    if (!contract) return;

    try {
      const tx = await contract.createPoll(pollName, pollOptions.split(","), 3600);
      await tx.wait();
      alert("Poll created successfully!");
      fetchPolls();
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  const handleCastVote = async () => {
    if (selectedPollId === null) {
      alert("Please select a poll to vote on!");
      return;
    }

    const contract = await getContract();
    if (!contract) return;

    try {
      const tx = await contract.castVote(selectedPollId, selectedOption);
      await tx.wait();
      alert("Vote submitted successfully!");
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };

  const handleFetchVoteResults = async () => {
    if (selectedPollId === null) {
      alert("Please select a poll to fetch results!");
      return;
    }

    const contract = await getContract();
    if (!contract) return;

    try {
      const data = await contract.getPollResults(selectedPollId);
      setVoteResults(data.map((res: ethers.BigNumber) => res.toNumber()));
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <div className="min-h-screen bg-[#1d1f26] text-[#fafafa] py-10 px-5 font-sans">
      <h1 className="text-5xl font-semibold text-center mb-12 text-[#ff9f00]">Decentralized Polling</h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Create Poll Section */}
        <div className="bg-[#2a2d38] p-6 rounded-xl shadow-xl border-2 border-[#393c46]">
          <h2 className="text-3xl font-medium text-[#ff9f00] mb-6">Create Your Poll</h2>
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Poll Title"
              value={pollName}
              onChange={e => setPollName(e.target.value)}
              className="w-full p-4 bg-[#393c46] text-[#fafafa] border-2 border-[#4d5660] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9f00]"
            />
            <input
              type="text"
              placeholder="Poll Options (comma-separated)"
              value={pollOptions}
              onChange={e => setPollOptions(e.target.value)}
              className="w-full p-4 bg-[#393c46] text-[#fafafa] border-2 border-[#4d5660] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9f00]"
            />
            <button
              onClick={handleCreatePoll}
              className="w-full bg-[#ff9f00] text-[#1d1f26] py-3 rounded-lg hover:bg-[#ff7c00] transition"
            >
              Create Poll
            </button>
          </div>
        </div>

        {/* Vote Section */}
        <div className="bg-[#2a2d38] p-6 rounded-xl shadow-xl border-2 border-[#393c46]">
          <h2 className="text-3xl font-medium text-[#ff9f00] mb-6">Cast Your Vote</h2>
          <div className="space-y-5">
            <select
              onChange={e => setSelectedPollId(Number(e.target.value))}
              className="w-full p-4 bg-[#393c46] text-[#fafafa] border-2 border-[#4d5660] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9f00]"
            >
              <option value="" disabled selected>
                Select a poll to vote
              </option>
              {polls.map(poll => (
                <option key={poll.id} value={poll.id}>
                  {poll.name}
                </option>
              ))}
            </select>
            {selectedPollId !== null && (
              <div>
                <p className="text-lg font-semibold text-[#ff9f00]">Options:</p>
                <ul className="list-disc list-inside space-y-2 text-[#b0b6b9]">
                  {polls[selectedPollId]?.options.map((option: string, index: number) => (
                    <li key={index}>
                      {index}: {option}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-[#b0b6b9]">Poll End Time: {polls[selectedPollId]?.endTime}</p>
              </div>
            )}
            <input
              type="number"
              placeholder="Option ID"
              value={selectedOption}
              onChange={e => setSelectedOption(Number(e.target.value))}
              className="w-full p-4 bg-[#393c46] text-[#fafafa] border-2 border-[#4d5660] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9f00]"
            />
            <button
              onClick={handleCastVote}
              className="w-full bg-[#3b9f9b] text-[#1d1f26] py-3 rounded-lg hover:bg-[#007f7a] transition"
            >
              Cast Vote
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-[#2a2d38] p-6 rounded-xl shadow-xl border-2 border-[#393c46]">
          <h2 className="text-3xl font-medium text-[#ff9f00] mb-6">Poll Results</h2>
          <div className="space-y-5">
            {selectedPollId !== null && (
              <div>
                <p className="text-lg font-semibold text-[#ff9f00]">Results for {polls[selectedPollId]?.name}:</p>
                <ul className="list-disc list-inside space-y-2 text-[#b0b6b9]">
                  {voteResults.map((result, index) => (
                    <li key={index}>
                      Option {index}: {result} votes
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={handleFetchVoteResults}
              className="w-full bg-[#6a5d5f] text-[#fafafa] py-3 rounded-lg hover:bg-[#5e4e51] transition"
            >
              Fetch Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
