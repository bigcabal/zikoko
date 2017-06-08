# Zikoko

This is the repository for the Zikoko Sails Application. 


## Deployment/Contribution Process

This will outline the process of adding code to this API. The base branch is `develop`, this branch will be the one that's the most ahead. 

These are the steps to get code merged into `develop`
1. Create a feature branch. If you're working on a search feature, the branch should be something like `feature/ta-search`. The "ta" are the initials of the author, in this case (Timi Ajiboye), which will ensure that there won't be any naming conflicts in feature branches.
2. When all the work is done, commit and make a pull request that will be based against `develop`.
3. The pull request needs to be reviewed and when it's been approved it can be merged into `develop`.
4. The feature branch must not be out of date with `develop` prior to merging. Whenever it is, this can be solved by running `git rebase develop` while in your feature branch and (force) pushing (to that feature branch).

### Deployment

When a pull request/feature branch has been successfully merged into `develop`, `develop` can now be merged into `deploy/dev` for further (Q/A) testing. Once it's certified stable, it can now be merged into `deploy/staging` and pushed.

- `develop/dev` triggers a deployment to [zikoko-dev.herokuapp.com](https://zikoko-dev.herokuapp.com)
- `develop/staging` triggers a deployment to [zikoko-staging.herokuapp.com](https://zikoko-staging.herokuapp.com)
- `develop/live` triggers a deployment to [zikoko-live.herokuapp.com](https://zikoko-live.herokuapp.com)


### Notes for Kachi

You should read the [Deployment/Contribution Process on Formation](https://github.com/bigcabal/formation/blob/develop/README.md) for an overview of how deploying will work from now on. 

When you're working locally, you should start the application by running `npm run dev`. 
