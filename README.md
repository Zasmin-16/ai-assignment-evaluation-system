# 🧠 AI ASSIGNMENT EVALUATION SYSTEM

### Smart AI-Powered Academic Grading Platform

AI Assignment Evaluation System is a full-stack web application that
automates assignment submission, semantic evaluation, and academic
workflow management using Artificial Intelligence.

Built with Flask, React, Supabase, Cloudinary, and Sentence
Transformers, the platform delivers instant AI-based scoring, structured
professor review, and secure cloud-based document handling.

------------------------------------------------------------------------

## 🚀 Key Features

### 🤖 AI Semantic Evaluation

Automatically generates: - AI Score (0--100) - Semantic similarity-based
grading - Context-aware text comparison - Instant evaluation after
submission

Powered by: - Sentence Transformers (all-MiniLM-L6-v2) - Cosine
Similarity - NLP-based semantic analysis

------------------------------------------------------------------------

### 👥 Role-Based Access System

#### 🎓 Student

-   View subjects
-   View assignments
-   Upload PDF submissions
-   Receive instant AI score
-   View final professor-reviewed score
-   View feedback

#### 👨‍🏫 Professor

-   Create subjects
-   Upload question papers (PDF)
-   Set deadlines & maximum marks
-   View submission count
-   Track assignment status (Active / Expired)
-   Review & override AI score
-   Provide feedback
-   Delete assignments

#### 🔐 Admin

-   Approve / reject professors
-   View all users
-   Monitor subjects & assignments
-   Oversee system activity

------------------------------------------------------------------------

## ☁️ Cloud-Based File Handling

-   Secure PDF uploads using Cloudinary
-   Stores question papers & student submissions
-   Fast retrieval for AI processing

------------------------------------------------------------------------

## 🗄️ Database System

Supabase (PostgreSQL) is used to manage: - User authentication - Role
management - Subjects - Assignments - Submissions - AI scores - Final
scores - Feedback

------------------------------------------------------------------------

## 🎨 Modern Professional UI

Built with: - React.js - TailwindCSS - Framer Motion

Design Highlights: - Clean professional layout - Smooth fade-in
animations - Responsive dashboards - Interactive modals - Status badges
(Active / Expired)

------------------------------------------------------------------------

## 📊 System Workflow

Professor uploads Question Paper\
↓\
Student submits Assignment\
↓\
PDF Text Extraction\
↓\
Semantic Similarity Evaluation\
↓\
AI Score Generated\
↓\
Stored in Database\
↓\
Professor Review (Optional Override)\
↓\
Final Score Visible to Student

------------------------------------------------------------------------

## 🛠️ Technology Stack

### Frontend

-   React.js
-   TailwindCSS
-   Framer Motion
-   React Router

### Backend

-   Flask (Python)
-   Supabase (Auth + PostgreSQL)
-   Cloudinary (File Storage)
-   PyPDF2 (Text Extraction)

### AI Engine

-   Sentence Transformers
-   Cosine Similarity
-   NLP-based semantic scoring

------------------------------------------------------------------------

## 🔐 Security & Authentication

-   JWT-based authentication
-   Role-based route protection
-   Secure API communication
-   Protected dashboard access
-   Token-based authorization

------------------------------------------------------------------------

## 🎯 Purpose of the System

This platform addresses key academic challenges: - Reduces manual
grading workload - Provides instant feedback to students - Ensures fair
and consistent evaluation - Improves assignment management efficiency -
Simulates a real-world academic evaluation system

------------------------------------------------------------------------

## 📈 Future Enhancements

-   Plagiarism detection module
-   AI-generated written feedback summary
-   Rubric-based grading system
-   PDF report generator
-   Performance analytics dashboard
-   Multi-institution support
-   LMS integration (Google Classroom / Moodle)

------------------------------------------------------------------------

## 👨‍💻 Developed By

Zasmin Prajapati\
Final Year Project -- AI & Full-Stack Development
