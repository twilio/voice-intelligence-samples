const { flags } = require('@oclif/command');
const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const ImportServer = require('../../utils/importServer');

class VintelImport extends TwilioClientCommand {
  static flags = {
    "service-sid": flags.string({
      description: 'VINTEL Service Sid. Defaults to environment variable VINTEL_SERVICE_SID',
      env: 'VINTEL_SERVICE_SID',
      required: true
    })
  }

  static args = [
    {
      name: 'directory',
      required: true,
      description: 'The directory containing your media files.'
    }
  ]

  constructor(argv, config, secureStorage){
    super(argv, config, secureStorage);
  }

  async run() {
    await super.run();
    const {args} = this.parse(VintelImport);

    try {
      const importer = new ImportServer(
        this.twilioClient.username,
        this.twilioClient.password,
        this.flags['service-sid'],
        args.directory
      );

      await importer.startImport();
    } catch(e){
      console.log(e);
    }
  }
}

VintelImport.description = `Push all media files in a given directory to Voice Intelligence`;

module.exports = VintelImport;
