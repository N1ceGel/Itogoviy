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
    <div className="min-h-screen bg-white text-black py-20 px-8">
      <h1 className="text-5xl font-bold text-center mb-16 text-green-600">Decentralized Polling</h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Create Poll Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-green-600 mb-6">Create Your Poll</h2>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Poll Title"
              value={pollName}
              onChange={e => setPollName(e.target.value)}
              className="w-full p-4 bg-white text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-opacity-70"
            />
            <input
              type="text"
              placeholder="Poll Options (comma-separated)"
              value={pollOptions}
              onChange={e => setPollOptions(e.target.value)}
              className="w-full p-4 bg-white text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-opacity-70"
            />
            <div className="flex justify-center mt-6">
              <button
                onClick={handleCreatePoll}
                className="w-full sm:w-1/2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Create Poll
              </button>
            </div>
          </div>
        </div>

        {/* Vote Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-green-600 mb-6">Cast Your Vote</h2>
          <div className="space-y-6">
            <select
              onChange={e => setSelectedPollId(Number(e.target.value))}
              className="w-full p-4 bg-white text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                <p className="text-lg font-semibold text-green-600">Options:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {polls[selectedPollId]?.options.map((option: string, index: number) => (
                    <li key={index}>
                      {index + 1}: {option}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500">Poll End Time: {polls[selectedPollId]?.endTime}</p>
              </div>
            )}
            <input
              type="number"
              placeholder="Option ID"
              value={selectedOption}
              onChange={e => setSelectedOption(Number(e.target.value))}
              className="w-full p-4 bg-white text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-opacity-70"
            />
            <div className="flex justify-center mt-6">
              <button
                onClick={handleCastVote}
                className="w-full sm:w-1/2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Cast Vote
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 col-span-2">
          <h2 className="text-3xl font-semibold text-green-600 mb-6">Poll Results</h2>
          <div className="space-y-6">
            {selectedPollId !== null && (
              <div>
                <p className="text-lg font-semibold text-green-600">Results for {polls[selectedPollId]?.name}:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {voteResults.map((result, index) => (
                    <li key={index}>
                      Option {index + 1}: {result} votes
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleFetchVoteResults}
                className="w-full sm:w-1/2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Fetch Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
