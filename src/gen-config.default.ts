import chalk from "chalk";
import { Option } from './type'
const fs = require('fs-extra');


export default function genConfig(option: Option) {
  const { outputDir } = option;
  const code = `/**
 * This is an env aggregation default config.
 * (note) this is a minimum config.
*/
import * as path from 'path';
import { Config } from '@yunflyjs/yunfly';

const config = () => {
  const config: Config = {};

  /*
  * routing-controllers configs
  * 1. controllers、middlewares、authorizationChecker 需要使用path.join进行文件位置的绝对定位
  * 2. 如果 middlewares 、authorizationChecker中有rpc请求，则需要使用函数包裹。
  */
  config.routingControllersOptions = {
    defaultErrorHandler: false,
    controllers: [path.join(__dirname, '../controller/*')],
    middlewares: [path.join(__dirname, '../middleware/*')],
    // middlewares: [
    //   require(path.join(__dirname,'../middleware/xxxMiddleware')).default,
    // ]
    defaults: {
      nullResultCode: 200,  // 204 | 404
      undefinedResultCode: 200 // 204 | 404
    }
  };

  // body-parser config
  config.bodyParser = {
    enable: true,
    jsonLimit: '5mb',
    formLimit: '5mb',
    queryString: {
      parameterLimit: 5 * 1024 * 1024,
    },
  };

  // error config
  config.error = {
    enable: true,

    // use yunfly default error log.
    useYunflyLog: true,

    /**
     * error code
     * Type: number | true | Record<Key, Key>
     */
    errCode: true,

    // enable http state
    enableHttpCode: false,

    // enable rpc error message
    useRpcErrorMessage: true,

    // enable return rpc error message
    showMessageDetail: true,

    /* Customize your error fn. （Optional） */
    // customError: async (err: any, ctx: Context) => {}

    unhandledRejection: (err: any) => {
      console.error('UnhandledRejection error, at time', Date.now(), 'reason:', err);
    },
    uncaughtException: (err: any) => {
      console.error('uncaughtException error, at time', Date.now(), 'reason:', err);
    },
  };

  return config;
};

export default config;
`;

  fs.outputFileSync(`${outputDir}/src/config/config.default.ts`, code);
  console.info(chalk.green('generate src/config/config.default.ts file success.'))
}

