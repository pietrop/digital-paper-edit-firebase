# NPM Link with DPE Storybook components

Useful for fail-fast development, especially with `digital-paper-edit-react-components`.
This guide helps with linking the locally build version of the Storybook components with this repo.

You will still need to run the build every time code in digital-paper-edit-storybook changes but you will no longer need to redeploy to NPM to try it.

## Build

In order for this to work, you have to have a local development build of `@bbc/digital-paper-edit-react-components`. You would need to clone the [repo](https://github.com/bbc/digital-paper-edit-storybook) if you haven't already.

The build process uses a Webpack configuration file called [`webpack.dev.config.js`](https://github.com/bbc/digital-paper-edit-storybook/blob/master/webpack.dev.config.js) in the Storybook repository. This is important because you can only have one React installed in your dependency tree. The config helps to point the React Context to point at this repository's node modules instead of its own. For more information on this, see [Webpack's document on resolving dependencies](https://webpack.js.org/configuration/resolve/). If your relative path is different, you need to change it so that the path is correct.

```js
{
  resolve: {
    alias: {
      react: path.resolve(
        '../../digital-paper-edit-firebase/node_modules/react'
      ),
      'react-dom': path.resolve(
        '../../digital-paper-edit-firebase/node_modules/react-dom'
      ),
      'react-router': path.resolve(
        '../../digital-paper-edit-firebase/node_modules/react-router'
      ),
      'react-router-dom': path.resolve(
        '../../digital-paper-edit-firebase/node_modules/react-router-dom'
      )
    },
    symlinks: false
  },
}
```

You can generate a dev build in digital-paper-edit-storybook by running `yarn dev`.

## Link

You can replace the yarn commands with npm and it should just work as is.

1. In root of `digital-paper-edit-storybook` repository, run `yarn link`
2. In root of this repository, run `yarn link @bbc/digital-paper-edit-react-components`