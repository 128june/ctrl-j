from flask import Flask, jsonify, request
from flask_cors import CORS
try:
    from api.scraper import scrape_diningcode
except ImportError:
    try:
        from scraper import scrape_diningcode
    except ImportError:
        scrape_diningcode = None

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return jsonify({"message": "Hello from Python API!"})

@app.route('/api/data')
def get_data():
    return jsonify({
        "data": [1, 2, 3, 4, 5],
        "status": "success",
        "message": "This data is coming from your Python backend"
    })

@app.route('/api/diningcode')
def diningcode_api():
    if not scrape_diningcode:
        return jsonify({"error": "Scraper module not found"}), 500
        
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
        
    try:
        data = scrape_diningcode(query)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
