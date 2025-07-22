from requests import get


ans = [set(range(1, 251)) for i in range(19)]
count = 0
while len(max(ans, key=len)) > 1:
    response = get("http://127.0.0.1:5000/get_ct").content
    count += 1
    for i in range(19):
        if response[i] in ans[i]:
            ans[i].remove(response[i])



print("".join(map(lambda x: chr(list(x)[0]), ans)))
print(count)
