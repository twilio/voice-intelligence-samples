# plugin-vintel
A Twilio CLI plugin that exposes a few commands that may provide to be helpful during your Voice Intelligence journey!

## Installation
You will need to install twilio-cli prior to cloning this repo. After cloning this repo, you'll need to link this plugin to CLI, so that it gets picked up. You can do so by cd'ing into the repo and running the following command.

```
twilio plugins:link plugin-vintel
```

# Command Reference

## vintel:import
Pushes all .wav and .mp3 files from a given directory to Voice Intelligence, without uploading to a third-party location. vintel:import sets up a Restify server and an Ngrok tunnel to provide temporary access to local media when creating new transcripts.

### Required Parameters
* `--service-sid`: Your Voice Intelligence service SID. Begins with GAxxx. If a service SID is not specific, we'll default to checking for the VINTEL_SERVICE_SID environment variable

### Usage
```
twilio vintel:import --service-sid GAxxxx ./your/media/directory
```

## Todo
- [ ] Add directory existence checks and error handling for failed requests for vintel:import
- [ ] Silent mode and table output mode for vintel:import
- [ ] Transcoding of media and media validation for vintel:import
- [ ] Participant data support (via metadata.csv) for vintel:import
- [ ] Create vintel:push to push individual files to Voice Intelligence
- [ ] Add support for CRUD of Voice Intelligence resources
