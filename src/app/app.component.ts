import {Component} from '@angular/core';
import {AuthService} from './servisler/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Güçlü Cevap';

  constructor(public authServis: AuthService, public router: Router) {

  }

  cikisYap() {
    this.authServis.CikisYap().then(() => {
      this.router.navigate(['giris']);
    });
  }
}
