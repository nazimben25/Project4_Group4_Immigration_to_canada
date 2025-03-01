from flask import Flask, send_from_directory

app = Flask(__name__, static_url_path='', static_folder='frontend')

# Serve the CSS file
@app.route('/css/styless.css')
def serve_css():
    return send_from_directory('frontend/css', 'styless.css')

if __name__ == '__main__':
    app.run(port=5501, debug=True)  #different port to avoid problems of using same port as React app.
