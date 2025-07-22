# "Тени неприкаянных" - 1 

> Достать эту кассету стоило огромных усилий. А при оцифровке её и вовсе чуть не зажевало. С виду обычная аудиозапись, но начальство сказало, что вы разберётесь, что с ней делать. 
> А, и ещё... Вот отчёт, вместе с кассетой прилагался.

Данное задание в большей части идёт на использование эффекта фазового подавления, когда при сложении двух одинаковых сигналов, один из которых инвертирован, сигналы взаимно подавляют друг друга.

У нас на руках аудиофайл, к которому если прислушаемся, то услышим на правом канале морзянку. Отважные могут сесть и пытаться вслушиваться прямо на этом моменте, но необходимо сделать следующее:

## Способ 1 (Adobe Audition)
1. Разбиваем наш трек на два канала

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/%22%D0%A2%D0%B5%D0%BD%D0%B8%20%D0%BD%D0%B5%D0%BF%D1%80%D0%B8%D0%BA%D0%B0%D1%8F%D0%BD%D0%BD%D1%8B%D1%85%22%20-%201/writeup/Pasted%20image%2020250413205147.png)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/%22%D0%A2%D0%B5%D0%BD%D0%B8%20%D0%BD%D0%B5%D0%BF%D1%80%D0%B8%D0%BA%D0%B0%D1%8F%D0%BD%D0%BD%D1%8B%D1%85%22%20-%201/writeup/Pasted%20image%2020250413205300.png)

2. Закидываем в мультитрек правый и левые каналы: 

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/%22%D0%A2%D0%B5%D0%BD%D0%B8%20%D0%BD%D0%B5%D0%BF%D1%80%D0%B8%D0%BA%D0%B0%D1%8F%D0%BD%D0%BD%D1%8B%D1%85%22%20-%201/writeup/Pasted%20image%2020250413205355.png)

3. Инвертируем правый канал. (открываем файл правого канала, эффекты, инвертировать)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/%22%D0%A2%D0%B5%D0%BD%D0%B8%20%D0%BD%D0%B5%D0%BF%D1%80%D0%B8%D0%BA%D0%B0%D1%8F%D0%BD%D0%BD%D1%8B%D1%85%22%20-%201/writeup/Pasted%20image%2020250413205442.png)

4. Возвращаемся в мультитрек. Слышим, что ничего не слышим. А точнее, слышим только азбуку Морзе
5. (Опционально) Сохраняем трек и открываем его заново. Теперь мы можем легко переписать последовательность Морзе

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/%22%D0%A2%D0%B5%D0%BD%D0%B8%20%D0%BD%D0%B5%D0%BF%D1%80%D0%B8%D0%BA%D0%B0%D1%8F%D0%BD%D0%BD%D1%8B%D1%85%22%20-%201/writeup/Pasted%20image%2020250413205605.png)

## Способ 2 (Audacity)
1. Нажимаем правой кнопкой мыши на треке (Split Stereo to Mono)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/%22%D0%A2%D0%B5%D0%BD%D0%B8%20%D0%BD%D0%B5%D0%BF%D1%80%D0%B8%D0%BA%D0%B0%D1%8F%D0%BD%D0%BD%D1%8B%D1%85%22%20-%201/writeup/Pasted%20image%2020250413211630.png)

2. Инвертируем правый трек (Effects -> Special -> Invert)

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/%22%D0%A2%D0%B5%D0%BD%D0%B8%20%D0%BD%D0%B5%D0%BF%D1%80%D0%B8%D0%BA%D0%B0%D1%8F%D0%BD%D0%BD%D1%8B%D1%85%22%20-%201/writeup/Pasted%20image%2020250413211843.png)

3. (Опционально) Сохраняем трек и визуально определяем морзянку без каких-либо помех

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/%22%D0%A2%D0%B5%D0%BD%D0%B8%20%D0%BD%D0%B5%D0%BF%D1%80%D0%B8%D0%BA%D0%B0%D1%8F%D0%BD%D0%BD%D1%8B%D1%85%22%20-%201/writeup/Pasted%20image%2020250413212022.png)

## Общее решение 
Поитогу получаем последовательность Морзе:
```
-.-. .-.. -.-. -.- .-.-.- .-. ..- -..-. ...-- .-..  -- --.. ----. -.--
```
Вбиваем последовательность в любой декодер, к примеру, CyberChef:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/%22%D0%A2%D0%B5%D0%BD%D0%B8%20%D0%BD%D0%B5%D0%BF%D1%80%D0%B8%D0%BA%D0%B0%D1%8F%D0%BD%D0%BD%D1%8B%D1%85%22%20-%201/writeup/Pasted%20image%2020250413204752.png)

Но если мы просто так перейдём по ссылке, то нас встретит совершенно другой сайт. Поэтому в отчёте указана подсказка: `ВСЕ БУКВЫ БОЛЬШИЕ, КРОМЕ ПОСЛЕДНЕЙ`

Получаем ссылку: `https://clck.ru/3LMZ9y`, которая нас приведёт вот к такому документу

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/%22%D0%A2%D0%B5%D0%BD%D0%B8%20%D0%BD%D0%B5%D0%BF%D1%80%D0%B8%D0%BA%D0%B0%D1%8F%D0%BD%D0%BD%D1%8B%D1%85%22%20-%201/writeup/Pasted%20image%2020250413205007.png)

Можем переходить ко второму заданию. Координаты не имеют никакого значения, лишь часть легенды

## Флаг
{C0NT0UR_1s_n0t_d3ad_bu7_th3_s1gn4l_l1v3s_0n}`