from secret import FLAG, secret_key

ct = b''
for i in range(len(FLAG)):
    ct += bytes([FLAG[i] ^ secret_key[i % len(secret_key)]])

print(f"{ct = }")