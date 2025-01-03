/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    ElectionVoting: {
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi: [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_pollId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_selectedOption",
              type: "uint256",
            },
          ],
          name: "castVote",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_pollName",
              type: "string",
            },
            {
              internalType: "string[]",
              name: "_pollOptions",
              type: "string[]",
            },
            {
              internalType: "uint256",
              name: "_durationInSeconds",
              type: "uint256",
            },
          ],
          name: "createPoll",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "getAllPolls",
          outputs: [
            {
              internalType: "string[]",
              name: "pollNames",
              type: "string[]",
            },
            {
              internalType: "uint256[]",
              name: "pollEndTimes",
              type: "uint256[]",
            },
            {
              internalType: "string[][]",
              name: "pollOptions",
              type: "string[][]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_pollId",
              type: "uint256",
            },
          ],
          name: "getPollOptions",
          outputs: [
            {
              internalType: "string[]",
              name: "options",
              type: "string[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_pollId",
              type: "uint256",
            },
          ],
          name: "getPollResults",
          outputs: [
            {
              internalType: "uint256[]",
              name: "voteCounts",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "polls",
          outputs: [
            {
              internalType: "string",
              name: "pollName",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "pollEndTime",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
