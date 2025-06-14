# Airport Search System Setup Guide

Welcome to the Airport Search System, a powerful tool that enables you to search for airports by name, city, or IATA code, and discover nearby airports based on geographic coordinates. This comprehensive guide will walk you through the complete setup process for both Linux and Windows environments.

## System Requirements

Before beginning the installation, ensure your system meets the following requirements:

**Essential Components:**
- Node.js version 16 or later
- MongoDB version 5.0 or later
- Git for repository management

**Linux Environment:**
- Terminal access with sudo privileges
- Ubuntu, Debian, or compatible distribution

**Windows Environment:**
- PowerShell or Command Prompt
- Administrative privileges for installation

## Installation Process

### Step 1: Repository Setup

Begin by cloning the project repository to your local machine:

```bash
git clone https://github.com/your-username/airport-search-backend.git
cd airport-search-backend
```

### Step 2: Dependency Installation

Install all required Node.js packages using npm:

```bash
npm install
```

### Step 3: Database Configuration

**For Linux Systems (Ubuntu/Debian):**

Update your package repository and install MongoDB:

```bash
sudo apt update
sudo apt install -y mongodb
```

Start and enable the MongoDB service:

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

**For Windows Systems:**

Download the MongoDB Community Edition from the official MongoDB website. Run the installer with administrative privileges and ensure MongoDB is added to your system PATH. Once installed, start the MongoDB service:

```powershell
net start MongoDB
```

### Step 4: Database Population

Populate your database with airport data by running the seed script:

```bash
npm run seed
```

This process will create the necessary collections and indexes while importing comprehensive airport information into your MongoDB instance.

## Launching the Application

Start your server with the following command:

```bash
npm start
```

The application will initialize on port 5000. You should see a confirmation message indicating the server is running at http://localhost:5000.

## API Reference

### Airport Search Endpoint

**Endpoint:** `GET /api/airports/search`

**Parameters:**
- `query` (required): Search term for airport name, city, or IATA code

**Example Request:**
```
GET /api/airports/search?query=del
```

**Response Format:**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k",
    "name": "Indira Gandhi International Airport",
    "city": "Delhi",
    "country": "India",
    "iata": "DEL",
    "icao": "VIDP"
  }
]
```

### Nearby Airports Endpoint

**Endpoint:** `GET /api/airports/nearby`

**Parameters:**
- `lat` (required): Latitude coordinate
- `lon` (required): Longitude coordinate
- `radius` (optional): Search radius in kilometers (default: 100)

**Example Request:**
```
GET /api/airports/nearby?lat=28.6139&lon=77.2090&radius=50
```

**Response Format:**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k",
    "name": "Indira Gandhi International Airport",
    "city": "Delhi",
    "country": "India",
    "iata": "DEL",
    "icao": "VIDP",
    "distance": 12.5
  }
]
```

## Testing Your Installation

Verify your installation by testing the API endpoints using curl commands:

**Search Functionality Test:**
```bash
curl "http://localhost:5000/api/airports/search?query=del"
```

**Nearby Airports Test:**
```bash
curl "http://localhost:5000/api/airports/nearby?lat=28.6139&lon=77.2090"
```

You can also use tools like Postman or Insomnia for more comprehensive API testing with a graphical interface.

## Production Deployment

When preparing for production deployment, consider implementing these essential components:

**Environment Configuration:**
Set up environment variables for database connections, API keys, and other sensitive configuration data.

**Process Management:**
Install and configure PM2 for robust process management:

```bash
npm install -g pm2
pm2 start app.js --name airport-api
pm2 save
pm2 startup
```

**Reverse Proxy Setup:**
Configure Nginx or Apache as a reverse proxy to handle SSL termination and load balancing.

**Database Security:**
Enable MongoDB authentication and configure appropriate user permissions for enhanced security.

## Troubleshooting Guide

### MongoDB Connection Issues

If you encounter database connection problems, verify that MongoDB is running properly and no other services are occupying port 27017. Check your connection string configuration in the main application file.

### Geospatial Query Problems

Ensure the 2dsphere index exists for location-based queries:

```bash
mongo airport-search --eval 'db.airports.getIndexes()'
```

If the index is missing, recreate it:

```bash
mongo airport-search --eval 'db.airports.createIndex({ location: "2dsphere" })'
```

### Empty Search Results

Verify that the database seeding process completed successfully. Check the console output during the seed operation for any error messages or warnings.

### Port Conflicts

If port 5000 is already in use, modify the port configuration in your application settings or terminate the conflicting process.

## Development Workflow

The system is designed with extensibility in mind. When contributing to the project, follow these guidelines:

Create feature branches for new functionality, ensure comprehensive testing of both search and geospatial features, and maintain consistent code formatting throughout the codebase. Document any new API endpoints or configuration options thoroughly.

## Performance Optimization

For optimal performance, consider implementing caching mechanisms for frequent searches, database connection pooling for high-traffic scenarios, and appropriate indexing strategies for your specific use cases.

## Security Considerations

Implement input validation for all API endpoints, configure CORS policies appropriately for your deployment environment, and consider rate limiting to prevent abuse of your API endpoints.

## License and Distribution

This project is released under the MIT License, allowing for both commercial and non-commercial use with proper attribution. The codebase is maintained with modern JavaScript standards and follows industry best practices for Node.js applications.

The Airport Search System provides a robust foundation for location-based airport discovery and can be easily integrated into larger travel applications or used as a standalone service for airport information retrieval.
