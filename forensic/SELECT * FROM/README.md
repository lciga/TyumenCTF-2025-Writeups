# SELECT * FROM
Зачем шифровать то, что никто не увидит? Вот и они подумали так же

## Решение

Решить можно двумя вариантами: с помощью программ для работы с базами данных, например, `DB Browser for SQLite ` или с помощью системных утилит Linux

### Решение 1: DB Browser for SQLite
Открываем наш файл в программе и на вкладке `Browse Data` мы можем просматривать таблицы. Мы знаем, что что-то должны шифровать, но это сделано не было, очевидно что это какие-то учётные данные. Находим в БД две таблицы, в которых может быть зацепка - `employee_credentail` и `cutomer_credentail`. Изучив таблицы мы находим флаг.

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/forensic/SELECT%20*%20FROM/writeup/Pasted%20image%2020250412113245.png)

### Решение 2: Strings
Попробуем посмотреть содержимое файла через утилиту Linux `strings`:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/forensic/SELECT%20*%20FROM/writeup/Pasted%20image%2020250412113510.png)

Мы видим, что данные в БД хранятся в виде открытого текста, попробуем с помощью `grep` найти флаг:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/forensic/SELECT%20*%20FROM/writeup/Pasted%20image%2020250412113654.png)

## Флаг
`TyumenCTF{570r3_p455W0rd5_45_4_h45H}`