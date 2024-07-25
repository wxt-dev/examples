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

The README needs to contain frontmatter, which is used to generate the `metadata.json` file. This file's raw contents is used by https://wxt.dev to create a [nice example search UI](https://wxt.dev/examples.html).

Before merging your PR, please update the `metadata.json` file by running the below command:

```sh
pnpm -w update-metadata
```

Review that the changes to the file look good, and you're good to merge :+1:
