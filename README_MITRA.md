# DharmaNexus Customization

ALL backend development and most/all frontend feature/bug/+ development should be done directly on the [BuddhaNexus](https://github.com/BuddhaNexus/buddhanexus) parent project. This project is for spcific DharamNexus customization only.

## Branches

- `main`:
  - stable DharamNexus customizations
  - pulls in parent project updates from `upstream-repo`
  - common base for all DM deployments
  - frontend `basePath`: `/database` (production)
- `dev`: primary development branch for DharamNexus customizations (+/ `<ticket>` branches as suitable)
- `<project-name>`: (if needed) project specific deployment branches
- `upstream-repo`: [BuddhaNexus](https://github.com/BuddhaNexus/buddhanexus) that pulls in upstream changes to merge into `main`

## Pulling upstream updates

```sh
git checkout upstream-repo
git pull
# if necessary checkout a specific branch to pull into main
git checkout main
git merge upstream-repo
```

## Frontend Development

- A dedicated `mitra` directory hosts customization files to avoid naming collisions and other conflicts, as well as centralize project specific adjustments to make the modification trail clearer.
  - as much as possible creating new files (in `mitra`) is favoured over editing existing files.
- the `getDeployment` function can be used across the project for necessary customizatons.

## Frontend Deployment customizations

- `NEXT_PUBLIC_DEPLOYMENT` is used to determine the deployment environment, and is set at build with `build:dm` and `build:kp` scripts.
