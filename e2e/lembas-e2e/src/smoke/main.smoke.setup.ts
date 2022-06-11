import axios from 'axios';
import { emptyData, lembasWrapper } from '@hirez_io/lembas';
import { Post } from '@prisma/client';
import { minimumSetup } from './minimum.smoke.setup';

export interface MainSetupData {
  posts: Post[];
}

const SERVER_BASE_URL = 'http://localhost:3333/api';

export default async function setup() {
  return lembasWrapper(async () => {
    const minimumData = await minimumSetup();

    const fakePost2 = {
      title: 'FAKE POST 2',
    };

    const fakePost3 = {
      title: 'FAKE POST 2 FAKE POST 1' + minimumData.posts[0].title,
    };

    await axios.post(`${SERVER_BASE_URL}/posts`, fakePost2);
    await axios.post(`${SERVER_BASE_URL}/posts`, fakePost3);

    const posts = await (await axios.get(`${SERVER_BASE_URL}/posts`)).data;

    return {
      posts,
    } as MainSetupData;
  });
}
