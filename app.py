from flask import Flask, jsonify, request, render_template, redirect
import jwt
import datetime
from functools import wraps

app = Flask(name)
app.config['SECRET_KEY'] = 'vottakayavacherinka'

def token_required(f):
@wraps(f)
    def decorated(*args,**kwargs):
        token = request.args.get('token') #http://127.0.0.1^5000/route?token=ahsbdvilabsvbsdjbfvkjsdbfjklvbsdkfjvbkj
        if not token:
            return jsonify({'message': 'no token'}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({'message': 'Token is invalid'}), 403
        return f(*args,**kwargs)
    return decorated

@app.route('/protected',methods=['post','get'])
@token_required
def protected():
    return jsonify({'message' : 'this page is only available for users with valid tokens'})

@app.route('/login', methods=['post','get'])
def login():
    login = request.values.get('login')
    password = request.values.get('pass')
    auth = {'username': login, 'password': password}
    print(auth)
    if auth['username'] and auth['password']:
        token = (jwt.encode({'user': auth['username'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY']).decode('UTF-8'))
        with open('static/js/token.json', 'w') as tok_file:
            tok_file.write('{"checking_token": ' +'"' + token +'"' + '}')
        tok_file.close()
        message = '{"success": true, "message": "Добро пожаловать", "login": ' + '"' + login + '"' + ', "token": ' + '"' +token +'"' +'}'
        return message
    return jsonify({'message' : 'Пожалуйста, перезагрузите страницу'})

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

if name == 'main':
app.run(debug=True)