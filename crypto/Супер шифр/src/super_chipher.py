import os
from flask import Flask


FLAG = b"TyumenCTF{wh4t_1t_i5_n0t}"


def get_ct():
    while True:
        chipher = os.urandom(len(FLAG))
        ct = [i * j % 251 for i, j in zip(FLAG, chipher)]
        for i, j in zip(ct, FLAG):
            if i == j:
                break
        else:
            return bytes(ct)


app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello'


@app.route('/get_ct')
def get_ciphrotext():
    return get_ct()
 

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
