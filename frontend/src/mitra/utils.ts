import { SUPPORTED_DEPLOYMENTS } from "@mitra/constants";

const isValidDeployment = (deployment: unknown): deployment is Deployment =>
  SUPPORTED_DEPLOYMENTS.some((item) => item === deployment);

export const getDeployment = () => {
  const deployment = process.env.NEXT_PUBLIC_DEPLOYMENT;

  if (!deployment) {
    throw new Error("NEXT_PUBLIC_DEPLOYMENT is not set");
  }

  if (!isValidDeployment(deployment)) {
    throw new Error(
      `NEXT_PUBLIC_DEPLOYMENT must be a value in SUPPORTED_DEPLOYMENTS: ${SUPPORTED_DEPLOYMENTS.join(
        ", ",
      )}`,
    );
  }

  return deployment;
};


export const getBasePath = () => {
  const deployment = getDeployment();

  return deployment === "dharmamitra" ? "/nexus" : "/kumarajiva-nexus";
};