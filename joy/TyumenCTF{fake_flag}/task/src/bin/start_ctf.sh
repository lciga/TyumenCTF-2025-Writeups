#!/bin/bash

# Получаем IP игрока из переменной SSH_CLIENT
CLIENT_IP=$(echo "$SSH_CLIENT" | awk '{print $1}')
USER_NAME=$(whoami)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Формируем уникальное имя лога
LOGFILE="/var/log/ctf_logs/${USER_NAME}_${CLIENT_IP}_${TIMESTAMP}.log"

# Создаём папку и файл
mkdir -p /var/log/ctf_logs
touch "$LOGFILE"
chmod 622 "$LOGFILE"

# Отключаем историю и баги
export HISTFILE=/dev/null
unset PROMPT_COMMAND

/etc/profile.d/00-tyumen-logo.sh
# Стартуем сессию с полным логированием
exec script -q -f -a "$LOGFILE"
