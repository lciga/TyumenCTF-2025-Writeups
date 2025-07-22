FROM ubuntu:noble

RUN apt-get update && \
    apt-get install -y socat &&\
    useradd -m pwnuser

COPY ./lab_flag /home/pwnuser/lab_flag
COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && \
    chmod +x /home/pwnuser/lab_flag && \
    chown -R root:root /home/pwnuser && \
    chmod 755 /home/pwnuser


CMD ["/entrypoint.sh"]
