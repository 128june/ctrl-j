from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Hello from Python API on Vercel!"})

@app.route('/api/data')
def get_data():
    return jsonify({
        "data": [1, 2, 3, 4, 5],
        "status": "success",
        "message": "This data is coming from your Python backend"
    })

# Vercel requires the app to be exposed as 'app'
# No app.run() needed for Vercel, but useful for local testing
if __name__ == '__main__':
    app.run(debug=True)
