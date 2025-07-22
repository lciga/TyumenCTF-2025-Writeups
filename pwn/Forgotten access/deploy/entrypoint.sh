#!/bin/sh
exec socat TCP-LISTEN:5012,reuseaddr,fork EXEC:"su pwnuser -c'/home/pwnuser/access_flag'"
