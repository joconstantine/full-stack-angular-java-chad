import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
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
  currentCategoryId: number = 1;
  previousCategory: number = 1;
  currentCategoryName: string;
  searchMode: boolean;

  //properties for pagination
  thePageNumber: number = 1; //default to 1
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
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

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    //Check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get the "id" param string. Convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      // category id not available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books'
    }

    //
    // Check if we have a different category id
    // Not: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous
    // then set thePageNumber to 1
    if (this.previousCategory != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategory = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    //get the products with category id 
    this.productListSub = this.productService.getProductListPaginate(this.thePageNumber - 1, //page number is 0-based 
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(this.processResult())
  }

  private processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  handleSearchProducts() {
    const theKeyword = this.route.snapshot.paramMap.get("keyword");

    // if we have a different keyword than previous
    // then set thePageNumber to 1
    
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    //now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyword)
      .subscribe(this.processResult());
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1; // reset to 1
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
