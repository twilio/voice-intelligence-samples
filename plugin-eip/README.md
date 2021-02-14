# plugin-eip
A few CLI commands that may provide to be helpful during your EIP journey!

## eip:import
Pushes all .wav and .mp3 files from a given directory to EIP, without uploading to a third-party location. eip:import sets up a Restify server and an Ngrok tunnel to provide temporary access to local media when creating new transcripts.

### Required Parameters
* `--service-sid`: Your EIP service SID. Begins with GAxxx. If a service SID is not specific, we'll default to checking for the EIP_SERVICE_SID environment variable

### Usage
```
twilio eip:import --service-sid GAxxxx ./your/media/directory
```

## Todo
- [ ] Add directory existence checks and error handling for failed requests for eip:import
- [ ] Silent mode and table output mode for eip:import
- [ ] Transcoding of media and media validation for eip:import
- [ ] Participant data support (via metadata.csv) for eip:import
- [ ] Create eip:push to push individual files to EIP