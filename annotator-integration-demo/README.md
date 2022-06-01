# Twilio AI Annotator Integration Demo

This repository is a companion project to the Twilio AI Annotator Integration Guide.  

![Annotator Integration Demo Screenshot](/annotator-integration-demo/public/img/screenshot.png)

It scaffolds two basic types of integration:
1. **Embedded Annotator**: This demonstrates how you might embed the annotator into your webapp via iframe.
2. **Standalone Annotator**: This is another basic integration that redirects the user into a new window for to complete their annotation task.

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
cd annotator-integration-demo

# Install dependencies
yarn install (or npm install)

# Start development server
yarn start (or npm start)
```

### Step 3: Load the Annotator

To view the embedded implementation:
```
http://localhost:8080/annotator/embedded
```

To view the standalone implementation:
```
http://localhost:8080/annotator/standalone
```

## Documentation

This demo illustrates the 3 key actions required to initialize the Annotator:  
1. Acquire a Transcript Sid
2. Acquire a one time token
3. Use the one time token to initialize the Annotator

### Annotator Standalone

The high level sequence of operations for redirecting to the standalone editor:  
1. Authenticate the agent per your authentication system.
2. Convert the call sid passed to a transcript sid
3. Ensure the transcription has been `completed`
4. Mark the Transcript as being annotated.
5. Generate a one time token
6. Redirect the client to the Annotator url with token appended

### Annotator Embedded

The high level sequence of operations for embedding the Annotator are as follows:  
1. Authenticate the agent per your authentication system.
2. Convert the call sid passed to a transcript sid
3. Ensure the transcription has been `completed`
4. Mark the Transcript as being annotated.
5. Generate a one time token
6. Render the web application with an Annotator embedded iframe
