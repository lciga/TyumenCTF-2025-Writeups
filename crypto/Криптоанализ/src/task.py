from flask import Flask, request
from secret import chipher


app = Flask(__name__)


@app.route('/')
def home():
    return "helo!"


@app.route('/decode', methods=['GET'])
def decode():
    query = request.args.get('text')
    if query and len(query) == 16:
        return chipher(query)
    else:
        return 'Не по правилам!'


if __name__ == '__main__':
    app.run(debug=True)
