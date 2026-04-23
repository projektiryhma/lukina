import LukinaGamePhaseOne from "../assets/images/LukinaGamePhaseOne.png";
import LukinaGamePhaseTwo from "../assets/images/LukinaGamePhaseTwo.png";
import LukinaGamePhaseThree from "../assets/images/LukinaGamePhaseThree.png";

import "./GameInstructionsModal.css";

export const GameInstructionsModal = () => {
  return (
    <div className="instructions-modal-content">
      <h2>Pelin pikaohjeet</h2>
      <h3>Vaihe 1 - Lue ja etsi</h3>
      <p className="gameinstructionstext">
        Lue teksti ja valitse virheellisesti kirjoitetut sanat. Voit
        tarvittaessa pyytää vihjeen tai vaihtaa harjoiteltavan tekstin.
      </p>
      <h3>Vaihe 2 - Lue ja etsi</h3>
      <p className="gameinstructionstext">
        Korjaa virheellisesti kirjoitetut sanat yksitellen kirjoittamalla ne
        oikein annettuun tekstikenttään. Voit tarvittaessa pyytää vihjeen.
      </p>
      <h3>Vaihe 3 - Lue ja etsi</h3>
      <p className="gameinstructionstext">
        Lue vielä korjattu teksti tai pyydä toista henkilöä lukemaan teksti
        sinulle ääneen.
      </p>
      <h2>Pelin tarkemman ohjeet</h2>
      <p className="gameinstructionstext">
        Pelin avulla voit harjoitella äänteiden kestoeroihin ja diftongeihin
        liittyvien oikeinkirjoitusvirheiden tunnistamista ja korjaamista.
      </p>
      <p className="gameinstructionstext">
        Konsonanttien kestoero = yhden konsonantin ja kahden peräkkäisen
        konsonantin ero (esimerkiksi tu<u>l</u>i ja tu<u>ll</u>i; ku<u>k</u>a ja
        ku<u>kk</u>a)
      </p>
      <p className="gameinstructionstext">
        Vokaalien kestoero = yhden vokaalin ja kahden peräkkäisen vokaalin ero
        (esimerkiksi t<u>u</u>li ja t<u>uu</u>li; s<u>i</u>ka ja s<u>ii</u>ka)
      </p>
      <p className="gameinstructionstext">
        Diftongi = kaksi eri vokaalia peräkkäin samassa tavussa (esimerkiksi
        sanoissa t<u>uo</u>-li, lo-ma-p<u>äi</u>-vä ja e-h<u>ey</u>-ty-mi-nen)
      </p>
      <p className="gameinstructionstext">
        Pelin alussa voit valita, minkä pituisella tekstillä haluat harjoitella
        (1–2 virkkeen tekstit / 3–4 virkkeen tekstit / 5+ virkkeen tekstit).
        Valitun pituusluokan sisällä tekstit tulevat harjoiteltaviksi
        satunnaisessa järjestyksessä. Tavoitteena on etsiä teksteistä
        virheellisesti kirjoitetut sanat ja korjata ne. Pelissä on kolme
        vaihetta: LUE JA ETSI, LUE JA KORJAA sekä LUE KORJATTU TEKSTI.
        Tehtävissä on mahdollista hyödyntää vihjeitä.
      </p>
      <h3>VAIHE 1 - LUE JA ETSI</h3>
      <img src={LukinaGamePhaseOne} alt="" className="LukinaGamePictures" />
      <p className="instruction-main">
        1. Etsi tekstistä virheellisesti kirjoitetut sanat. Paina valitsemiasi
        sanoja, jolloin ne aktivoituvat.
      </p>
      <p className="instruction-main">
        2. Jos tarvitset apua, paina NÄYTÄ VIHJE. Saat tietää, montako
        virheellistä sanaa tekstissä on. Voit myös pyytää, että joku muu lukisi
        tekstin sinulle ääneen.
      </p>
      <p className="instruction-main">
        3. Kun olet valinnut sanat, paina TARKISTA.
      </p>
      <p className="instruction-main">
        4. Sovellus ilmoittaa, montako virheellistä sanaa olet löytänyt. Oikein
        valitut sanat korostuvat.
      </p>
      <p className="instruction-main">
        5. Jos kaikki sanat on löydetty, siirry seuraavaan vaiheeseen painamalla
        JATKA.
      </p>
      <p className="instruction-main">
        6. Jos kaikkia sanoja ei ole vielä löydetty, paina SELVÄ. Sanojen
        etsimistä jatketaan, kunnes kaikki virheelliset sanat on tunnistettu.
      </p>
      <h3>VAIHE 2 - LUE JA KORJAA</h3>
      <img src={LukinaGamePhaseTwo} alt="" className="LukinaGamePictures" />
      <p className="instruction-main">
        1. Lue vielä sama teksti uudelleen ja korjaa virheellisesti kirjoitetut
        sanat yksitellen annettuun tekstikenttään.
      </p>
      <p className="instruction-main">
        2. Jos tarvitset apua, paina NÄYTÄ VIHJE. Saat mallin oikein
        kirjoitetusta sanasta. Toimi seuraavasti:
      </p>
      <p className="instruction-sub">
        a. katso oikein kirjoitettu sana ja peitä se sulkemalla vihjeikkuna
      </p>
      <p className="instruction-sub">
        b. kirjoita sana annettuun tekstikenttään
      </p>
      <p className="instruction-sub">
        c. paina TARKISTA, jolloin sovellus antaa palautteen
      </p>
      <h3 className="phase3">VAIHE 3 – LUE KORJATTU TEKSTI</h3>
      <img src={LukinaGamePhaseThree} alt="" className="LukinaGamePictures" />

      <p className="instruction-main">
        1. Lue vielä korjattu teksti joko hiljaa mielessäsi tai ääneen. Voit
        myös pyytää, että joku muu lukisi tekstin sinulle ääneen.
      </p>
      <p className="instruction-main">
        2. Kun olet lukenut tekstin, paina JATKA. Voit jatkaa seuraavaan
        tekstiin tai siirtyä sovelluksen etusivulle. Etusivun kautta voit
        esimerkiksi vaihtaa harjoituksen tekstin pituutta painamalla SIIRRY
        PELIIN.
      </p>
    </div>
  );
};
