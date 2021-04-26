import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  currentCategoryId: number;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
       this.listProducts();
    });
  }

  ngOnDestroy(): void {
    if (this.productListSub) {
      this.productListSub.unsubscribe();
    }
  }

  listProducts() {
    //Check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get the "id" param string. Convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      // category id not available ... default to category id 1
      this.currentCategoryId = 1;

    }

    //get the products with category id 
    this.productListSub = this.productService.getProductList(this.currentCategoryId).subscribe(
      (data: Product[]) => {
        this.products = data;
      }
    );
  }

}
