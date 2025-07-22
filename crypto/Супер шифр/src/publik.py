import os
from flask import Flask


FLAG = b"TyumenCTF{fake_flag}"


def get_ct():
    while True:
        chipher = os.urandom(len(FLAG))
        ct = [i * j % 251 for i, j in zip(FLAG, chipher)]
        fl = True
        for i, j in zip(ct, FLAG):
            if i == j:
                fl = False
        if fl:
            return bytes(ct) # " ".join(map(str, ct))


app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello'


@app.route('/get_ct')
def get_ciphrotext():
    return get_ct()
 

if __name__ == '__main__':
    app.run(debug=True)
