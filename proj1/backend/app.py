from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import mysql.connector
import time

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*") 

def get_db():
    return mysql.connector.connect(
        host='localhost',
        user='admin',
        password='adminpassword202412',
        database='mydb'
    )

@app.route("/")
def index():
    return jsonify({"status": "Server is running!"})

@app.route('/api/projects/<int:id>/count', methods=['GET'])
def get_project(id):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM node WHERE projectId = %s", (id,))
    node_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM element WHERE projectId = %s", (id,))
    elements_count = cursor.fetchone()[0]
    
    conn.close()
    
    return jsonify({
        'project_id': id,
        'node_count': node_count,
        'element_count': elements_count
    })

@socketio.on("connect")   
def handle_connect():
    print("Client connected")

@socketio.on("request_data")
def send_data(data):
    project_id = data.get("projectId")  
    if project_id is None:
        socketio.emit("response_data", {"error": "No projectId provided"})
        return

    try:
        conn = get_db()
        cursor = conn.cursor()
        

        cursor.execute("SELECT COUNT(*) FROM node WHERE projectId = %s", (project_id,))
        node_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM element WHERE projectId = %s", (project_id,))
        element_count = cursor.fetchone()[0]
        
        conn.close()
        
        data = {
            "project_id": project_id,
            "node_count": node_count,
            "element_count": element_count
        }
        socketio.emit("response_data", data)
    except Exception as e:
        socketio.emit("response_data", {"error": str(e)})

if __name__ == "__main__":
    socketio.run(app, debug=True, host="127.0.0.1", port=5000)
