import axios from 'axios';
import { emptyData, lembasWrapper } from '@hirez_io/lembas';
import { Post } from '@prisma/client';

export interface MinimumSetupData {
  posts: Post[];
}

const SERVER_BASE_URL = 'http://localhost:3333/api';

export async function minimumSetup() {
  return lembasWrapper(async () => {
    await emptyData();

    const fakePost = {
      title: 'FAKE POST 1',
    };

    await axios.post(`${SERVER_BASE_URL}/posts`, fakePost);

    const posts = await (await axios.get(`${SERVER_BASE_URL}/posts`)).data;

    return {
      posts,
    } as MinimumSetupData;
  });
}
