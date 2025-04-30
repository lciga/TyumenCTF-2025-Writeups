# Это точно web?

Давным-давно, в далёкой-далёкой галактике…


## Решение (*путь воина*)
При открытие сайты мы видим текст формата
```
7️⃣2️⃣ 5️⃣2️⃣ 1️⃣1️⃣5️⃣ 7️⃣3️⃣ 6️⃣5️⃣ 7️⃣9️⃣ 4️⃣8️⃣...
```
переведем его в ASCII символы для более удобной работы далее
```python
# coding=utf-8
s = "7️⃣2️⃣ 5️⃣2️⃣ 1️⃣1️⃣5️⃣ 7️⃣3️⃣ 6️⃣5️⃣ 7️⃣9️⃣ 4️⃣8️⃣ ..."
s = s.replace("1️⃣", "1") \
	.replace("2️⃣", "2") \
	.replace("3️⃣", "3") \
	.replace("4️⃣", "4") \
	.replace("5️⃣", "5") \
	.replace("6️⃣", "6") \
	.replace("7️⃣", "7") \
	.replace("8️⃣", "8") \
	.replace("9️⃣", "9") \
	.replace("0️⃣", "0")
print(s)
```
*Дальше для решения удобно использовать [CyberChef](https://gchq.github.io/CyberChef)*

Дальше не трудно заметить что это какие то закодированные данные в десятичной системе. При переводе получаем строчку похожую на Base64
```
H4sIAO0G/WcC/3VTiY3DMAxbRSMktp54nFyb7D/CkXQOh6IJUBgCS1MSzWRYDfPdcrNs5mXZLYGcOnfzYQGOir6aH8KHVeeZh0WzHrzlQnoK/7FaLDaLFL5bH9Zw968dBAO/oiAQ1iCvH63zbenmm1o468B5WkHzZb2zRU28qJAv6uNWB45i5XjUbxYYrJGP8cjvnJlju7p0aZ7UJ38xB4iVV842baFmEUcveIW+qGnL3OgQB3xZxO1Ss62y9Pzn0OdTtXNfXCHHaTK3fl124e705FIb6uvckfbuFAGfhE0PVJemJznf+OyFuyDUpvp94dzi0PCfeJcP33zgdBtSTWnRu/jka0dMm3U/Q40HfL/bRU95i7N+2GUm4RaPW/6456NXPHg1Mzwj3ZWQmYfr0widCO3GXCFmMIoKilwpSAxn6K1DtCH9hSFEsJHP9tZHFFIovfXC7viXyZQnSEv1X9cENevCAwAA
```
После применения Base64 получаем бинарные данные, где можно заметить сигнатуру Gzip (1f 8b), после применения получаем данные закодированные в hex   
```
65 79 4a 68 62 47 63 69 4f 69 4a 49 55 7a 49 31 4e 69 49 73 49 6e 52 35 63 43 49 36 49 6b 70 58 56 43 4a 39 2e 65 79 4a 7a 5a 57 4e 79 5a 58 51 69 4f 69 4a 6d 64 48 52 34 64 54 6f 76 4c 33 70 74 64 57 5a 6c 65 6d 30 75 61 6e 4e 72 59 32 70 36 64 53 35 35 64 6d 63 76 4f 54 4e 70 4d 6a 41 79 62 47 30 77 4d 57 68 74 4d 7a 45 79 4e 47 31 71 4e 7a 56 74 61 47 6f 79 4e 47 68 6f 4e 44 51 31 61 44 55 69 4c 43 4a 74 5a 58 4e 7a 59 57 64 6c 49 6a 6f 69 58 48 55 77 4e 44 46 6c 58 48 55 77 4e 44 51 31 49 46 78 31 4d 44 51 7a 4e 31 78 31 4d 44 51 30 4d 46 78 31 4d 44 51 30 5a 69 42 63 64 54 41 30 4e 47 59 67 58 48 55 77 4e 44 51 79 58 48 55 77 4e 44 51 7a 58 48 55 77 4e 44 4d 30 58 48 55 77 4e 44 4d 77 49 46 78 31 4d 44 51 7a 5a 6c 78 31 4d 44 51 7a 5a 56 78 31 4d 44 51 7a 59 6c 78 31 4d 44 51 7a 4e 56 78 31 4d 44 51 7a 4e 79 4a 39 2e 39 62 74 4d 69 49 75 49 72 38 76 35 42 4d 45 35 70 77 61 65 43 45 38 79 44 50 4f 33 53 2d 6b 75 76 37 69 50 7a 33 6a 48 48 4c 73
```
После декодирования получаем строчку похожую на Base64, но с небольшим отличием, в строке есть 2 точки, что намекает что это jwt токен
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWNyZXQiOiJmdHR4dTovL3ptdWZlem0uanNrY2p6dS55dmcvOTNpMjAybG0wMWhtMzEyNG1qNzVtaGoyNGhoNDQ1aDUiLCJtZXNzYWdlIjoiXHUwNDFlXHUwNDQ1IFx1MDQzN1x1MDQ0MFx1MDQ0ZiBcdTA0NGYgXHUwNDQyXHUwNDQzXHUwNDM0XHUwNDMwIFx1MDQzZlx1MDQzZVx1MDQzYlx1MDQzNVx1MDQzNyJ9.9btMiIuIr8v5BME5pwaeCE8yDPO3S-kuv7iPz3jHHLs
```

Получаем строчку похожую на ссылку и небольшое сообщение
```
{
    "secret": "fttxu://zmufezm.jskcjzu.yvg/93i202lm01hm3124mj75mhj24hh445h5",
    "message": "Ох зря я туда полез"
}
```

По строке в виде ссылки можно сказать что алгоритм шифрование скорее всего переставляет символы алфавита местами, так как спец символы стоят на привычном месте у ссылки. Самый известный алгоритм перестановки символов это шифр Цезаря
```
sggkh://mzhsrmz.wfxpwmh.lit/93v202yz01uz3124zw75zuw24uu445u5
```
Но даже так с нашей строкой что то не так, давайте вспомним какие ещё алгоритмы перестановки у нас есть
Подсказка: известный шифр, основанный замене i-ой буквы алфавита буквой с номером n − i + 1, где n — число букв в алфавите 

Получаем 
```
https://nashina.duckdns.org/93e202ba01fa3124ad75afd24ff445f5
```
При  переходе по ссылке в описание к видео есть ещё одна ссылка на видео [Эпидемия, Смешарики - Лесник (Король и Шут cover)](https://www.youtube.com/watch?v=cAwnTYNIdXQ), по тексту которой можно узнать подсказку о том что всё таки стоит проверять файл robots.txt😊

## Решение (*путь сигмы*)
Каждый сигмач знает что на таксках категории Web стоит проверять файл robots.txt, потому что редко но метко там что то есть. 

## Флаг

```
TyumenCTF{Yes_1t_1s-w3b}

```
