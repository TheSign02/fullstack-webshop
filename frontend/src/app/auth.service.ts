import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth/login';

  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.value;

  // A BehaviorSubject holds the current value (true/false)
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private getUserFromStorage() {
    const data = localStorage.getItem('user_data');
    console.log(data);
    return data ? JSON.parse(data) : null;
  }

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_data', JSON.stringify(response.user));
          this.isLoggedInSubject.next(true); // Notify subscribers
        }
      }),
    );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const logoutUrl = 'http://localhost:5000/api/auth/logout';
    return this.http
      .post(
        logoutUrl,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .pipe(
        tap((response: any) => {
          this.clearSess();
        }),
        catchError((err) => {
          this.clearSess();
          throw err;
        }),
      );
  }

  private clearSess() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);
  }
  getJWTFromCallback(): Observable<any> {
    // We return the Observable so the component can wait for it
    return this.http.get('/api/auth/google/callback', { withCredentials: true }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.handleOAuthLogin(response.token);
        }
      }),
    );
  }

  /**
   * Central method to save token, decode user, and notify UI
   */
  handleOAuthLogin(token: string): Observable<boolean> {
    localStorage.setItem('auth_token', token);

    try {
      const decoded: any = jwtDecode(token);
      localStorage.setItem('user_data', JSON.stringify(decoded));
      this.userSubject.next(decoded);
      this.isLoggedInSubject.next(true);
    } catch (e) {
      console.error('Invalid token format', e);
    }
    return of(true);
  }
  // auth.service.ts
  checkServerSession(): Observable<any> {
    // Use 'withCredentials: true' to tell Angular to send cookies to the server
    return this.http.get('http://localhost:5000/api/auth/status', { withCredentials: true }).pipe(
      tap((user: any) => {
        if (user) {
          // If the server recognizes the cookie, update our local state
          this.userSubject.next(user);
          this.isLoggedInSubject.next(true);
          // If the server returns a JWT in the JSON body, save it here too
          if (user.token) localStorage.setItem('auth_token', user.token);
        }
      }),
      catchError((err) => {
        this.clearSess();
        return throwError(() => err);
      }),
    );
  }
}
