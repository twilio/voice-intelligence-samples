const { flags } = require('@oclif/command');
const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const ImportServer = require('../../utils/importServer');

class EipImport extends TwilioClientCommand {
  static flags = {
    "service-sid": flags.string({
      description: 'EIP Service Sid. Defaults to environment variable EIP_SERVICE_SID',
      env: 'EIP_SERVICE_SID',
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
    const {args} = this.parse(EipImport);

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

EipImport.description = `Push all media files in a given directory to EIP`;

module.exports = EipImport;