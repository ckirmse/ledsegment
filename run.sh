#!/bin/bash

rsync -avrz --exclude node_modules * pi@ledsegment.local:ledsegment/ ; ssh pi@ledsegment.local "sudo node ledsegment"
