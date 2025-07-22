# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv

FROM postgres:17.4

RUN apt-get update && \
    apt-get install -y vim openssh-server lnav && \
    mkdir /var/run/sshd


ARG USER="headmaster"
ARG PASSWORD="how-do-you-know"

ENV USER=$USER
ENV PASSWORD=$PASSWORD

RUN mkdir -p /var/log/ctf_logs /tmp/example &&  \
    chmod 733 /var/log/ctf_logs && \
    chmod 1773 /tmp

# Create user
RUN useradd -m ${USER} && \
    echo ${USER}:${PASSWORD} | chpasswd && \
    chsh -s /bin/bash ${USER} && \
    chown -R root:root /home/${USER} && \
    chmod 755 /home/${USER}

# Setup ssh
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    echo "Match User ${USER}" >> /etc/ssh/sshd_config && \
    echo "ForceCommand /bin/start_ctf.sh" >> /etc/ssh/sshd_config && \
    echo "PermitTTY yes" >> /etc/ssh/sshd_config && \
    echo "PermitOpen none" >> /etc/ssh/sshd_config && \
    echo "X11Forwarding no" >> /etc/ssh/sshd_config

# Speaical shell 😈
COPY ./bin/* /usr/bin/
RUN chmod +x /usr/bin/init_shell.sh /usr/bin/start_ctf.sh

# Set root password 😈
RUN sed -i 's|^root:\*|root:$6$nigger$CW8fbwpsIUk7rzv/aI/CKM3gR8Y64zBdKTuO3mn0mULP1amyw29re2Poh0Cc7b4USsWJty4llWNlQh/kQDCBD0|' /etc/shadow

COPY blackshift /blackshift

COPY database.sql /docker-entrypoint-initdb.d/
RUN chown -R postgres:postgres /docker-entrypoint-initdb.d/
RUN chmod -R 700 /docker-entrypoint-initdb.d/

# Откроем порт 22
EXPOSE 22

# Запустим SSH сервер при запуске контейнера
CMD service ssh start && docker-entrypoint.sh postgres
