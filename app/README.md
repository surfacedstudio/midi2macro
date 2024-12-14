# Midi2Macro

> Turn any MIDI device into a macro controller.

## How to build

Extract `dependencies.zip` into a local `./dependencies` folder.

The @nut-tree module will be copied into your `node_modules` folder post install because it doesn't work when you add it into the package.json - and yarn will clean out anything in `node_modules` that it doesn't own.

Run `yarn`

Run `yarn start` to start the application.

## How to package

To build a release version modify the `./release/app/package.json` file and change

```json
  "enable-for-package-only-dependencies": {
    "@nut-tree/nut-js": "../../node_modules/@nut-tree/nut-js"
  }
```

to

```json
  "dependencies": {
    "@nut-tree/nut-js": "../../node_modules/@nut-tree/nut-js"
  }
```

The dependency fails the root `yarn` install if enabled from the start.

Now run `yarn package`.

A `./release/app/build` folder will be created with the binaries for distribution.

## Configuration

`src/common/globals.ts` includes a `IS_DEMO` is flag. This flag will enforce demo mode, no more than 5 macros & startup popup, to the build.

Note you also need to update `src/renderer/index.ejs` with the relevant title - it cannot pull the value from the ts file.
