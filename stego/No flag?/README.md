# No flag?
Ты думал, это просто мем? Но тут есть кое-что…
Формат флага: TyumenCTF{message}

## Решение:
Исходное изображение при анализе в binwalk показывает, что в конце файла 
есть подсказка: MORSE CODE! ;3

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/No%20flag%3F/binwalk.png)

Далее открыв картинку в stegsolve мы увидим странные прозрачные пиксели на alpha plane.

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/No%20flag%3F/alpha.png)

Так же их можно заметить просто через какой либо редактор:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/No%20flag%3F/editor.png)

Далее мы уже понимаем, что эти точки и есть азбука морзе. Введя их в переводчик мы можем получить наше сообщение:

![](https://github.com/lciga/TyumenCTF-2025-Writeups/blob/main/stego/No%20flag%3F/morse.png)
## Флаг
`TyumenCTF{4re_y0u_sur3_th3r3s_n0_fl4g_h3r3?}`