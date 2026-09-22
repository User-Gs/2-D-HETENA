# 2-D HETENA · Hetena Tatakai

12 karakter, seçilebilir skinler, üç arena ve Turnuva Modu içeren 2D zar tabanlı dövüş oyunu.

## Oyna

[Tarayıcıda oyna](https://user-gs.github.io/2-D-HETENA/)

## İndir ve aç

[Oyunu ZIP olarak indir](https://github.com/User-Gs/2-D-HETENA/archive/refs/heads/main.zip)

1. ZIP dosyasını **tamamen bir klasöre çıkar**.
2. Ana klasördeki **index.html** dosyasına çift tıkla. Chrome veya Edge ile aç.
3. **HETENA TATAKAI** düğmesine bas; sesler bu etkileşimden sonra etkinleşir.

Kurulum, Python, Node.js, hesap veya internet bağlantısı gerekmez. ZIP önizlemesinin içinden açma; klasör yapısını koru. Mobil cihazda çevrimiçi oynama bağlantısını kullan.

Görseller, skinler, arena ve yenilgi ekranları, saldırı/hurt/KO sesleri ve müzikler depoya dahildir. Dosyadan açıldığında sesler `offline-audio.js` içinden aynı MP3 verileriyle yüklenir. Çevrimiçi sürüm normal MP3 dosyalarını kullanır. Sesli anonsların sesi cihazın tarayıcı seslerine bağlıdır.

## Sürüm

Canlı oyunun 44. sürümünden (`73b00b696b45cbeec05ed9bf70cbc7404163c68b`) aktarılmıştır: üstte can barları, karşılıklı karakter yerleşimi, altta beyaz kaydırılabilir zar/yetenek paneli, gecikmeli sarı hasar animasyonu ve duruma göre karar veren bot. Aktarım, dövüş statlarını ve pasifleri değiştirmez.

## Geliştirme

Oyun kaynakları ve varlıklar `dist/` içindedir; derleme gerektirmez. `tests/` Node.js ile çalışan davranış kontrollerini içerir.

```sh
node tests/combat-passives.cjs
node tests/battle-feedback.cjs
node tests/ko-audio.cjs
node tests/arena-ambience.cjs
node tests/tournament-flow.cjs
python scripts/package.py
```

Paketleme komutu, özgün seslerden çevrimdışı ses paketini yeniden üretir; `downloads/Hetena-Tatakai.zip` ve SHA256 sağlama toplamını oluşturur.

## GitHub Pages

İlk kurulumda **Settings → Pages → Source → GitHub Actions** seçilir. `.github/workflows/pages.yml` ana dalın dosyalarını test ederek `dist/` klasörünü yayınlar. Bu ayar henüz etkin değilse çevrimiçi bağlantı açılmaz; indirilen oyun bağımsız çalışır.

Bu depo özgün görsel ve ses dosyalarını içerir. Ayrıca bir açık kaynak lisansı tanımlanmamıştır.
