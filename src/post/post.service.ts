import { Injectable } from '@nestjs/common';
import { Post } from './post.interface';
import { of, from, Observable, empty } from 'rxjs';

@Injectable()
export class PostService {
  private posts: Post[] = [
    {
      id: 1,
      title: 'Generate a NestJS project',
      content: 'content',
      createdAt: new Date(),
    },
    {
      id: 1,
      title: 'Create CRUD RESTful APIs',
      content: 'content',
      createdAt: new Date(),
    },
    {
      id: 1,
      title: 'Connect to MongoDB',
      content: 'content',
      createdAt: new Date(),
    },
  ];

  findAll(keyword?: string): Observable<Post> {
    if (keyword) {
      return from(this.posts.filter(post => post.title.indexOf(keyword) >= 0));
    }

    return from(this.posts);
  }

  findById(id: number): Observable<Post> {
    const found = this.posts.filter(post => post.id === id);
    if (found.length > 0) {
      return of(found[0]);
    }
    return empty();
  }

  save(data: Post): Observable<Post> {
    const post = { ...data, id: this.posts.length + 1, createdAt: new Date() };
    this.posts = [...this.posts, post];
    return from(this.posts);
  }

  update(id: number, data: Post): Observable<Post> {
    this.posts = this.posts.map(post => {
      if (id === post.id) {
        post.title = data.title;
        post.content = data.content;
        post.updatedAt = new Date();
      }
      return post;
    });
    return from(this.posts);
  }

  deleteById(id: number): Observable<boolean> {
    const idx: number = this.posts.findIndex(post => post.id === id);
    if (idx >= 0) {
      this.posts.splice(idx);
      return of(true);
    }
    return of(false);
  }
}
