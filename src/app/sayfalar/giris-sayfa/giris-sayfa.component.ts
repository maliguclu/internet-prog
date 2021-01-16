import { Component, OnInit } from '@angular/core';
import {Donus} from '../../modeller/donus';
import {AuthService} from '../../servisler/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-giris-sayfa',
  templateUrl: './giris-sayfa.component.html',
  styleUrls: ['./giris-sayfa.component.css']
})
export class GirisSayfaComponent implements OnInit {
  eposta: string = ""
  sifre: string = ""
  donus: Donus = new Donus();

  constructor(public authServis: AuthService, public router: Router) { }

  ngOnInit(): void {

  }

  GirisYap() {
    this.authServis.GirisYap(this.eposta, this.sifre).then(
      () => {
        this.donus.islem = true;
        this.donus.mesaj = "Giriş Başarılı"
        this.router.navigate(["kesfet"])
      },
    ).catch(
      err => {
        this.donus.islem = false;
        this.donus.mesaj = "Şifre yada Eposta yanlış"
      }
    )
  }
}
