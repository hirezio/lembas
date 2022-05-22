import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Post, PrismaClient, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}

  async getPosts(): Promise<Post[]> {
    return this.prismaService.post.findMany();
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prismaService.post.create({
      data,
    });
  }
}
