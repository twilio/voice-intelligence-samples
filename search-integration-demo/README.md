# Twilio AI Search Integration Demo

This repository is a companion project to the Twilio AI Search Integration Guide.  

![Search Integration Demo Screenshot](/public/img/searchApp.png)

It scaffolds two basic types of integration:
1. **Embedded Search**: This demonstrates how you might embed the search into your webapp via iframe.
2. **Standalone Search**: This is another basic integration that redirects the user into a new window for search in a specific service.

## Quick Start

### Step 1: Populate the environment with your account credentials
This project uses the `dotenv` library to load environment variables. It expects a `.env` to be populated with relevant credentials at the root of the repository directory. A sample to be filled out has been provided at `.env.sample`.

1. Login to your Twilio Account and access your account credentials.
2. Get your EIP Service Sid from the Twilio Console or your relevant contact at Twilio.
3. Copy the `.env.sample` to `.env`
4. Open and edit the file with the values above.

### Step 2: Install and Start
```bash
# Clone the repository
git clone https://github.com/twilio/eip-samples.git

# Go inside the directory
cd search-integration-demo

# Install dependencies
yarn install (or npm install)

# Start development server
yarn start (or npm start)
```

### Step 3: Load the Search

To view the embedded implementation:
```
http://localhost:8080/search/embedded
```
List all services to load embedded implementation of search:
```
http://localhost:8080/services/embedded

```

To view the standalone implementation:
```
http://localhost:8080/search/standalone

```
List all services to load standalone implementation of search:
```
http://localhost:8080/services/standalone

```

## Documentation

This demo illustrates the 3 key actions required to initialize the Search:  
1. Acquire a Transcript Sid
2. Acquire a one time token
3. Use the one time token to initialize the Search

### Search Standalone

The high level sequence of operations for redirecting to the standalone editor:  
1. Authenticate the agent per your authentication system.
2. Get Service sid from the list
5. Generate a one time token
6. Redirect the client to the Search url with token appended

### Search Embedded

The high level sequence of operations for embedding the Search are as follows:  
1. Authenticate the agent per your authentication system.
2. Get Service sid from the list
5. Generate a one time token
6. Render the web application with an Search embedded iframe
