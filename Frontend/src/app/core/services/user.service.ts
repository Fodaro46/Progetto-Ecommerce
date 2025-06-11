import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalUser } from '@models/local-user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8083/localuser';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<LocalUser> {
    return this.http.get<LocalUser>(`${this.apiUrl}/me`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // usa il messaggio dal back-end, altrimenti fallback
          const msg =
            err.error?.message ||
            'Effettua il login per accedere alla sezione profilo';
          return throwError(() => new Error(msg));
        }
        return throwError(() => err);
      })
    );
  }
}
