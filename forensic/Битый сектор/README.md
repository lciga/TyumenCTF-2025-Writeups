
# Битый сектор

_Нам передали жесткий диск от старого сервера, но один из секторов оказался повреждённым. Внутри — обрывки данных, среди которых спрятан флаг._

## Решение

1. Осматриваем файл. Он имеет расширение .ima – является образом диска (флоппи). 
    Подключаем его через утилиты WinImage/UltraISO/7-Zip. Визуально видим кучу файлов и директорий – часть с аномально малым размером, “повреждённой” структурой, в чём мы убедимся на следующем этапе решения.

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/forensic/%D0%91%D0%B8%D1%82%D1%8B%D0%B9%20%D1%81%D0%B5%D0%BA%D1%82%D0%BE%D1%80/writeup/Pasted%20image%2020250419025339.png)

2. Переносим файлы в отдельную папку и либо проходимся по всем файлам вручную (с помощью, например, Notepad++), либо грепаем flag с -i. Части флага легко ищутся в:
    

autoexec.bat (TyumenCTF{)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/forensic/%D0%91%D0%B8%D1%82%D1%8B%D0%B9%20%D1%81%D0%B5%D0%BA%D1%82%D0%BE%D1%80/writeup/Pasted%20image%2020250419025346.png)

stuff.tar (f1x_my)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/forensic/%D0%91%D0%B8%D1%82%D1%8B%D0%B9%20%D1%81%D0%B5%D0%BA%D1%82%D0%BE%D1%80/writeup/Pasted%20image%2020250419025353.png)

system.log (1mag3_)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/forensic/%D0%91%D0%B8%D1%82%D1%8B%D0%B9%20%D1%81%D0%B5%D0%BA%D1%82%D0%BE%D1%80/writeup/Pasted%20image%2020250419025359 1.png)

security.cfg (f1l3})

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/forensic/%D0%91%D0%B8%D1%82%D1%8B%D0%B9%20%D1%81%D0%B5%D0%BA%D1%82%D0%BE%D1%80/writeup/Pasted%20image%2020250419025404.png)

Также находим единственный открывающийся архив SUS.RAR в MISC\ARCHIVE, в котором лежит файл FLAG_PART4

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/forensic/%D0%91%D0%B8%D1%82%D1%8B%D0%B9%20%D1%81%D0%B5%D0%BA%D1%82%D0%BE%D1%80/writeup/Pasted%20image%2020250419025419.png)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/forensic/%D0%91%D0%B8%D1%82%D1%8B%D0%B9%20%D1%81%D0%B5%D0%BA%D1%82%D0%BE%D1%80/writeup/Pasted%20image%2020250419025422.png)

и единственную открывающуюся картинку DUNNO.PNG в MISC\IMAGES

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/forensic/%D0%91%D0%B8%D1%82%D1%8B%D0%B9%20%D1%81%D0%B5%D0%BA%D1%82%D0%BE%D1%80/writeup/Pasted%20image%2020250419025432.png)

3. Собираем флаг. У нас уже есть подсказки в виде FLAG_PARTx, где x – номер кусочка флага.
## Флаг
TyumenCTF{f1x_my_br0ken_disk_1mag3_f1l3}
