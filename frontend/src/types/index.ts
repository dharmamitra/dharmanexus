import { SUPPORTED_DEPLOYMENTS } from "src/constants/base";

export type Deployment = (typeof SUPPORTED_DEPLOYMENTS)[number];
