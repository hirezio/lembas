import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '@prisma/client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  posts$: Observable<Post[]>;

  constructor(private httpClient: HttpClient) {
    this.posts$ = this.httpClient.get<Post[]>('/api/posts');
  }
}
