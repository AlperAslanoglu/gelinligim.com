## Versioning

[Semantic Versioning](http://semver.org/) is used. Any release that makes a change that is not a regression from the previously release should be a minor release. 

## Creating a Release

1. Create a `release/x.x.x` branch off of master.
2. Add features or fix bugs. See sections below.
3. Assign at least one reviewer other than yourself to the Pull Request.
4. Once reviewed the reviewer can merge the release in to the `master` branch.

### Update `readme.txt`

[Add a meaningful list of changes](https://github.com/Astoundify/listify/blob/master/readme.txt#L47) made in the new release.

### Bump Version Number

3 files need a version bump:

- [style.css](https://github.com/Astoundify/listify/blob/master/style.css#L7)
- [readme.txt](https://github.com/Astoundify/listify/blob/master/readme.txt#L5)
- [package.json](https://github.com/Astoundify/listify/blob/master/package.json#L4)

### Rebuild Files

From a clean working directory:

`$ npm run setup`

### Generate Build

To generate a `.zip` file, from a clean working directory:

`$ npm run build`

### Tag Release

[Create a new release on Github](https://github.com/Astoundify/listify/releases/new) and upload the generated binary.
