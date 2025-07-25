# NiceOne crackme

Крякми, обещающий сгенерировать флаг… Где же он прячется? Отладчик точно знает...

## Решение
1.	Скачиваем файл и пытаемся запустить его через отладчик (т.к. программа консольная, пробуем воспользоваться отладчиками для 64-битных программ, например, x64dbg. В нашем случае это не особо поможет, т.к. программа явно обфусцирована, в чём мы можем убедиться, прогнав её через DetectItEasy или просмотрев начинку бинарника в шестнадцатеричном редакторе.

DetectItEasy:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024229.png)

HxD:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024244.png) 

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024251.png)

2.	Ищем упаковщик UPX 4.2.4 (UPX 4.24) и скачиваем его с официального GitHub репозитория. Нам нужна версия upx-4.2.4-win64.zip 

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024317.png)

3.	Перемещаем крякми в папку с UPX и распаковываем его с параметром -d.
`upx -d niceone.exe`

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024323.png)

4.	Запускаем крякми – он приветствует нас строкой:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024327.png)

Если попробуем ввести случайный пароль, получаем “Wrong password”. Соответственно, нам нужно найти правильный пароль.

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024329.png)

5.	Снова воспользуемся отладчиком, так как теперь программа распакована, код будет читаемым. Запускаем (нажимаем “Выполнить” один раз, чтобы войти в модуль niceone.exe) и ставим точку останова после цикла расшифровки пароля, но перед сравнением с вводом.

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024334.png)

Теперь можно запустить программу снова (“Выполнить”) и так же ввести любой пароль. По нажатии Enter после ввода программа остановится на выделенной нами команде и мы увидим правильный пароль в RDI.

 ![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024340.png)

 ![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024343.png)

Это “heap”. \r – символ возврата каретки.
6.	Теперь при обычном запуске программы и вводе правильного пароля видим сообщение:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024346.png)

Но флаг не выводится. Значит, он спрятан где-то в памяти.
Возвращаемся в x64dbg. Обычно после ввода правильного пароля программа программа доходит до функции, где флаг расшифровывается, а после завершается. Ставим точку останова после цикла дешифровки, чтобы не пропустить момент, когда флаг станет читаемым.

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024351.png)

7.	Снова запускаем программу, вводим пароль, нажимаем Enter. Программа останавливается в 0x00007FF7C03F1152 и мы видим наш флаг в R9. 

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024356.png)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024358.png)

## Решение 2. Дизассемблирование
Лично мне этот способ кажется гораздо менее приятным, но он всё ещё остаётся достаточно эффективным. Перед загрузкой файла в дизассемблер мы, конечно, всё так же распаковываем его с помощью UPX.
1.	Загружаем крякми в любой дизассемблер, например, IDA, Ghidra, Binary Ninja. Переходим к точке входа программы - start по адресу 0x140001000. Видим, что программа начинается с вывода строки “Let’s try something… Password: “ и ожидает наш ввод. Вводимый пароль сохраняется в буфер [rsp+40h+Buffer], и программа читает 5 байт (это наш heap + символ возврата каретки).

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024408.png)

2.	По адресу 0x140001063 видим цикл, расшифровывающий зашифрованный пароль из unk_14000304A.

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024414.png)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024417.png)

`unk_14000304A   db  0EEh, 0E3h, 0E7h, 0F6h, 8Bh`

3.	В цикле каждый байт XOR-ится с ключом 0x86. 

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024443.png)

Выше псевдокод (F5 по функции start). Для удобства можем переименовать переменные (N по переменной). Для понимания:
v2 -> DecryptedPasswordPtr
v3 -> EncryptedPasswordPtr
v4 -> PasswordLength

Теперь мы можем выполнить расшифровку, наприме, вручную:

```
0EEh ^ 86h = 68h -> h
0E3h ^ 86h = 65h -> e
0E7h ^ 86h = 61h -> a
0F6h ^ 86h = 70h -> p
8Bh ^ 86h = 0Dh -> \r
```

или с помощью python-скрипта (без вывода символа возврата каретки в конце. для общего вывода print(password))

```
enc = [0xEE, 0xE3, 0xE7, 0xF6, 0x8B]  
key = 0x86  

password = bytes([b ^ key for b in enc])  
print(password.decode())
```

После этого программа сравнивает наш ввод с расшифрованным паролем. Если он неверный, выводится ‘Wrong password’, иначе вызывается функция sub_1400010E0 – то есть функция генерации флага.

4.	В sub_1400010E0 программа выделяет память в куче через HeapAlloc и копирует 32 байта из unk_14000304F в выделенную память:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024616.png)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024619.png)
 
```
unk_14000304F   db  3Ch, 1Ch, 14h, 1Dh, 68h, 06h, 26h, 35h, 36h, 76h, 06h, 54h, 02h, 43h, 52h, 0Ch, 56h, 03h, 05h, 6Ah, 0Fh, 54h, 0Fh, 17h, 52h, 1Bh, 0Eh, 08h, 1Ch, 61h, 12h, 18h
```
Это наш зашифрованный флаг. Байты, указанные выше, xor’ятся с паролем heap\r.

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024628.png)

идентично
```
while ( FlagLengthCounter );
FlagBuffer[32] = 0;
FlagDecryptPtr = FlagBuffer;
FlagDecryptCounter = 32;
PasswordIndex = 0LL;
do
{
*FlagDecryptPtr++ ^= PasswordForDecryption[PasswordIndex];
PasswordIndex = (unsigned int)(PasswordIndex + 1);
if ( PasswordIndex >= 5 )
  PasswordIndex = 0LL;
--FlagDecryptCounter;
}
```

5.	Чтобы получить флаг, нам нужно расшифровать массив unk_14000304F, используя пароль heap\r. Можем сделать это, написав python-скрипт:

```
enc = [0x3C, 0x1C, 0x14, 0x1D, 0x68, 0x06, 0x26, 0x35, 0x36, 0x76,
       0x06, 0x54, 0x02, 0x43, 0x52, 0x0C, 0x56, 0x03, 0x05, 0x6A,
       0x0F, 0x54, 0x0F, 0x17, 0x52, 0x1B, 0x0E, 0x08, 0x1C, 0x61,
       0x12, 0x18]

key = [ord('h'), ord('e'), ord('a'), ord('p'), ord('\r')]
dec = bytes([b ^ key[i % 5] for i, b in enumerate(enc)])
print(dec.decode())
```

После выполнения получаем флаг.

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/reverse/NiceOne%20crackme/writeup/Pasted%20image%2020250419024731.png)

# Флаг
`TyumenCTF{n1c3_d3bugg1ng_skillz}`