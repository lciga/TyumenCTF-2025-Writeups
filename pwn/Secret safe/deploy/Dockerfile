FROM ubuntu:noble

RUN dpkg --add-architecture i386 && \
    apt-get update && \
    apt-get install -y socat libc6:i386 expect &&\
    useradd -m pwnuser


COPY ./safe_flag /home/pwnuser/safe_flag
COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && \
    chmod +x /home/pwnuser/safe_flag && \
    chown -R root:root /home/pwnuser && \
    chmod 755 /home/pwnuser


CMD ["/entrypoint.sh"]