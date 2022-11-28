export interface IDonationGame {
  name: string;
  iconPath: string;
  value: string;
}

export interface IDonationPackage {
  sku: number;
  name: string;
  productImgPath: string;
  price: number;
  points: number;
}

export interface IDonationPackageEvent {
  pkg: IDonationPackage;
  type: 'add' | 'remove';
}

export interface ICartItem extends IDonationPackage {
  count: number;
}
