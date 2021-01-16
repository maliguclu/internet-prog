import {Component, OnInit} from '@angular/core';
import {Donus} from '../../modeller/donus';
import {Router} from '@angular/router';
import {AuthService} from '../../servisler/auth.service';

@Component({
  selector: 'app-kayit-sayfa',
  templateUrl: './kayit-sayfa.component.html',
  styleUrls: ['./kayit-sayfa.component.css']
})
export class KayitSayfaComponent implements OnInit {
  donus: Donus = new Donus();

  ad: string = '';
  soyad: string = '';
  email: string = '';
  sifre: string = '';

  constructor(public authServis: AuthService, public router: Router) { }

  ngOnInit(): void { }

  KayitOl() {
    return this.authServis.KayitOl(this.ad, this.soyad, this.email, this.sifre).then(
      () => {
        this.donus.islem = true;
        this.donus.mesaj = 'Başarıyla kayıt olundu';
        this.router.navigate(['kesfet']);
      }
    ).catch(
      err => {
        this.donus.islem = false;
        this.donus.mesaj = 'Bu kullanıcı zaten mevcut';
      }
    );
  }

}
