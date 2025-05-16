# Swift Assignment API

A Node.js + Express REST API for managing users, posts, and comments loaded from [JSONPlaceholder](https://jsonplaceholder.typicode.com). Uses MongoDB for data storage and supports full CRUD operations for users.

## Features

- Load users, posts, and comments from JSONPlaceholder into MongoDB
- Attach comments to their respective posts
- CRUD operations for users
- Automatically cascade deletes (posts + comments) when deleting a user

---

## Requirements

- Node.js (v16+ recommended)
- MongoDB running locally (`mongodb://localhost:27017`)

---

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/NivashiniRagupathi/swift-assignment.git
   cd SwiftAssignment

2. **Install dependencies**
    ```bash
    npm install

3. **Run the server**
    ```bash
    npm start

Server will start on: http://localhost:3000