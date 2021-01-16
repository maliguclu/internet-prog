import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {Cevap} from '../../modeller/cevap';
import {Soru} from '../../modeller/soru';
import {AuthService} from '../../servisler/auth.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {Uye} from '../../modeller/uye';
import {Begen} from '../../modeller/begen';
import {Kategori} from '../../modeller/kategori';

@Component({
  selector: 'app-soru-detay-sayfa',
  templateUrl: './soru-detay-sayfa.component.html',
  styleUrls: ['./soru-detay-sayfa.component.css']
})
export class SoruDetaySayfaComponent implements OnInit {
  soruRef: AngularFireObject<Soru>;
  soru: Soru = new Soru();

  constructor(public authServis: AuthService, public db: AngularFireDatabase, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.soruRef = this.db.object<Soru>('soru/' + this.route.snapshot.paramMap.get('id'));
    this.soruRef.snapshotChanges().pipe(
      map(
        change => {
          const soru: Soru = {id: change.key, ...change.payload.val()};

          this.db.list<Cevap>('cevap', ref => ref.orderByChild('soruId').equalTo(soru.id).limitToFirst(5))
            .snapshotChanges()
            .subscribe(cevapChanges => {
              soru.cevaplar = cevapChanges.map(cevapC => {

                const cevap: Partial<Cevap> = {
                  id: cevapC.key,
                  ...cevapC.payload.val()
                };

                this.db.list<Uye>('uye', ref => ref.orderByChild('kullaniciId').equalTo(cevapC.payload.val().kullaniciId))
                  .snapshotChanges()
                  .subscribe(uyeChanges => {
                    cevap.uye = {id: uyeChanges[0].key, ...uyeChanges[0].payload.val()};
                  });

                return cevap as Cevap;
              });
            });

          this.db.list<Begen>('begeni', ref => ref.orderByChild('soruId').equalTo(soru.id))
            .snapshotChanges()
            .subscribe(cevapChanges => {
              soru.begeniSayisi = cevapChanges.length;
            });

          this.db.list<Uye>('uye', ref => ref.orderByChild('kullaniciId').equalTo(soru.kullaniciId))
            .snapshotChanges()
            .subscribe(uyeChanges => {
              soru.uye = {
                id: uyeChanges[0].key,
                ...uyeChanges[0].payload.val()
              };
            });

          this.db.list<Kategori>('kategori', ref => ref.orderByKey().equalTo(soru.kategoriId))
            .snapshotChanges()
            .subscribe(kategoriChanges => {
              soru.kategori = {
                id: kategoriChanges[0].key,
                ...kategoriChanges[0].payload.val()
              };
            });

          return soru;

        }
      )
    ).subscribe(soru => this.soru = soru);

  }

  CevabimiSil(cevapId: string) {
    if (confirm('Emin misiniz?')) {
      return this.db.object<Cevap>('cevap/' + cevapId).remove();
    }
  }

}
