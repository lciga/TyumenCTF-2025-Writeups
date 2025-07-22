def transform(s):
    res = []
    for i, ch in enumerate(s):
        a = ord(ch)
        a = a ^ 26
        a = a + (i % 5)
        a = a ^ 13
        a = a - (i % 3)
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