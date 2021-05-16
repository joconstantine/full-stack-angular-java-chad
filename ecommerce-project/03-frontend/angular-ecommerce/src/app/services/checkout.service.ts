import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<CheckoutRespose> {
    return this.httpClient.post<CheckoutRespose>(this.purchaseUrl, purchase);
  }
}

interface CheckoutRespose {
  orderTrackingNumber: string;
}