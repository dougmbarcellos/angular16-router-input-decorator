import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

type LogType = 'change' | 'create' | 'destroy';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private logList = new BehaviorSubject<
    { type: LogType; description: string }[]
  >([]);
  logList$ = this.logList.asObservable();

  addLog(type: LogType, description: string) {
    this.logList.next([...this.logList.getValue(), { type, description }]);
  }
}
