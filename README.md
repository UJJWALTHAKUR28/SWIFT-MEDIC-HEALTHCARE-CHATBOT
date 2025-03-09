# SWIFT-MEDIC-HEALTHCARE-CHATBOT
# 🚑 SwiftMedic Chatbot

SwiftMedic is an AI-powered healthcare chatbot that analyzes user symptoms and provides structured medical guidance using Google's Gemini AI. It offers an efficient way to get preliminary health assessments, first-aid guidance, and next-step recommendations.

---

## ✨ Features
- **🩺 Disease Prediction**: Assesses possible conditions based on symptoms.
- **🔎 Self-Check Guide**: Helps users identify key symptoms.
- **⛑️ First Aid**: Provides immediate self-care instructions.
- **⚠️ Precautions**: Suggests preventive measures.
- **💊 Solutions & Next Steps**: Recommends treatments and when to seek professional help.

---

## 🛠️ Technologies Used
- **Frontend**: ⚛️ Next.js (React framework)
- **Backend**: 🚀 FastAPI (Python)
- **AI Model**: 🤖 Google Gemini 1.5
- **Database**: 🗄️ PostgreSQL (Optional, for storing chatbot interactions)

---

## 📂 Project Structure
- **📁 backend/** - FastAPI backend for processing chatbot requests.
- **📁 my-next-app/** - Next.js frontend for user interaction.

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/swiftmedic.git
cd swiftmedic
```

### 2️⃣ Install Dependencies
#### Backend 🖥️
```sh
cd backend
pip installpip install fastapi uvicorn requests python-dotenv pydantic

```
#### Frontend 🌐
```sh
cd my-next-app
npm install
```

### 3️⃣ Setup Gemini API Key 🔑
1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in and generate an API key.
3. Create a `.env` file inside `backend/` and add:
```sh
GEMINI_API_KEY=your_api_key_here
```

### 4️⃣ Run the Project ▶️
#### Start Backend 🏗️
```sh
cd backend
uvicorn main:app --reload
```
#### Start Frontend 🎨
```sh
cd my-next-app
ssnpm run dev
```

---

## 🔌 API Endpoints
- **📝 POST /chatbot/**
  - **Request Body**: `{ "symptoms": "Your symptoms here" }`
  - **Response**: Structured medical guidance with sections.

---

## 🔄 How It Works
1. 🏥 User enters symptoms in the frontend.
2. 📡 Request is sent to FastAPI backend.
3. 🤖 Backend processes input and queries Gemini AI.
4. 📋 AI response is structured and sent back to the frontend.
5. 🖥️ Frontend displays the response in categorized sections.

---

## 📸 Images
![Screenshot 2025-03-09 213514](https://github.com/user-attachments/assets/b8779bf0-8192-481e-a826-1bcc724d43da)


For more details, visit our GitHub repository or contact the development team.

---

