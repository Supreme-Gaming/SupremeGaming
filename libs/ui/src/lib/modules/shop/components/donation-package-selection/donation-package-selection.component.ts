import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ICartItem, IDonationPackage, IDonationPackageEvent } from '../../interfaces/shop.interfaces';

@Component({
  selector: 'supremegaming-donation-package-selection',
  templateUrl: './donation-package-selection.component.html',
  styleUrls: ['./donation-package-selection.component.scss'],
})
export class DonationPackageSelectionComponent {
  @Output()
  public packageSelected: EventEmitter<IDonationPackageEvent> = new EventEmitter<IDonationPackageEvent>();

  @Input()
  public cartItems: Array<ICartItem>;

  public packages: Array<IDonationPackage> = [
    {
      sku: 1,
      name: 'Small Point Pack',
      productImgPath: 'assets/images/products/pack1.svg',
      price: 2.5,
      points: 300,
    },
    {
      sku: 2,
      name: 'Medium Point Pack',
      productImgPath: 'assets/images/products/pack2.svg',
      price: 5.0,
      points: 800,
    },
    {
      sku: 3,
      name: 'Large Point Pack',
      productImgPath: 'assets/images/products/pack3.svg',
      price: 10.0,
      points: 2000,
    },
    {
      sku: 4,
      name: 'Huge Point Pack',
      productImgPath: 'assets/images/products/pack4.svg',
      price: 25.0,
      points: 4500,
    },
    {
      sku: 5,
      name: 'Gigantic Point Pack',
      productImgPath: 'assets/images/products/pack5.svg',
      price: 50.0,
      points: 10000,
    },
  ];

  public changeAmount(pkg: IDonationPackage, type: 'add' | 'remove') {
    this.packageSelected.next({
      pkg,
      type,
    });
  }
}
