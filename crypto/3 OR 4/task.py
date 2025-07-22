import sys 

stdoutOrigin=sys.stdout 
sys.stdout = open("output.txt", "w")

flag = list(b"TyumenCTF{#########}")

m = []
for i in range(0, len(flag)):
    if flag[i] != flag[3]:
        C = flag[i] ^ flag[3]
    else:
        C = flag[3]
    m.append(C)

print(m)

sys.stdout.close()
sys.stdout=stdoutOrigin