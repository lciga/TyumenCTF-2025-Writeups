## Enumeration:
Заходим на страницу, наблюдаем окно входа:![[Pasted image 20250413152502.png]]

Проверяем наличие `robots.txt`:
![[Pasted image 20250413152642.png]]

Видим содержимое директории `/.git/`:![[Pasted image 20250413152735.png]]

 Тем не менее не обнаруживаем директории `logs`:![[Pasted image 20250413152856.png]]
При посещении этой директории получаем 403:![[Pasted image 20250413152955.png]]

## Exploitation

По запросу "tools to dump git from website" находим скрипт
https://github.com/arthaud/git-dumper

Кроме него есть и другие инструменты:
GitTools:[internetwache/GitTools: A repository with 3 tools for pwn'ing websites with .git repositories available](https://github.com/internetwache/GitTools)
GitHack:[lijiejie/GitHack: A `.git` folder disclosure exploit](https://github.com/lijiejie/GitHack)

Скачиваем скрипт:
`git clone https://github.com/arthaud/git-dumper`

Загружаем зависимости:
`pip3 install -r requirements.txt`

Если увидите предупреждение:
![[Pasted image 20250413154115.png]]
Используйте:
`pip3 install -r requirements.txt --break-system-packages`


Запускаем скрипт:
`python3 git_dumper.py  http://localhost:8000/.git/ ~/directory`

Скрипт выгружает директорию /.git, которую мы можем исследовать:![[Pasted image 20250413154341.png]]

Проверим коммиты:
![[Pasted image 20250413154408.png]]

В коммитах обнаруживаем учетные данные:
`ServiceAdmin:jtBfru89XC`

Заходим обратно на веб страницу, вводим данные, получаем флаг:
![[Pasted image 20250413154601.png]]