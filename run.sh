#!/bin/bash

rsync -avrz * pi@ledsegment.local:ledsegment/ ; ssh pi@ledsegment.local "sudo node ledsegment"

