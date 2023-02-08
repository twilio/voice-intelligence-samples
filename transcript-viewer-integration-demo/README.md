# Voice Intelligence Transcript Viewer Integration Demo

This repository is a companion project to the Voice Intelligence Transcript Viewer Integration Guide.  

![Transcript Viewer Integration Demo Screenshot](/transcript-viewer-integration-demo/public/img/screenshot.png)

It scaffolds two basic types of integration:
1. **Embedded Transcript Viewer**: This demonstrates how you might embed the transcript viewer into your webapp via iframe.
2. **Standalone Transcript Viewer**: This is another basic integration that redirects the user into a new window for to visualize the transcript.

## Quick Start

### Step 1: Populate the environment with your account credentials
This project uses the `dotenv` library to load environment variables. It expects a `.env` to be populated with relevant credentials at the root of the repository directory. A sample to be filled out has been provided at `.env.sample`.

1. Login to your Twilio Account and access your account credentials.
2. Get your Voice Intelligence Service Sid from the Twilio Console or your relevant contact at Twilio.
3. Copy the `.env.sample` to `.env`
4. Open and edit the file with the values above.

### Step 2: Install and Start
```bash
# Clone the repository
git clone https://github.com/twilio/voice-intelligence-samples.git

# Go inside the directory
cd transcript-viewer-integration-demo

# Install dependencies
yarn install (or npm install)

# Start development server
yarn start (or npm start)
```

### Step 3: Load the Transcript Viewer

To view the embedded implementation:
```
http://localhost:8080/transcript-viewer/embedded
```

To view the standalone implementation:
```
http://localhost:8080/transcript-viewer/standalone
```

## Documentation

This demo illustrates the 3 key actions required to initialize the Transcript Viewer:  
1. Acquire a Transcript Sid
2. Acquire a one time token
3. Use the one time token to initialize the Transcript Viewer

### Transcript Viewer Standalone

The high level sequence of operations for redirecting to the standalone editor:  
1. Authenticate the agent per your authentication system.
2. Convert the call sid passed to a transcript sid
3. Ensure the transcription has been `completed`
4. Generate a one time token
5. Redirect the client to the Transcript Viewer url with token appended

### Transcript Viewer Embedded

The high level sequence of operations for embedding the Transcript Viewer are as follows:  
1. Authenticate the agent per your authentication system.
2. Convert the call sid passed to a transcript sid
3. Ensure the transcription has been `completed`
4. Generate a one time token
5. Render the web application with a Transcript Viewer embedded iframe
