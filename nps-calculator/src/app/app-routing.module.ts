import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NpsCalculatorComponent } from './nps-calculator/nps-calculator.component';

const routes: Routes = [
  { path: '', component: NpsCalculatorComponent }, // Set HomeComponent as the default route
  // Add other routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
