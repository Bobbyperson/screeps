# screeps-javascript-starter

This is a starter project template for playing [Screeps](https://screeps.com/) using JavaScript.

It also explains how to get set up and connect to Eluded's private server.

## Useful links

* Screeps homepage: https://screeps.com/
* Screeps API documentation: https://docs.screeps.com/api/
* Screeps wiki: https://wiki.screepspl.us/index.php/Screeps_Wiki 

## How to join the private server

The server is currently hosted at `138.68.162.66:21025`

### Requirements
* Install [node.js](https://nodejs.org/en/download)
* Install [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

1. Get the Screeps game from Steam
2. Download the game and run it at least once
   * If you're on MacOS and it crashes on startup, that's okay - it's a known issue. We're going to launch the game in a different way that does work.
3. Install [screeps-steamless-client](https://github.com/laverdet/screeps-steamless-client)
    * `npm install -g screeps-steamless-client`
4. Run the steamless client in a terminal `npx screeps-steamless-client --host 0.0.0.0`
5. Connect to the private server at http://localhost:8080/(http://138.68.162.66:21025)/
6. Make an account
    * It will tell you it has sent an email confirmation link. That is a lie. Just login the username/password you chose after making an account.
7. Copy `screeps.sample.json` to a new file `screeps.json` in this project and add your username/password credentials to the `pserver` block.
8. Upload your code to the server by running `yarn run push-pserver`
9. On the private server page in your browser, login with the account details you made. Choose your badge and choose which room you want to spawn in. You are ready to play!

## Usage

* Run `yarn test` to run tests (using [jest](https://jestjs.io/))
* Run `yarn push-pserver` to push code to the private server
* Run `yarn watch-pserver` to watch for changes in your source files and push code to the private server whenever you save.

## Suggestions

* The starter miner doesn't really do very much. Perhaps he could bring the energy he's mining back to the spawn so that new creeps can be born?
* The starter base code will only spawn 1 miner. Perhaps we want more?
* What if the miner mined continuously while another type of creep carried away the energy it was mining?
* Start upgrading the [room controller]() to level up the room.
* Consider mining from other nearby rooms and not just the main room. expand your empire!
