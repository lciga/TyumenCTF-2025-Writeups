from PIL import Image
import random
import os


class LFSR:
    def __init__(self):
        self.register = os.urandom(5)
        self.branches = [5, 2, 1]
        self.n = len(self.register)

    def next_bit(self):
        ret = self.register[self.n - 1]
        new = 0
        for i in self.branches:
            new ^= self.register[i - 1]
        self.register = [new] + self.register[:-1]
        return ret


def encrypt_png(png_path: str, result_path):
    generators = [LFSR(), LFSR(), LFSR()]

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
    for i in range(10):
        x = random.randint(0, 1280)
        y = random.randint(0, 1280)
        print(f"{x = }, {y = }, {pixels[x, y] = }")
    new_image.save(result_path, image.format)



if __name__ == '__main__':
    encrypt_png("flag.png", 'output.png')