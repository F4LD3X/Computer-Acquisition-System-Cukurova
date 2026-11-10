from flask import Flask, render_template

app = Flask(__name__)

# Sayfa Yönlendirmeleri (Routes)
@app.route('/')
def login():
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/configurator')
def configurator():
    return render_template('configurator.html')

if __name__ == '__main__':
    # Arayüzü 5000 portunda ayağa kaldırır
    app.run(debug=True, port=5000)