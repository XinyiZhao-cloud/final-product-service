# Product Service
# CST8915: Cloud-Native App for Best Buy

**Student Name**: Xinyi Zhao    
**Student ID**: 040953633    
**Course**: CST8915 Full-stack Cloud-native Development  
**Semester**: Winter 2026   

## Overview
The Product Service manages product data for the Best Buy cloud-native application.

## Responsibilities
- Retrieve all products
- Add new products
- Delete products
- Store product data in MongoDB

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- Docker
- Azure Kubernetes Service (AKS)

## API Endpoints
- `GET /` — Health check
- `GET /products` — Retrieve all products
- `POST /products` — Add a new product
- `DELETE /products/:id` — Delete a product

## Deployment
This service is containerized using Docker and deployed to AKS.

## CI/CD
A GitHub Actions workflow is used to:
- Build the Docker image
- Push the image to Docker Hub
- Restart the Kubernetes deployment automatically

## Notes
This service uses MongoDB as persistent storage. Product data is retained even if pods are restarted.
