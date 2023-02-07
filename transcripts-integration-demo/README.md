# Voice Intelligence Transcripts Integration Demo

This repository is a companion project to the Voice Intelligence Transcripts Integration Guide.  

![Transcripts Integration Demo Screenshot](/public/img/screenshot.png)

It scaffolds two basic types of integration:
1. **Embedded Transcripts**: This demonstrates how you might embed the transcripts into your webapp via iframe.
2. **Standalone Transcripts**: This is another basic integration that redirects the user into a new window for transcripts in a specific service.

## Quick Start

### Step 1: Populate the environment with your account credentials
This project uses the `dotenv` library to load environment variables. It expects a `.env` to be populated with relevant credentials at the root of the repository directory. A sample to be filled out has been provided at `.env.sample`.

1. Login to your Twilio Account and access your account credentials.
2. Copy the `.env.sample` to `.env`
3. Open and edit the file with the values above.

### Step 2: Install and Start
```bash
# Clone the repository
git clone https://github.com/twilio/voice-intelligence-samples.git

# Go inside the directory
cd transcripts-integration-demo

# Install dependencies
yarn install (or npm install)

# Start development server
yarn start (or npm start)
```

### Step 3: Load the Transcripts

To view the embedded implementation:
```
http://localhost:8080/transcripts/embedded
```

To view the standalone implementation:
```
http://localhost:8080/transcripts/standalone

```

## Documentation

This demo illustrates the 3 key actions required to initialize the Transcripts:
1. Acquire a one time token
2. Use the one time token to initialize the Transcripts

### Transcripts Standalone

The high level sequence of operations for redirecting to the standalone editor:  
1. Generate a one time token
2. Redirect the client to the Transcripts url with token appended

### Transcripts Embedded

The high level sequence of operations for embedding the Transcripts are as follows:
1. Generate a one time token
2. Render the web application with a Transcripts embedded iframe
