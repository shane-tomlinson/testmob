# TestMob

TestMob is a distributed unit test system loosely based on [John Resig's] (http://ejohn.org) project [TestSwarm] (http://testswarm.org). Manual unit testing Javascript across a variety of OS's, browsers and devices is a very time consuming process. TestMob allows many clients to join the mob. As soon as a request to kick off a test comes in, all available clients begin to run the tests. When a client completes the suite the results are sent back to the initiator.

## Use in your site
* Include the following snippet in your unit tests after all of your included unit tests:
```
  <script src="http://testmob.org/include.js"></script>
```
* Open up a browser which will act as the "boss". The boss does not run tests but initiates a job and collects results. Open http://testmob.org and start a family.
* Open up a second browser which will act as an "associate".  Associates do jobs.
* Open http://testmob.org. Join the same family as the boss.
* Return to the boss. Enter the "Job Address" (unit test address) .  Start the job.
* Watch the results flow in.

## Caveats
* TestMob can currently only be used with QUnit.
* Unit Tests must be reachable by all members of the family.

## Running locally
* Clone the repo - git://github.com/stomlinson/testmob.git
* npm install
* npm run - By default, the server listens on 0.0.0.0:5000. These can be changed by specifying the IP_ADDRESS and PORT environment variables.

## Libraries/parts of libraries Used:
* node.js (http://nodejs.org)
* jQuery 1.7.1 (http://jquery.com)
* AFrameJS (http://aframejs.com)
* Socket.io (http://socket.io)
* BrowserID (http://browserid.org)

## Author:
* Shane Tomlinson
* set117@yahoo.com
* http://www.shanetomlinson.com
* http://github.com/stomlinson
* http://github.com/shane-tomlinson
* @shane_tomlinson

## Getting involved:
I am happy to review submissions!

## License:
This software is available under version 2.0 of the MPL:

  https://www.mozilla.org/MPL/

