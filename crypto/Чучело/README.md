# Чучело
Что за чучело?
## Решение
Шифрование: каждый пиксель изображения ксорится с битом, сгенерированным линейным сдвиговым регистром (LFSR).

### LFSR
Длина регистра: 5 байт.

Отводы (taps) для обратной связи: позиции 5, 2, 1 (нумерация с 1).

Новый байт вычисляется как XOR от битов на этих позициях.

### Известные данные

Часть исходных пикселей (10 штук) и их координаты в зашифрованном изображении.

Зашифрованное изображение (output.png).

### Шаги решения
Восстановление начального состояния регистров:

Для каждого известного пикселя вычисляем XOR между зашифрованным и исходным пикселем. Получаем бит, который был сгенерирован LFSR в этот момент.

Так как нам известна структура LFSR, мы можем выразить каждый сгенерированный бит через начальное состояние регистров.

Составляем систему уравнений и находим начальные состояния всех 5 регистров.

### Расшифровка изображения

Инициализируем LFSR с найденными начальными состояниями.

Для каждого пикселя изображения генерируем бит с помощью LFSR и применяем XOR к компонентам R, G, B (альфа-канал A не трогаем).

Код для расшифровки:
```python
from PIL import Image


class LFSR:
    def __init__(self, register):
        self.register = register
        self.branches = [5, 2, 1]
        self.n = len(register)
        assert self.n == 5

    def next_bit(self):
        ret = self.register[self.n - 1]
        new = set()
        for i in self.branches:
            new ^= self.register[i - 1]
        self.register = [new] + self.register[:-1]
        return ret


registers = [{1}, {2}, {3}, {4}, {5}]
pixels = [
    (253, 172, 205, 255),
    (254, 176, 215, 255),
    (94, 115, 98, 255),
    (100, 123, 95, 255),
    (98, 115, 99, 255),
    (239, 179, 217, 255),
    (214, 168, 197, 255),
    (168, 151, 161, 255),
    (134, 125, 118, 255),
    (241, 181, 219, 255)
]
x = [750, 662, 1159, 246, 10, 254, 1063, 885, 1157, 365]
y = [55, 133, 998, 950, 1143, 382, 116, 996, 842, 305]

image = Image.open("output.png")
w = image.width
h = image.height
pixeli = image.load()
for i in range(10):
    generator = LFSR(register=registers)
    for yi in range(w):
        for xi in range(h):
            k = generator.next_bit()
            if xi == x[i] and yi == y[i]:
                pixel = list(pixeli[xi, yi])
                print(i, k, list(pixel[j] ^ pixels[i][j] for j in range(3)))
```
0 {3} [131, 13, 101]
1 {1} [94, 175, 246]
2 {1, 3, 4} [112, 100, 119]
3 {1, 2, 3, 4, 5} [158, 159, 176]
4 {1, 3, 5} [169, 80, 239]
5 {2, 3, 4} [180, 194, 58]
6 {1, 4, 5} [135, 155, 110]
7 {4} [173, 198, 228]
8 {1, 3, 4} [112, 100, 119]
9 {3, 4, 5} [90, 57, 253]

решая систему уравнений получаем начальные значения регистров
initial_registers = [
    [158, 159, 176],  # Регистр 1
    [94, 175, 246],   # Регистр 2
    [180, 194, 58],   # Регистр 3
    [109, 246, 162],  # Регистр 4
    [112, 100, 119]   # Регистр 5
]

и запускам task.py с задаными регистрами
```python
from PIL import Image


class LFSR:
    def __init__(self, re):
        self.register = re
        self.branches = [5, 2, 1]
        self.n = len(self.register)

    def next_bit(self):
        ret = self.register[self.n - 1]
        new = 0
        for i in self.branches:
            new ^= self.register[i - 1]
        self.register = [new] + self.register[:-1]
        return ret

initial_registers = [
    [94, 175, 246],  # Регистр 1
    [154, 9, 110],   # Регистр 2
    [131, 13, 101],   # Регистр 3
    [173, 198, 228],  # Регистр 4
    [116, 242, 169]   # Регистр 5
]

def encrypt_png(png_path: str, result_path):
    generators = [LFSR([94, 154, 131, 173, 116]), LFSR([175, 9, 13, 198, 242]), LFSR([246, 110, 101, 228, 169])]

    image = Image.open(png_path)
    w = image.width
    h = image.height

    new_image = Image.new(image.mode, image.size)
    pixels = image.load()

    for y in range(h):
        for x in range(w):
            pixel = list(pixels[x, y])
            next_bits = [generator.next_bit() for generator in generators]
            new_image.putpixel((x, y), tuple(pixel[i] ^ next_bits[i] for i in range(3)))


    new_image.save(result_path, image.format)



if __name__ == '__main__':
    encrypt_png("output.png", 'ans.png')
```
## Флаг
`TyumenCTF{LFSR_br34k1ng_m4stermind}`