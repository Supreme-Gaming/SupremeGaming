import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { PipesModule } from '@supremegaming/common/ngx';

import { UIFormsModule } from '../forms/forms.module';
import { DonationMethodSelectionComponent } from './components/donation-method-selection/donation-method-selection.component';
import { GamePlatformSelectionComponent } from './components/game-platform-selection/game-platform-selection.component';
import { DonationPackageSelectionComponent } from './components/donation-package-selection/donation-package-selection.component';
import { DonationRecipientSelectionComponent } from './components/donation-recipient-selection/donation-recipient-selection.component';
import { DonationSelectionsReviewComponent } from './components/donation-selections-review/donation-selections-review.component';

@NgModule({
  imports: [CommonModule, UIFormsModule, RouterModule, PipesModule, ReactiveFormsModule],
  declarations: [
    DonationMethodSelectionComponent,
    GamePlatformSelectionComponent,
    DonationPackageSelectionComponent,
    DonationRecipientSelectionComponent,
    DonationSelectionsReviewComponent,
  ],
  exports: [
    DonationMethodSelectionComponent,
    GamePlatformSelectionComponent,
    DonationPackageSelectionComponent,
    DonationRecipientSelectionComponent,
    DonationSelectionsReviewComponent,
  ],
})
export class ShopModule {}
