import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  products: any[] = [];
  name = '';
  price = 0;
  quantity = 0;

  constructor(private service: ProductService) {}

  ngOnInit() {
    this.service.login().subscribe(() => this.load());
  }

  load() {
    this.service.getProducts().subscribe((res: any) => {
      this.products = res.result;
    });
  }

  add() {
    this.service.createProduct({
      name: this.name,
      price: this.price,
      quantity: this.quantity
    }).subscribe(() => this.load());
  }

  delete(id: number) {
    this.service.deleteProduct(id).subscribe(() => this.load());
  }
}
