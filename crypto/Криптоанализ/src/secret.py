key = b'\xa6\xea\xdc\x93P/\xb5\x82\x94\xff\x83|\x8b\xd4+\xfc'
swap = [8, 11, 14, 13, 0, 3, 4, 10, 15, 6, 2, 12, 1, 5, 9, 7]

def chipher(text):
    text = list(ord(i) for i in text)
    for i in range(16):
        text[i] ^= key[i]
    return [text[swap[i]] for i in range(16)]
