const restify = require('restify');
const ngrok = require('ngrok');
const fs = require('fs');
const got = require('got');

const FILETYPES = ['wav', 'mp3'];

class ImportServer {
  constructor(username, password, serviceSid, directory){
    this.username = username;
    this.password = password;
    this.serviceSid = serviceSid;
    this.directory = directory || __dirname;
    this.fileMap = new Map();
    this.ngrokUrl = "";
    this.baseUrl = `https://ai.twilio.com/v1/Services/${serviceSid}/Transcripts`

    this.server=restify.createServer();
    this.server.use(restify.plugins.bodyParser());

    this.configureRestify()
  }

  configureRestify(){
    console.log('Configuring Restify');
    // Sets up our route for serving static media files at /*
    const self = this;
    this.server.get('/*', (req, res, next)=>{
      // Only provide access to files that are part of our filemap
      if(!self.fileMap.get(req.params['*'])){
        res.send(404);
        return next(false);
      }
      return next();
    // Use Restify's built-in middleware for static file serving
    }, restify.plugins.serveStaticFiles(this.directory), 
    // Once the media file has been served, remove it from our map
    (req, res, next)=>{
      console.log(`Completed request for ${req.params['*']}`);
      self.fileMap.delete(req.params['*']);
      return next();
    });

    // When all of our requests to fetch our media have complete, close the server
    this.server.on('after', ()=>{
      if(self.fileMap.size==0)
        return self.server.close();
    });

    // Kill the process once the upload is complete
    this.server.on('close', ()=>{
      console.log("Upload Complete - Server Closed");
      process.exit();
    });    
  }

  buildFileMap(){
    console.log('Building filemap for '+this.directory);
    let files = fs.readdirSync(this.directory);
    files.forEach(file=>{
      // Checks if our file is one of our supported filetypes, based on its extension
      if((new Set([file.split('.').pop(), ...FILETYPES])).size==FILETYPES.length)
        this.fileMap.set(file, true);
    });
  }

  async startImport(){
    this.buildFileMap();
    // We have to re-bind this to self
    const self = this;

    this.server.listen(8347, function(){
      console.log('Local server started @ localhost:8347');
    
      return self.setupNgrokTunnel().then(url =>{
        self.ngrokUrl = url;
        console.log('Ngrok tunnel opened: '+url+' -> localhost:8347');
        return self.createTranscriptRequests();
      }).then(()=>{
    
      }).catch(err=>console.log);
    });
  }

  async createTranscriptRequests(){
      // Intentionally not doing this in parallel w/ Promise.all — avoids ratelimits
    for(const file of this.fileMap.keys()){
      console.log("Importing "+this.ngrokUrl+'/'+encodeURIComponent(file));
      await this.createTranscript(this.ngrokUrl+'/'+encodeURIComponent(file));
    }
    return;
  }

  async getRandomProfileImageUrl() {
    // Gets a randomly generated profile image
    let image_url = await got.get('https://randomuser.me/api')['result'][0]['picture']['thumbnail'];
    return image_url;
  }

  async createTranscript(path){
    let agent_names = ['Al', 'Alfredo', 'Luke', 'Jeroen', 'Umair', 'Tyler', 'Sahil', 'Matt', 'Osman', 'Serena'];
    let customer_names = ['Mike', 'Jim', 'James', 'Annie', 'Matt', 'Dwight', 'Pam', 'Michael', 'Kelly'];
    let request = {
      form: {
        MediaUrl: path,
        Participants: [{
          channel: 1,
          type: 'customer',
          full_name: customer_names[Math.floor(Math.random() * customer_names.length)],
          image_url: this.getRandomProfileImageUrl()
        }, {
          channel: 2,
          type: 'agent',
          full_name: agent_names[Math.floor(Math.random() * agent_namess.length)],
          image_url: this.getRandomProfileImageUrl()
        }]
      }, username: this.username,
      password: this.password,
      responseType: 'json'
    }

    try {
      const res = await got.post(this.baseUrl, request);
      if(res.statusCode !== 201)
        console.log('Failed to create transcript for '+path);
      else
        console.log('Created transcript request '+res.body.sid+' for '+path);
    } catch (e) {
      console.log(e);
    }
  }

  async setupNgrokTunnel(){
    return await ngrok.connect({
      addr: 8347
    });
  };
}

module.exports = ImportServer;