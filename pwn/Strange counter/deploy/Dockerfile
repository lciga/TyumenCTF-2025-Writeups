FROM ubuntu:noble

RUN apt-get update && \
    apt-get install -y socat &&\
    useradd -m pwnuser

COPY ./counter_flag /home/pwnuser/counter_flag
COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && \
    chmod +x /home/pwnuser/counter_flag && \
    chown -R root:root /home/pwnuser && \
    chmod 755 /home/pwnuser


CMD ["/entrypoint.sh"]
