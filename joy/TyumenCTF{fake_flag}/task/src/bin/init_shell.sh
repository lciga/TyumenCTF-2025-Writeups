#!/bin/bash

# Отключим ctrl-c, ctrl-d и прочее
trap "" INT QUIT TSTP

# Запускаем bash, но без загрузки профилей
exec /bin/bash --norc --noprofile
