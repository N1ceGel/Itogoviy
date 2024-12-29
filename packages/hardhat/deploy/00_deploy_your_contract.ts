import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployPollVoting: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("ElectionVoting", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("🎉 ElectionVoting contract deployed successfully!");
};

export default deployPollVoting;

deployPollVoting.tags = ["ElectionVoting"];
