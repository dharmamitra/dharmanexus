# DharamaNexus Customization

All/most feature/bug development should be done directly on the [BuddhaNexus](https://github.com/BuddhaNexus/buddhanexus) parent project. This project is for context spcific customization.

## Branches

- `main`:
  - stable xNexus customizations
  - pulls in parent project updates from `upstream-frontend`
  - common base for all DM deployments
  - `basePath`: `/database` (production)
- `dev`: primary development branch for xNexus customizations (+/ `<ticket>` branches as suitable)
- `<project-name>`: (if needed) project specific deployment branches

- upstream:

  - `upstream-repo`: [BuddhaNexus](https://github.com/BuddhaNexus/buddhanexus) (entire source project)
  - `upstream-frontend`: subtree branch isolating the frontend part of the project that pulls in upstream changes to merge into `main`

## Pulling upstream updates

```sh
git checkout upstream-repo
git pull
git subtree split --prefix=frontend  --onto upstream-frontend  -b upstream-frontend
git checkout main
git merge upstream-frontend
```

**note**: to get updates from a specific branch the `subtree` should also be used. eg:

```
git checkout upstream-repo
git pull
git checkout specific-update-branch
git subtree split --prefix=frontend  --onto upstream-frontend-edge  -b upstream-frontend-edge
...
```

## Development

- A dedicated `mitra` directory hosts customization files to avoid naming collisions and other conflicts, as well as centralize project specific adjustments to make the modification trail clearer.
  - as much as possible creating new files (in `mitra`) is favoured over editing existing files.
- the `getDeployment` function can be used across the project for necessary customizatons.

## Deployment customizations

- `NEXT_PUBLIC_DEPLOYMENT` is used to determine the deployment environment, and is set at build with `build:dm` and `build:kp` scripts.
