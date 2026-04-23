import "./AppInfoModal.css";

export function AppInfoModal() {
  return (
    <>
      <p className="info-main">
        LUKINA-sovelluksen avulla voit harjoitella äänteiden kestoeroihin ja
        diftongeihin liittyvien oikeinkirjoitusvirheiden tunnistamista ja
        korjaamista. Sovellus on suunnattu yläasteikäisille ja sitä vanhemmille
        nuorille sekä aikuisille, joilla on lukemisen ja kirjoittamisen
        haasteita. Sovellus mahdollistaa itsenäisen harjoittelemisen omassa
        rauhassa, mutta sen käyttäminen samanaikaisesti jonkun toisen läsnä
        ollessa mahdollistaa kaikkien vihjetyyppien hyödyntämisen (tästä lisää
        myöhemmin).
      </p>

      <p className="info-main">
        Tutkimuksissa on havaittu, että oikeinkirjoitusvirheiden havaitseminen
        voi olla haastavaa henkilöille, joilla on lukemisen ja kirjoittamisen
        haasteita [1–3]. Suomen kielessä yleisiä oikeinkirjoituksen virheitä
        ovat esimerkiksi äänteiden kestoeroihin ja diftongeihin liittyvät
        virheet [4–8]. Sovelluksen tarkoituksena on suunnata käyttäjän huomiota
        tietoisempaan oman tekstin tarkistamiseen ja korjaamiseen, jolloin
        käyttäjä voi kiinnittää näihin asioihin enemmän huomiota myös arjessa.
        Tämänkaltaisesta strategiaopetuksesta (eng. strategy instruction) on
        saatu hyviä tuloksia useissa meta-analyyseissa [9–11].{" "}
      </p>

      <p className="info-main">
        Virheiden korjaamisen yhteydessä käyttäjä voi tarvittaessa pyytää
        vihjeen, joka perustuu tutkimuskirjallisuudessa lupaaviksi havaittuihin
        itsekorjaamisen strategioihin (eng. self-correction strategies) [12].
        Vihje mahdollistaa erityisesti ”cover-copy-compare”-menetelmän käytön
        sovelletusti. Menetelmän vaiheet sovelluksessa ovat seuraavat:{" "}
      </p>

      <p className="info-sub">
        1. käyttäjä katsoo oikein kirjoitetun sanan ja peittää sen sulkemalla
        moduulin (=cover)
      </p>
      <p className="info-sub">
        2. käyttäjä kirjoittaa sanan sille tarkoitettuun kenttään (=copy)
      </p>
      <p className="info-sub">
        3. käyttäjä painaa lopuksi ”tarkista”, jolloin sovellus antaa palautteen
        (=sovelletusti compare)
      </p>
      <p className="info-sub">
        4. jos sana on oikein, käyttäjä siirtyy seuraavaan sanaan
      </p>
      <p className="info-sub">
        5. jos sana on väärin, käyttäjä yrittää uudelleen ja tarvittaessa kopioi
        sanan tekstikenttään
      </p>

      <br />

      <p>
        Varsinaisen sovellukseen rakennetun vihjeen lisäksi käyttäjää
        kannustetaan myös pyytämään jotakuta lukemaan teksti ääneen. Ääneen
        luettua tekstiä voidaan käyttää valmiin tekstin oikeinkirjoituksen
        tarkistamisen välineenä [2, 13, 14], ja tekstin kuuntelu voikin auttaa
        havaitsemaan oikeinkirjoituksen virheitä [13, 14].
      </p>

      <br />

      <p>Lähteet:</p>
      <p className="info-sub">
        1. Mazur, A., & Chenu, F. (2023). The revision process during
        handwritten text production: The case of French higher education
        students with dyslexia. Dyslexia, 29(2), 116–135.{" "}
        <a
          href="https://doi.org/10.1002/dys.1734"
          target="_blank"
          rel="noopener noreferrer"
          className="info-link"
        >
          https://doi.org/10.1002/dys.1734
        </a>
      </p>
      <p className="info-sub">
        2. Paloneva, M.-S. & Mäkipää, J.-P. (2019). Oppimateriaalien ja
        lukiapuvälineiden saavutettavuus. Teoksessa M. Takala & L. Kairaluoma
        (toim.), Lukivaikeudesta lukitukeen (s.176–197). Gaudeamus.
      </p>
      <p className="info-sub">
        3. Sumner, E., & Connelly, V. (2020). Writing and Revision Strategies of
        Students With and Without Dyslexia. Journal of Learning Disabilities,
        53(3).{" "}
        <a
          href="https://doi.org/10.1177/0022219419899090"
          target="_blank"
          rel="noopener noreferrer"
          className="info-link"
        >
          https://doi.org/10.1177/0022219419899090
        </a>
      </p>
      <p className="info-sub">
        4. Aro, M. (2017). Learning to read Finnish. Teoksessa L. Verhoeven & C.
        Perfetti (Toim.), Learning to read across languages and writing systems
        (s. 416–436).{" "}
        <a
          href="https://doi.org/10.1017/9781316155752.017"
          target="_blank"
          rel="noopener noreferrer"
          className="info-link"
        >
          https://doi.org/10.1017/9781316155752.017
        </a>
      </p>
      <p className="info-sub">
        5. Ahvenainen, O., & Holopainen, E. (2014). Lukemis- ja
        kirjoittamisvaikeudet: teoreettista taustaa ja opetuksen perusteita
        [Uudistettu painos]. Special Data.
      </p>
      <p className="info-sub">
        6. Kairaluoma, L. & Takala, M. (2019). Johdanto lukivaikeuteen.
        Teoksessa M. Takala & L. Kairaluoma (toim.), Lukivaikeudesta lukitukeen
        (s. 11–24). Gaudeamus.
      </p>
      <p className="info-sub">
        7. Lyytinen, H., Erskine, J., Hämäläinen, J., Torppa, M., & Ronimus, M.
        (2015). Dyslexia: early Identification and Prevention: Highlights from
        the Jyväskylä Longitudinal Study of Dyslexia. Current Developmental
        Disorders Reports, 2(4), 330-338.{" "}
        <a
          href="https://doi.org/10.1007/s40474-015-0067-1"
          target="_blank"
          rel="noopener noreferrer"
          className="info-link"
        >
          https://doi.org/10.1007/s40474-015-0067-1
        </a>
      </p>
      <p className="info-sub">
        8. Marinus, E., Torppa, M., Hautala, J., & Aro, M. (2022). Spelling in
        Finnish: the case of the double consonant. Reading & Writing, 35(5),
        1157–1176.{" "}
        <a
          href="https://doi.org/10.1007/s11145-021-10217-7"
          target="_blank"
          rel="noopener noreferrer"
          className="info-link"
        >
          https://doi.org/10.1007/s11145-021-10217-7
        </a>
      </p>
      <p className="info-sub">
        9. Gillespie, A., & Graham, S. (2014). A Meta-Analysis of Writing
        Interventions for Students With Learning Disabilities. Exceptional
        Children, 80(4), 454–473.{" "}
        <a
          href="https://doi.org/10.1177/0014402914527238"
          target="_blank"
          rel="noopener noreferrer"
          className="info-link"
        >
          https://doi.org/10.1177/0014402914527238
        </a>
      </p>
      <p className="info-sub">
        10. Kokkali, V., & Antoniou, F. (2024). A meta-analysis of almost 40
        Years of research: Unreleasing the power of written expression in
        students with learning disabilities. Educational Research Review, 42,
        Article 100592.{" "}
        <a
          href="https://doi.org/10.1016/j.edurev.2024.100592"
          target="_blank"
          rel="noopener noreferrer"
          className="info-link"
        >
          https://doi.org/10.1016/j.edurev.2024.100592
        </a>
      </p>
      <p className="info-sub">
        11. Rogers, L. A., & Graham, S. (2008). A Meta-Analysis of Single
        Subject Design Writing Intervention Research. Journal of Educational
        Psychology, 100(4), 879–906.{" "}
        <a
          href="https://doi.org/10.1037/0022-0663.100.4.879"
          target="_blank"
          rel="noopener noreferrer"
          className="info-link"
        >
          https://doi.org/10.1037/0022-0663.100.4.879
        </a>
      </p>
      <p className="info-sub">
        12. Williams, K. J., Walker, M. A., Vaughn, S., & Wanzek, J. (2017). A
        Synthesis of Reading and Spelling Interventions and Their Effects on
        Spelling Outcomes for Students With Learning Disabilities. Journal of
        Learning Disabilities, 50(3), 286–297.{" "}
        <a
          href="https://doi.org/10.1177/0022219415619753"
          target="_blank"
          rel="noopener noreferrer"
          className="info-link"
        >
          https://doi.org/10.1177/0022219415619753
        </a>
      </p>
      <p className="info-sub">
        13. Mossige, M., Arendal, E., Kongskov, L., & Svendsen, H. B. (2023).
        How do technologies meet the needs of the writer with dyslexia? An
        examination of functions scaffolding the transcription and proofreading
        in text production aimed towards researchers and practitioners in
        education. Dyslexia, 29(4), 408–425.{" "}
        <a
          href="https://doi.org/10.1002/dys.1752"
          target="_blank"
          rel="noopener noreferrer"
          className="info-link"
        >
          https://doi.org/10.1002/dys.1752
        </a>
      </p>
      <p className="info-sub">
        14. Almgren Bäck, G., Mossige, M., Bundgaard Svendsen, H., Rønneberg,
        V., Selenius, H., Berg Gøttsche, N., Dolmer, G., Fälth, L., Nilsson, S.,
        & Svensson, I. (2024). Speech-to-text intervention to support text
        production among students with writing difficulties: a single-case study
        in nordic countries. Disability and Rehabilitation: Assistive
        Technology, 19(8), 3110–3129.{" "}
        <a
          href="https://doi.org/10.1080/17483107.2024.2351488"
          target="_blank"
          rel="noopener noreferrer"
          className="info-link"
        >
          https://doi.org/10.1080/17483107.2024.2351488
        </a>
      </p>
    </>
  );
}
