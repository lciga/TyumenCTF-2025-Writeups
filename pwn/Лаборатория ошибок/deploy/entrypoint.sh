#!/bin/sh
exec socat TCP-LISTEN:5010,reuseaddr,fork EXEC:"su pwnuser -c'/home/pwnuser/lab_flag'"
