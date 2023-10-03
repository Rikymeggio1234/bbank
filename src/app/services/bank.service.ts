import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isNil, omitBy } from 'lodash';
import { BehaviorSubject, ReplaySubject, catchError, combineLatest, of, switchMap, throwError } from 'rxjs';

export interface Filters {
  num: number;
  startDate: Date;
  endDate: Date;
  categoryId: string;
}

export interface Categories {
  category: string;
  typology: "Entrata" | "Uscita" | "New Account",
  id: string;  
}

export interface Transactions {
  date: Date;
  amount: number;
  balance: number;
  categoryid: Categories;
  description: string;
}

export interface ListTransactions {
  transactions: Transactions[];
}

@Injectable({
  providedIn: 'root'
})
export class BankService {  
  private _filters$ = new BehaviorSubject<Filters | null>(null);
  filters$ = this._filters$.asObservable();
  private _requestUpdate$ = new ReplaySubject<void>();

  transactions$ = combineLatest([
    this._requestUpdate$,
    this.filters$
  ]).pipe(
    catchError(err => {
      console.log(err);
      throwError(err);
      return []
    }),
    switchMap(
      ([_, filters]) => {
        const q = omitBy(filters, isNil);
        return this.http.get<ListTransactions>("/api/transaction/research", {params: q})
          .pipe(
            catchError(err => of([]))
          )
      }
    )
  )

  constructor(private http: HttpClient) {
    this._requestUpdate$.next();
  }

  changeFilters(q: Filters){
    this._filters$.next(q);
  }
}
