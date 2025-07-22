# Walk the Bin
Категория: stego

_Загадочная картинка. Кажется, стоит разобраться с её структурой и найти способ раскрыть секрет..._

Выдать участникам:
empty.png

Решение:

1.     Визуально осматриваем картинку и понимаем, что в ней ничего нет. Название “Walk the Bin” – подсказка, отсылка на binwalk. Пробуем прогнать картинку через него и получаем такой результат:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/Walk%20the%20Bin/writeup/Pasted%20image%2020250419023626.png)

Внутри картинки содержится .zip архив.

2.     Достаём все файлы из картинки – всё тот же binwalk с атрибутом -e (extract): `binwalk -e empty.png`

Создаётся папка со всеми файлами, вытащенными из картинки.

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/Walk%20the%20Bin/writeup/Pasted%20image%2020250419023637.png)

flag.txt пустой, т.к. binwalk попытался вытащить его из архива.

3.     Открываем архив и видим тот же flag.txt, но открыть его сразу не получится, т.к. он защищён паролем. Необходимо либо вручную через шестнадцатеричный редактор найти необходимую строку, либо использовать strings, что легче.

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/Walk%20the%20Bin/writeup/Pasted%20image%2020250419023647.png)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/Walk%20the%20Bin/writeup/Pasted%20image%2020250419023655.png)

Пароль от архива – binwalk.

4.     Вводим пароль, открываем текстовый документ и получаем флаг.
![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/Walk%20the%20Bin/writeup/Pasted%20image%2020250419023706.png)

**TyumenCTF{n1c3_try_w_b1nw4lk}**