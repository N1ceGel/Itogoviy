// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ElectionVoting {
    struct Voter {
        address voterAddress;
        uint256 selectedOption;
    }

    struct Poll {
        string pollName;
        string[] pollOptions;
        uint256 pollEndTime;
        mapping(address => bool) hasVotedByAddress;
        mapping(uint256 => uint256) optionVotes;
    }

    Poll[] public polls;


    function getAllPolls() public view returns (
        string[] memory pollNames,
        uint256[] memory pollEndTimes,
        string[][] memory pollOptions
    ) {
        uint256 pollCount = polls.length;
        pollNames = new string[](pollCount);
        pollEndTimes = new uint256[](pollCount);
        pollOptions = new string[][](pollCount);

        for (uint256 i = 0; i < pollCount; i++) {
            pollNames[i] = polls[i].pollName;
            pollEndTimes[i] = polls[i].pollEndTime;
            pollOptions[i] = polls[i].pollOptions;
        }
    }
    
        function getPollResults(uint256 _pollId) public view returns (uint256[] memory voteCounts) {
        Poll storage poll = polls[_pollId];
        uint256[] memory voteCountsForOptions = new uint256[](poll.pollOptions.length);

        for (uint256 i = 0; i < poll.pollOptions.length; i++) {
            voteCountsForOptions[i] = poll.optionVotes[i];
        }
        return voteCountsForOptions;
    }

    function castVote(uint256 _pollId, uint256 _selectedOption) public {
        Poll storage poll = polls[_pollId];

        require(block.timestamp < poll.pollEndTime, "Poll has already ended");
        require(!poll.hasVotedByAddress[msg.sender], "You have already voted in this poll");

        poll.hasVotedByAddress[msg.sender] = true;
        poll.optionVotes[_selectedOption]++;
    }


    function createPoll(string memory _pollName, string[] memory _pollOptions, uint256 _durationInSeconds) public {
        Poll storage newPoll = polls.push();
        newPoll.pollName = _pollName;
        newPoll.pollOptions = _pollOptions;
        newPoll.pollEndTime = block.timestamp + _durationInSeconds;
    }

    function getPollOptions(uint256 _pollId) public view returns (string[] memory options) {
        Poll storage poll = polls[_pollId];
        return poll.pollOptions;
    }
}

