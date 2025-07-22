#!/bin/bash

trap "" INT QUIT TSTP

exec /bin/bash --norc --noprofile
