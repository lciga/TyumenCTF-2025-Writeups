#!/bin/sh
exec socat TCP-LISTEN:5011,reuseaddr,fork EXEC:"su pwnuser -c'/home/pwnuser/counter_flag'"
