import { SUPPORTED_DEPLOYMENTS } from "./constants";

declare global {
  type Deployment = (typeof SUPPORTED_DEPLOYMENTS)[number];
}
