## Setup

1. `$ git clone git@github.com:Astoundify/listify.git && cd listify`
2. `$ npm install`

## Making Changes

`master` branch is always what is currently deployed on ThemeForest, which means nothing should be committed directly to this branch.

### Watch for Asset Changes

`$ grunt watch`

### Fixing an Issue or Adding a Feature

1. All commits should relate to an existing issue on Github.
2. Create a new based off the current release branch related to the issue number. For example `issue/123`
3. Add your changes.
4. Open a Pull Request against the next release branch.
5. Assign at least one reviewer other than yourself to the Pull Request.
6. Once reviewed the reviewer can merge the feature in to the `release/x.x.x` branch.