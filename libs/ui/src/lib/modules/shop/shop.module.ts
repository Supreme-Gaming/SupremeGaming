import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UIFormsModule } from '../forms/forms.module';

import { DonationMethodSelectionComponent } from './components/donation-method-selection/donation-method-selection.component';
import { GamePlatformSelectionComponent } from './components/game-platform-selection/game-platform-selection.component';
import { DonationPackageSelectionComponent } from './components/donation-package-selection/donation-package-selection.component';
import { DonationRecipientSelectionComponent } from './components/donation-recipient-selection/donation-recipient-selection.component';
import { ShopService } from './services/shop/shop.service';
import { PipesModule } from '@supremegaming/common/ngx';

@NgModule({
  imports: [CommonModule, UIFormsModule, RouterModule, PipesModule],
  declarations: [
    DonationMethodSelectionComponent,
    GamePlatformSelectionComponent,
    DonationPackageSelectionComponent,
    DonationRecipientSelectionComponent,
  ],
  exports: [
    DonationMethodSelectionComponent,
    GamePlatformSelectionComponent,
    DonationPackageSelectionComponent,
    DonationRecipientSelectionComponent,
  ],
  providers: [ShopService],
})
export class ShopModule {}
