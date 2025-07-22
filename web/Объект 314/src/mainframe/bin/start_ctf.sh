#!/bin/bash

CLIENT_IP=$(echo "$SSH_CLIENT" | awk '{print $1}')
USER_NAME=$(whoami)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

LOGFILE="/var/log/ctf_logs/${USER_NAME}_${CLIENT_IP}_${TIMESTAMP}.log"

mkdir -p /var/log/ctf_logs
touch "$LOGFILE"
chmod 622 "$LOGFILE"

export HISTFILE=/dev/null
unset PROMPT_COMMAND

cat << EOF
───────────────────────────────────────────────────────────
ОБЪЕКТ 314 / ИНФРАСТРУКТУРА ПОДСИСТЕМЫ «КАРКАС:ВЕТВЬ:ШКОЛА»
───────────────────────────────────────────────────────────
uplink:        OK [sync @ 34.7 ms]
protocol:      passive-echo
observers:     2 (verified), 1 (latent)
local mode:    terminal_safe
env hash:      6f12eab3c7.local
───────────────────────────────────────────────────────────
Внимание:
- 3 новых события в архиве 'blackshift/personal'
- Последняя активность в секторе 214: **аномалия**
- Интеграция замещённых лиц завершена [успешно]
───────────────────────────────────────────────────────────
Несанкционированный доступ к среде хранения Личных Дел 
учеников приведёт к автоматической деавторизации
уровня 3 и выше.

Сеанс записывается. И не только он.
───────────────────────────────────────────────────────────
EOF

exec script -q -f -a "$LOGFILE"
