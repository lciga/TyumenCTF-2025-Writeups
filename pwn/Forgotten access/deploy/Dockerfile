FROM ubuntu:noble

RUN apt-get update && \
    apt-get install -y socat &&\
    useradd -m pwnuser

COPY ./access_flag /home/pwnuser/access_flag
COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && \
    chmod +x /home/pwnuser/access_flag && \
    chown -R root:root /home/pwnuser && \
    chmod 755 /home/pwnuser


CMD ["/entrypoint.sh"]
