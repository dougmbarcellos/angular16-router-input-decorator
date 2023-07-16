import 'zone.js/dist/zone';
import {
  Component,
  inject,
  Input as RouteParam,
  Input as RouteQueryParam,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  RouterModule,
  Routes,
  withComponentInputBinding,
} from '@angular/router';
import { LoggerService } from './logger.service';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [
    `a { display: block; }`,
    `ul { border: 1px solid; }`,
    `.create { color: green; }`,
    `.change { color:blue; }`,
    `.destroy { color: red; }`,
  ],
  template: `
    Routes: <br> /page <br> /page/:id
    <h3>Go to</h3>
    <a [routerLink]="['/page']">/page</a>
    <a [routerLink]="['/page']" [queryParams]="{name: 'login'}">/page?name=login</a>
    <br>
    <a [routerLink]="['/page/10']">/page/10</a>
    <a [routerLink]="['/page/10']" [queryParams]="{name: 'login'}">/page/10?name=login</a>
    
    <router-outlet />

    <h3>Logs</h3>
    <ul *ngIf="loggerService.logList$ | async as logList">
      <li *ngFor="let log of logList; index as i" [ngClass]="log.type">{{log.description}}</li>
    </ul>
  `,
})
export class App {
  loggerService = inject(LoggerService);
}

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule],
  styles: [`ul { border: 1px solid; }`],
  template: `
    <h3>Page</h3>

    <ul>
      <li><b>@RouteParam()</b> id = {{id}}</li>
      <li><b>@RouteQueryParam()</b> name = {{name}}</li>
    </ul>
  `,
})
export class PageComponent {
  private loggerService = inject(LoggerService);
  @RouteParam() id: string | undefined;
  @RouteQueryParam() name: string | undefined;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.id && !changes.id.firstChange) {
      this.loggerService.addLog(
        'change',
        `id param change: ${changes.id.currentValue}`
      );
    }
    if (changes.name && !changes.name.firstChange) {
      this.loggerService.addLog(
        'change',
        `name queryParam change: ${changes.name.currentValue}`
      );
    }
  }

  ngOnInit() {
    this.loggerService.addLog('create', 'PageComponent created');
    this.loggerService.addLog('change', `id param change: ${this.id}`);
    this.loggerService.addLog('change', `name queryParam change: ${this.name}`);
  }

  ngOnDestroy() {
    this.loggerService.addLog('destroy', 'PageComponent destroyed');
  }
}

const routes: Routes = [
  {
    path: 'page/:id',
    component: PageComponent,
  },
  {
    path: 'page',
    component: PageComponent,
  },
];

bootstrapApplication(App, {
  providers: [provideRouter(routes, withComponentInputBinding())],
});
