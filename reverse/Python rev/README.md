# Python rev

Держи странный Python-скрипт, скомпонованный в exe. Разберись, что он делает, и получи флаг!

## Решение

1.     Запустив программу, замечаем, что она ожидает ввод строки. При вводе неправильного флага выводится сообщение:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/Python%20rev/writeup/Pasted%20image%2020250419023904.png)

Значит, программа сравнивает введённую строку с каким-то заданным в коде значением (спойлер – расшифрованный массив из expected)

2.     Прогоняем программу через [pyinstxtractor](https://pyinstxtractor-web.netlify.app/) и получаем архив. Нас интересует toxor.pyc

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/Python%20rev/writeup/Pasted%20image%2020250419023912.png)

3.     Декомпилируем .pyc с помощью любого инструмента, онлайн сервиса, в нашем случае хватит [pylingual](https://pylingual.io/)

Получаем:

```python
# Decompiled with PyLingual (https://pylingual.io)  
# Internal filename: toxor.py  
# Bytecode version: 3.8.0rc1+ (3413)  
# Source timestamp: 1970-01-01 00:00:00 UTC (0)  
  
def transform(s):  
    res = []  
    for i, ch in enumerate(s):  
        a = ord(ch)  
        a = a ^ 26  
        a = a + i % 5  
        a = a ^ 13  
        a = a - i % 3  
        res.append(a)  
    return res  
  
def main():  
    uinput = input('Enter the flag: ')  
    expected = [67, 104, 122, 119, 141, 119, 87, 92, 80, 104, 100, 37, 99, 32, 95, 100, 38, 72, 104, 34, 99, 75, 115, 58, 140, 125, 117, 100]  
    if transform(uinput) == expected:  
        print('Yes, yes! This one is the true flag! ^^')  
    else:  
        print('Nope, sorry! ><')  
main()
```

4.     Находим функцию transform, отвечающую за преобразование строки. Алгоритм применяет следующие шаги:
- XOR с числом 26;
- Добавление остатка от деления индекса символа на 5;
- XOR с числом 13;
- Вычитание остатка от деления индекса на 3.

5.     В expected хранится массив, к которому необходимо применить обратный алгоритм, т.е.:

- Сложение остатка от деления индекса на 3;
- XOR с числом 13;
- Вычитание остатка от деления индекса на 5;
- XOR с числом 26

Пишем код:

``` python
def retransform(expected):  
    res = []  
    for i, a in enumerate(expected):  
        a = a + (i % 3)  
        a = a ^ 13  
        a = a - (i % 5)  
        a = a ^ 26  
        res.append(chr(a))  
    return "".join(res)  
  
expected = [67, 104, 122, 119, 141, 119, 87, 92, 80, 104, 100, 37, 99, 32, 95, 100, 38, 72, 104, 34, 99, 75, 115, 58, 140, 125, 117, 100]  
orig_string = retransform(expected)
```
6.     Запускаем и получаем флаг.
# Флаг
`TyumenCTF{r3v3rs3_x0r_m4gic}`