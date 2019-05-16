import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

interface IBikes {
  id: number;
  image: string;
  description: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  errorMessage = '';
  bikes: Array<IBikes> = [];
  name = '';
  confirmMessage = '';
  params = '';
  fullName: string;

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.bikes = await this.loadBikes();
  }

  async loadBikes() {
    let bikes = JSON.parse(localStorage.getItem('bikes'));
    if (bikes && bikes.length > 0) {
      // this.contacts = contacts;
    } else {
      bikes = await this.loadBikesFromJson();
    }
    console.log('from ngOnInit', this.bikes);
    this.bikes = bikes;
    return bikes;
  }

  async loadBikesFromJson() {
    const bikes = await this.http.get('assets/inventory.json').toPromise();
    return bikes.json();
  }

  calculate() {
    const subTotal = this.bikes.reduce((inc, item, i, array) => {
      inc += item.price * item.quantity;
      return inc;
    }, 0);
    const taxAmount = subTotal * .1;
    const total = subTotal + taxAmount;
    return {
      total: total,
      taxAmount: taxAmount,
      subTotal: subTotal,
      fullName: this.fullName,
    };
  }

  checkout() {
    const commaIndex = this.params.indexOf(',');
    const spaceIndex = this.params.indexOf(',') + 1;
    const space = this.params[spaceIndex];
    if (this.params === '') {
      this.toastService.showToast('warning', 3000, 'Must include name');
    } else if (commaIndex === -1) {
      this.toastService.showToast('warning', 3000, 'Must include comma');
      console.log('compute');
    } else if (space !== ' ') {
      this.toastService.showToast('warning', 3000, 'Must include space');
      console.log('compute');
    } else {
    const firstName = this.params.slice(commaIndex + 2, this.params.length);
    const lastName = this.params.slice(0, commaIndex);
    this.fullName = firstName + ' ' + lastName;
    console.log(this.fullName);
    const data = this.calculate();
    localStorage.setItem('calculatedData', JSON.stringify(data));
    this.router.navigate(['invoice', data]);
    console.log(data);
    }

  }

  addItem(item: string) {
    switch (item) {
      case 'bike1': {
      console.log('bike1');
        this.bikes.unshift({
          'id': 1,
          'image': '../../assets/bike1.jpeg',
          'description': 'Super Duper Fast Bike',
          'price': 5000,
          'quantity': 1
        });
        break;
      }
      case 'bike2': {
      console.log('bike2');
        this.bikes.unshift(  {
          'id': 2,
          'image': '../../assets/bike2.jpeg',
          'description': 'Super Fast Bike',
          'price': 4000,
          'quantity': 1
        });
        break;
      }
      case 'bike3': {
      console.log('bike3');
        this.bikes.unshift(  {
          'id': 3,
          'image': '../../assets/bike3.jpeg',
          'description': 'Fast Bike',
          'price': 3000,
          'quantity': 1
        });
        break;
      }
    }
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
    this.toastService.showToast('success', 1000, 'Success! Items saved.');
  }

  delete(index: number) {
    this.bikes.splice(index, 1);
    this.saveToLocalStorage();
  }
}
