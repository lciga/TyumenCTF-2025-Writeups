## Enumeration:
Заходим на страницу, наблюдаем окно входа:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/web/Coomiter/writeup/Pasted%20image%2020250413152448.png)

Проверяем наличие `robots.txt`:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/web/Coomiter/writeup/Pasted%20image%2020250413152642.png)

Видим содержимое директории `/.git/`:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/web/Coomiter/writeup/Pasted%20image%2020250413152735.png)

Тем не менее не обнаруживаем директории `logs`:

 ![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/web/Coomiter/writeup/Pasted%20image%2020250413152856.png)
 
При посещении этой директории получаем 403:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/web/Coomiter/writeup/Pasted%20image%2020250413152955.png)

## Exploitation

По запросу "tools to dump git from website" находим скрипт
https://github.com/arthaud/git-dumper

Кроме него есть и другие инструменты:

GitTools: https://github.com/internetwache/GitTools

GitHack: https://github.com/lijiejie/GitHack

Скачиваем скрипт:
`git clone https://github.com/arthaud/git-dumper`

Загружаем зависимости:
`pip3 install -r requirements.txt`

Если увидите предупреждение:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/web/Coomiter/writeup/Pasted%20image%2020250413154115.png)

Используйте:
`pip3 install -r requirements.txt --break-system-packages`

Запускаем скрипт:
`python3 git_dumper.py  http://localhost:8000/.git/ ~/directory`

Скрипт выгружает директорию /.git, которую мы можем исследовать:![[Pasted image 20250413154341.png]]

Проверим коммиты:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/web/Coomiter/writeup/Pasted%20image%2020250413154408.png)

В коммитах обнаруживаем учетные данные:
`ServiceAdmin:jtBfru89XC`

Заходим обратно на веб страницу, вводим данные, получаем флаг:


![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/web/Coomiter/writeup/Pasted%20image%2020250413154601.png)
