# WXT Examples

Examples are available in the [`examples/` directory](./examples).

To download and run a specific example locally:

```sh
npx giget@latest gh:wxt-dev/examples examples/vue-overlay
cd vue-overlay
```

Then follow the directions in the example's README to run it.

## Contributing Examples

Want to create an example? Please do! Keep in mind that examples should be minimal, well documented, and easy to read. The README should contain basic information about starting the extension, and any addition information about what the example actually does.

The README needs to contain frontmatter, which is used to generate the `metadata.json` file. This file's raw contents is used by the documentation site to create a nice example search UI.

The `metadata.json` file is updated automatically when a commit is sent to the `main` branch. So you don't have to worry about updating it manually. But if you want to review the contents to make sure it will look good, run:

```sh
pnpm -w update-metadata
```
