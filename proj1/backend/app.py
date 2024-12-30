from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}) 
def get_db():
    return mysql.connector.connect(
        host='localhost',
        user='admin',
        password='adminpassword202412',
        database='mydb'
    )

@app.route('/api/projects/<int:id>/count', methods=['GET'])
def get_project(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM node where projectId=%s",(id,))
    node_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM element where projectId=%s",(id,))
    elements_count = cursor.fetchone()[0]
    conn.close()
    print("Hello world")
    
    return jsonify({
        'project_id': id,
        'node_count':node_count,
        'element_count':elements_count
    })



if __name__ == '__main__':
    app.run(debug=True)
  