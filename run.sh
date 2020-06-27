#!/bin/bash

rsync -avrz --exclude node_modules --exclude build --exclude binding * pi@ledsegment.local:ledsegment/ ; ssh pi@ledsegment.local "sudo node ledsegment/index.js"
