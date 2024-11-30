
# Hostellers Sahayyak

![Hostellers Sahayyak Home](./client-js/public/screenshot/Homepage.png)

**Hostellers Sahayyak** is an innovative project designed to improve the hostel experience for students by addressing two key challenges: efficient grievance resolution and seamless attendance management. With advanced features like biometric attendance and a robust grievance system, this platform bridges the gap between students and hostel management, ensuring a better living environment for hostellers.

---

## 🚀 Features

### 1️⃣ **Role-Based Login System**
- **Students (Hostellers)**: Raise grievances, track resolution status, and view attendance records.
- **Rector**: Manage grievances, oversee attendance, and analyze performance through dashboards.
- **Higher Authorities**: Gain insights into hostel operations with advanced analytics.

### 2️⃣ **Grievance Management System**
- Raise, track, and resolve complaints related to:
  - Tiffin and mess services
  - Cleanliness
  - Wi-Fi and other facilities
- Transparent status updates and resolution tracking.

### 3️⃣ **Self-Biometric Attendance System**
- **Face Recognition**: Reliable and secure attendance.
- **Location-Based Validation**: Ensures students are within a specified range.

### 4️⃣ **Admin Dashboard**
- Comprehensive dashboard for rectors and higher authorities with data visualizations and reports.

###  5 **Developer Dashboard**
- Comprehensive dashboard for rectors and higher authorities with data visualizations and reports.
---

## 🔧 Technology Stack

### **Frontend**
- [Next.js 14](https://nextjs.org/)
- [React + Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

### **Backend**
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

### **Languages**
- TypeScript
- JavaScript

### **Security**
- Secure APIs compliant with [OWASP Top 10](https://owasp.org/www-project-top-ten/).

---

## 📂 Project Structure

```
├── client
    ├── components
    |    ├──layout
    ├── pages
	 |    ├── client
	 |    ├── admin
	 |    ├── dev
    ├── styles
    
├── server
    ├── controllers
    ├── middlewares
    ├── models
    ├── lib
    ├── routes
    └── server.js

```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ByteNinjaSmit/Hostellers-Sahayyak-Express.git
   ```

2. Navigate to the project directory:
   ```bash
   cd hostellers-sahayyak
   ```

3. Install dependencies for frontend
   ```bash
   cd client && npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the client directory.
   - Add the following variables:
     ```env
     VITE_APP_URI_API=http://localhost:5000
     ```

5. Run the development server:
   ```bash
   npm run dev
   ```
3. Install dependencies for Backend
   ```bash
   cd server && npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the server directory.
   - Add the following variables:
     ```env
     PORT=5000
     CORS_SERVER=http://localhost:5173
     MONGODB_URI=mongodb+srv://username:passwordcluster0.wvrn3hd.mongodb.net/
     JWT_SECRET_KEY=projectsecret
     DEVELOPER_NAME=zodiac
     DEVELOPER_USERNAME=devlopername
     DEVELOPER_EMAIL=abcd@email.com
     DEVELOPER_PASSWORD=Pass@1234
     ```

5. Run the development server:
   ```bash
   npm start
   or
   npx nodemon server.js
   ```

---

## 🛠️ Deployment

- Build the frontend:
  ```bash
  cd client
  npm run build
  ```
 - Build the backend:
	  ```bash
	  cd server
	  npm start
	  ```

- Deploy the backend to your preferred server (e.g., Heroku, AWS, VPS, etc.).

---

## 📊 Screenshots

### Login 
![Login Page](/client-js/public/screenshot/Login.png)

### User Dashboard
![User Dashboard](/client-js/public/screenshot/User%20Dashboard.png)

### Grivience Form 
![Grivience Form ](/client-js/public/screenshot/Grivience%20Form.png)

### Admin Dashboard
![Admin Dashboard](/client-js/public/screenshot/Admin%20Dashboard.png)

### Grievance Dashboard
![Grievance Dashboard](/client-js/public/screenshot/Grivience%20Management.png)

### Grievance Action
![Grievance Action](/client-js/public/screenshot/Grivince%20Action.png)

### User Management Dashboard 
![User Management Dashboard ](/client-js/public/screenshot/User%20Management.png)

### Attendance Dashboard 
![Attendance Dashboard ](/client-js/public/screenshot/Attendance%20Dashboard.png)

### Attendance List 
![Attendance List ](/client-js/public/screenshot/Attendance.png)

### Biometric Attendance
![Biometric Attendance](/client-js/public/screenshot/Biometric.png)

---

## 🤝 Contributing

We welcome contributions! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgments

- Special thanks to our mentors and peers for their guidance.
- Tools and frameworks that made this project possible: [Next.js](https://nextjs.org/), [React.js](https://react.dev/),[React + Vite](https://vitejs.dev/), [Express.js](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [TailwindCSS](https://tailwindcss.com/).

---

## 📬 Contact

For any queries, feel free to contact:
- **Smitraj Bankar**
- Email: [smitrajbankar11@gmail.com](mailto:smitrajbankar11@gmail.com)
- GitHub: [@ByteNinjaSmit](https://github.com/ByteNinjaSmit)

---

**#MERNstack #NextJS #TypeScript #TailwindCSS #BiometricAttendance #GrievanceSystem #OpenSource**
