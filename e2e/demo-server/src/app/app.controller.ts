
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma, Post as PostModel } from '@prisma/client';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('posts')
  getPosts() {
    return this.appService.getPosts();
  }

  @Post('posts')
  createPost(@Body() postData: Prisma.PostCreateInput): Promise<PostModel> {
    return this.appService.createPost(postData);
  }
}
