// import { GlobalConfig } from '../src/app/_state/global-configuration/global-config.type';
// import { emptyDb, loadFromCache, loadOrGenerate } from './setup-data-utils';
// import axios from 'axios';
// import { SERVER_BASE_URL } from './setup-constants';
// import { UserCredentials } from '../src/app/_state/user/user-credentials.type';
// import { generateFakeLlama } from '../src/app/_state/llamas/llama.fake';
// import { generateFakeUserCredentials } from '../src/app/_state/user/user-credentials.fake';
// import { Llama } from '../src/app/_state/llamas/llama.type';
// import { User } from '../src/app/_state/user/user.type';

// export interface MinimumSetupData{
//   globalConfig: GlobalConfig;
//   firstUserCredentials: UserCredentials;
//   llamas: Llama[];
//   users: User[];
// }

export default async function setup() {
  return {
    folder: process.cwd(),
  };
  //   return loadOrGenerate(__filename, async () => {
  //     await emptyDb();

  //     // SETUP GLOBAL CONFIG
  //     const globalConfig: GlobalConfig = {
  //       numOfFeatured: 10
  //     }
  //     await axios.post(`${SERVER_BASE_URL}/config`, globalConfig);

  //     // CREATE USER
  //     const userCredentials = generateFakeUserCredentials();

  //     const response = await axios.post(`${SERVER_BASE_URL}/users`, userCredentials);
  //     const user = response.data.user;

  //     // CREATE A LLAMA FOR THAT USER
  //     const llama = generateFakeLlama({
  //       userId: user.id,
  //       imageFileName: '1.jpg',
  //       featured: true
  //     });

  //     await axios.post(`${SERVER_BASE_URL}/llamas`, llama);

  //     // HACK TO PERSIST DB
  //     await new Promise((resolve) => setTimeout(resolve.bind(null, null), 10));

  //     const fakeData = {
  //       globalConfig,
  //       users: [user],
  //       llamas: [llama],
  //       firstUserCredentials: userCredentials
  //     }

  //     return fakeData;
  //   });
}
