The Formix Backend is a RESTful API built with NestJS and Prisma, providing the core functionality for a collaborative form-building and presentation application. It powers the frontend by handling authentication, form templates, user responses, analytics, and real-time collaboration.

🚀 Features

Authentication & Authorization

Secure user registration and login

JWT-based authentication

Role-based access control

Form Management

Create, update, and delete form templates

Support for multiple question types (text, multichoice, etc.)

Versioning to track changes in templates

Form Responses

Store and manage user-submitted answers

Support for selecting newly added options in templates

Aggregated analytics for forms

Collaboration

Real-time updates with Socket.IO

Multi-user editing support

Style customization with more than 30+ effects stored in JSON format

Database

Prisma ORM with PostgreSQL

Well-structured models: User, Presentation, Slide, TextBlock, Template, Question, Option, and Answer

Integration

API-ready for third-party integration (e.g., Odoo module connection)

Token-based access for secure data sharing

🛠️ Tech Stack

Framework: NestJS

Database ORM: Prisma

Database: PostgreSQL

Real-time: Socket.IO

Authentication: JWT
