// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  livelogWSConnectionString: 'ws://131.159.30.173:2506/?topic=adTopic',
  discoveryRestAPIBaseURI: 'http://131.159.30.173:2505/api/v1/ad/'

};
