# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv

FROM ubuntu:noble

RUN apt-get update && \
    apt-get install -y vim nano wget python3 openssh-server lnav && \
    mkdir /var/run/sshd

COPY src/task /root/task
COPY src/00-tyumen-logo.sh /etc/profile.d/00-tyumen-logo.sh
RUN chmod +x /etc/profile.d/00-tyumen-logo.sh

ARG USER="tyumenctf"
ARG PASSWORD="fake_flag"

ENV USER=$USER
ENV PASSWORD=$PASSWORD

RUN mkdir -p /var/log/ctf_logs /tmp/example &&  \
    chmod 733 /var/log/ctf_logs && \
    chmod 1773 /tmp && \
    chmod 700 /tmp/example

# Create user
RUN useradd -m ${USER} && \
    echo ${USER}:${PASSWORD} | chpasswd && \
    chsh -s /bin/bash ${USER} && \
    chown -R root:root /home/${USER} && \
    chmod 755 /home/${USER}
COPY src/README /home/${USER}/README

# Setup ssh
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    echo "Match User ${USER}" >> /etc/ssh/sshd_config && \
    echo "ForceCommand /bin/start_ctf.sh" >> /etc/ssh/sshd_config && \
    echo "PermitTTY yes" >> /etc/ssh/sshd_config && \
    echo "PermitOpen none" >> /etc/ssh/sshd_config && \
    echo "X11Forwarding no" >> /etc/ssh/sshd_config

# Speaical shell 😈
COPY src/bin/* /usr/bin/
RUN chmod +x /usr/bin/init_shell.sh /usr/bin/start_ctf.sh

# Set root password 😈
RUN sed -i 's|^root:\*|root:$6$nigger$CW8fbwpsIUk7rzv/aI/CKM3gR8Y64zBdKTuO3mn0mULP1amyw29re2Poh0Cc7b4USsWJty4llWNlQh/kQDCBD0|' /etc/shadow

#COPY src/00-tyumen-logo /etc/update-motd.d/00-tyumen-logo
#RUN chmod +x /etc/update-motd.d/00-tyumen-logo


# Откроем порт 22
EXPOSE 22

# Запустим SSH сервер при запуске контейнера
CMD ["/bin/sh", "-c", "rm -rf /home/${USER}/fake_flag && python3 /root/task/generator.py -v /home/${USER}/fake_flag  && /usr/sbin/sshd -D"]