import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[];
  productListSub: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProducts();
  }

  ngOnDestroy(): void {
    if (this.productListSub) {
      this.productListSub.unsubscribe();
    }
  }

  listProducts() {
    this.productListSub = this.productService.getProductList().subscribe(
      (data: Product[]) => {
        this.products = data;
      }
    );
  }

}
