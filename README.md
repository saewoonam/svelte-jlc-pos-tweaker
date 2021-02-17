# This is a single page webapp to tweak the pos file for assembly by jlc. 
This project is built using svelte and the snowpack template.  It is running as a github-page
## notes:
1.  The positions are modified if they part and footprint are in the public/corrections.csv file.  This needs to be updated for missing parts.

## local installation notes:
*  Follow instructions below... It should just run with "npm start" or "yarn start"
*  Edit public/corrections.csv to update new positions.
    *  May need to restart to load new corrections.
*  Have to deploy to gihub pages manually...
    *  yarn build
    *  touch build/.nojekyll  # can't seem to prevent snowpack from erasing this file every time...
    *  yarn run gh-pages -t -d build
    *  "use -t" to copy the dotfile .nojekyll so that all the snowpack stuff will get picked up by github-pages
## To do:
1.  Implement a github action to update the corrections.csv file by submitting an issue...

---

# New Project

> ✨ Bootstrapped with Create Snowpack App (CSA).

## Available Scripts

### npm start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm run build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

**For the best production performance:** Add a build bundler plugin like [@snowpack/plugin-webpack](https://github.com/snowpackjs/snowpack/tree/main/plugins/plugin-webpack) or [snowpack-plugin-rollup-bundle](https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle) to your `snowpack.config.json` config file.

### Q: What about Eject?

No eject needed! Snowpack guarantees zero lock-in, and CSA strives for the same.
