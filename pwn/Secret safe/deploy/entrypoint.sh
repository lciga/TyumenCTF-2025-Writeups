#!/bin/sh
exec socat TCP-LISTEN:5013,reuseaddr,fork EXEC:"su pwnuser -c'/home/pwnuser/safe_flag'"