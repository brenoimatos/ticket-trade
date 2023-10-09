# Banca - Your Peer-to-Peer Ticket Marketplace

Welcome to the repository of Banca, an online peer-to-peer marketplace dedicated to buying and selling tickets for events. Our platform aims to be more organized, scalable, centralized, and trustworthy compared to traditional methods like WhatsApp and Facebook groups. The events listed on Banca are web scraped from a ticketing platform, ensuring a wide variety of events for users to engage with.

Check it out live at [bancaingressos.com](https://bancaingressos.com).


## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Features](#features)
3. [Upcoming Features](#upcoming-features)
4. [Local Development](#local-development)

## Technology Stack
I chose a range of modern technologies to ensure a scalable, efficient, and enjoyable user experience for Banca. Here's a breakdown of the tech stack I used:

- **Backend**: 
  - I selected FastAPI for its high performance and asynchronous capabilities, which are crucial for handling concurrent requests in a modern web application. Built on top of Starlette for web routing and ASGI support, FastAPI facilitates building robust and scalable APIs. The built-in interactive API documentation is a fantastic feature that significantly aids in testing endpoints throughout the development process.
  
- **Frontend**: 
  - React, a JavaScript library for building user interfaces, powers the frontend. It allows for the creation of a fast, scalable, and simple user interface with reusable components, significantly accelerating the development process.
  
- **Containerization**: 
  - Docker helps in creating, deploying, and running applications using containers. Containers enable packaging up an application along with all the parts it needs, such as libraries and other dependencies, and shipping it all out as one package.
  
- **Orchestration**: 
  - Docker Compose is used to define and manage multi-container Docker applications. It allows for defining a multi-container environment in a single file, then spinning up the application stack with a single command.
  
- **Database**: 
  - PostgreSQL, a powerful, open-source object-relational database system, is chosen for data management. With more than 15 years of active development, it has a proven architecture and a strong reputation for reliability, data integrity, and correctness.
  
- **ORM**:
  - SQLAlchemy simplifies database interactions and provides a level of abstraction and flexibility, making it adaptable should there be a need to switch to a different type of database in the future. Additionally, it aids in type safety, ensuring that the data types used in the code are compatible with the data types in the database, reducing the likelihood of type-related errors.
  
- **SSL Certificate**: 
  - Let's Encrypt is used to obtain a free, automated, and open certificate for the domain, ensuring a secure HTTPS connection for users.
  
- **Web Server**: 
  - NGINX serves as a web server and possibly a reverse proxy for the application, efficiently handling requests and ensuring smooth communication between the frontend and backend services.
  
- **Hosting**: 
  - The app is hosted on AWS EC2. It's a reliable choice for deploying applications, and offers the scalability needed for growing projects and the possibility of Free Tier.


## Features
- **Event Selection**: From the home screen, choose an event or use the search functionality to find one.
- **Ticket Trading**: Click on an event to announce whether you are buying or selling tickets. Specify your price, the number of tickets, and provide a description.
- **Contact Information**: Logged-in users can view the contact information of the announcer by clicking on the ticket listing.

## Upcoming Features
- **OAuth Authentication**: Sign-in using Google.
- **Review System**: Review buyers/sellers with comments and ratings.
- **Active Contact Request**: Instead of displaying contact information directly on the site, implement a feature to request contact info more actively.


## Local Development
To get started with the development setup, you'll need to have Visual Studio Code installed along with the Remote - Containers extension. This setup allows for opening the project within a Docker container, ensuring that the environment is consistent and fully configured.

- **Backend**:
  - Navigate to the `backend` directory and execute the following command to start the backend services:
    ```bash
    docker-compose up
    ```
  - This command will orchestrate the Docker containers defined in the `docker-compose.yml` file located within the `backend` directory, allowing you to debug the backend services in a contained environment.

- **Frontend**:
  - Navigate to the `frontend` directory and execute the following command to start the frontend development server:
    ```bash
    npm start
    ```
  - Visit `localhost:3000` in your browser to start interacting with the frontend.


