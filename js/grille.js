/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {

  nbColonnes;
  nbLignes;
  // tableau de cookies 
  tabCookies;
  // tableau des cookies selectionnés (2 max)
  cookiesCliquees = new Array;

  constructor(l, c) {
    this.nbLignes = l;
    this.nbColonnes = c;
    // On rempli notre grille avec les cookies
    this.remplirTableauDeCookies(6);
  }


  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      // Les index sont donnés de 0 à 81, il faut les convertir en lignes et colonnes
      let ligne = Math.floor(index / 9);  // reste
      let colonne = index % 9; // quotient

      //console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

      // on récupère le cookie qui est à cette position dans notre tableau
      let cookie = this.tabCookies[ligne][colonne];


      // on récupère son image
      let img = cookie.htmlImage;

      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);

      // On ajoute le 'onclick'
      let type = this.getCookieDepuisLC(ligne, colonne).type;

      // div.addEventListener("click", function (){console.log("ligne : ",ligne, ", colonne : ",colonne, ", type : ",type)});
      //div.addEventListener("click", (this.getCookieDepuisLC(ligne,colonne)).selectionnee); // Ne pas mettre les paranthèses de la fonction !
      //console.log(cookie.type);

      //const myTestObj = this;

      div.addEventListener("click",
        () => {

          if (cookie.estSelectionne() == false) { // N'est pas encore selectionné ?
            console.log('premier clic');
            cookie.selectionnee();

            if (this.cookiesCliquees == 0) {  // Si on a pas encore selectionné de cookie
              this.cookiesCliquees.push(cookie);
              console.log(this.cookiesCliquees);
            }
            else { //On a déjà un cookie qui a été selectionné
              if (Cookie.distance(this.cookiesCliquees[0], cookie) == 1) {
                // Je le rajoute au tableau
                this.cookiesCliquees.push(cookie);
                console.log(this.cookiesCliquees);
                // et on swap les deux 
                Cookie.swapCookies(this.cookiesCliquees[0], this.cookiesCliquees[1]);
                this.cookiesCliquees = [];

                // on vérifie si il y a alignement
                this.detecterLigneColonne();

              }
              else {
                // Si les 2 cookies ne sont pas à un de distance, alors on réinitialise tout
                this.cookiesCliquees[0].deselectionnee();
                cookie.deselectionnee();
                this.cookiesCliquees = [];
              }
            }
          }
          else {
            console.log('second clic');
            cookie.deselectionnee();
            // On doit le retirer de la liste
            let index = this.cookiesCliquees.indexOf(cookie);
            console.log('index retiré', index);
            this.cookiesCliquees.splice(index, 1);
          }

        });

      // rajouter getCookieDepuisLC(ligne, colonne).type quand ça marchera... static ?

      // On commence à drager une image
      img.ondragstart = (evt) => {
        //console.log('Drag start');
        this.cookiesCliquees = [];

        let premiereImg = evt.target;
        let cookieOrigine = this.getCookieDepuisLC(premiereImg.dataset.ligne, premiereImg.dataset.colonne);
        /*console.log("Ligne origine :" + cookieOrigine.ligne
          + ", colone origine :" + cookieOrigine.colonne);*/

        // On l'ajoute à notre tableau
        this.cookiesCliquees[0] = cookieOrigine;
        //console.log(this.cookiesCliquees);

        // Je récupère mon cookie avec ligne et colone

      }

      // https://stackoverflow.com/questions/32084053/why-is-ondrop-not-working
      img.ondragover = (evt) => {
        evt.preventDefault();
      }

      img.ondrop = (evt) => {
        //console.log('Drop');

        let img = evt.target;
        let cookie = this.getCookieDepuisLC(img.dataset.ligne, img.dataset.colonne);

        cookie.htmlImage.classList.remove("grilleDragOver");

        // On reprend le même code que pour le clic (factorisation possible)
        if (Cookie.distance(this.cookiesCliquees[0], cookie) == 1) {
          // Je le rajoute au tableau
          this.cookiesCliquees.push(cookie);
          //console.log(this.cookiesCliquees);
          // et on swap les deux 
          Cookie.swapCookies(this.cookiesCliquees[0], this.cookiesCliquees[1]);
          this.cookiesCliquees = [];

          // on vérifie si il y a alignement
          this.detecterLigneColonne();
        }
        else {
          // Si les 2 cookies ne sont pas à un de distance, alors on réinitialise tout
          this.cookiesCliquees[0].deselectionnee();
          cookie.deselectionnee();
          this.cookiesCliquees = [];
        }
      }

      img.ondragenter = (evt) => {
        //console.log("drag enter");
        let img = evt.target;
        let cookie = this.getCookieDepuisLC(img.dataset.ligne, img.dataset.colonne);
        cookie.htmlImage.classList.add("grilleDragOver");
      }

      img.ondragleave = (evt) => {
        //console.log("drag leave");
        let cookie = this.getCookieDepuisLC(img.dataset.ligne, img.dataset.colonne);
        cookie.htmlImage.classList.remove("grilleDragOver");
      }

    });
  }



  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    // A FAIRE
    this.tabCookies = create2DArray(this.nbLignes);
    for (let l = 0; l < this.nbLignes; l++) { // boucle sur les lignes
      let previous = []; //réinitialisé à chaque ligne
      let type;
      for (let c = 0; c < this.nbColonnes; c++) { // boucle sur les colones
        // https://www.w3schools.com/js/js_random.asp
        // Pour limiter les doubles sur les lignes
        if(c > 1) {
          while(type == previous[c-1]){
            type = Math.floor(Math.random() * 6); // Random entre 0 et 5
          }
        } else {
          type = Math.floor(Math.random() * 6);
        }
        previous.push(type);
        //console.log('Mon random est = '+type);
        this.tabCookies[l][c] = new Cookie(type, l, c);
      }
    }
  }

  getCookieDepuisLC(ligne, colonne) {
    return this.tabCookies[ligne][colonne];
  }

  detecterMatch3Lignes(ligne) {
    let ligneGrille = this.tabCookies[ligne];

    for (let l = 0; l < this.nbColonnes - 2; l++) {
      let cookie1 = ligneGrille[l];
      let cookie2 = ligneGrille[l + 1];
      let cookie3 = ligneGrille[l + 2];

      // On vérifie que les trois cookies qui se suivent sont du même type
      if (cookie1.type == cookie2.type && cookie2.type == cookie3.type) {
        //console.log('On en a au moins 3 !');
        cookie1.marked = true;
        //console.log("Cookie marqué : "+ cookie1.marked);
        cookie2.marked = true;
        cookie3.marked = true;
      }
    }
  }

  detecterMatch3Colonnes(colonne) {
    for (let l = 0; l < this.nbColonnes - 2; l++) {
      let cookie1 = this.tabCookies[l][colonne];
      let cookie2 = this.tabCookies[l + 1][colonne];
      let cookie3 = this.tabCookies[l + 2][colonne];

      // On vérifie que les trois cookies qui se suivent sont du même type
      if (cookie1.type == cookie2.type && cookie2.type == cookie3.type) {
        //console.log('On en a au moins 3 !');
        cookie1.marked = true;
        //console.log("Cookie marqué : "+ cookie1.marked);
        cookie2.marked = true;
        cookie3.marked = true;
      }
    }
  }

  detecterLigneColonne() {
    // check toutes les lignes
    for (let l = 0; l < this.nbLignes; l++) {
      this.detecterMatch3Lignes(l);
    }
    // Puis les colonnes
    for (let c = 0; c < this.nbColonnes; c++) {
      this.detecterMatch3Colonnes(c);
    }

    // enfin, on enlève ces cookies
    for (let l = 0; l < this.nbLignes; l++) {
      for (let c = 0; c < this.nbColonnes; c++) {
        //console.log(this.tabCookies[l][c]);
        if (this.tabCookies[l][c].marked) {
          //console.log("Un cookie est marqué et doit etre retiré");
          this.removeMarkedCookie(this.tabCookies[l][c]);
        }
      }
    }
  }

  // Tableau contenant les cases qui ont été vidées et qu'il faut remplacer
  //tabCookieARemplacer;

  /* On ne supprime pas l'objet cookie puisque celui ci contient sa position:
    une ligne et une colonne*/
  removeMarkedCookie(cookie) {
    //console.log("cookie supprimé");
    // On fixe le type à null pour, à posteriori, savoir quel cookie remplacer (chute)
    cookie.type = null;

    // On l'ajoute au tableau
    //this.tabCookieARemplacer.push(cookie);

    // On cache les cookies
    cookie.htmlImage.classList.add("cookies-cache");
    this.chute();

  }

  /* 1ere solution :
    on va balayer le tableau colonne par colonne (en partant du bas gauche)
    à la recherche d'une case vide. Si on en trouve une, on applique -1 à toutes
    les cases qui se trouvent au dessus (même colonne)*/
  /* 2eme solution :
    on balaye le tableau tabCookieARemplacer et on swap chacun de ces cookies
    vide avec son voisin du haut. Le type de celui du haut sera donc null.
  */
  chute() {
    // inutile de balayer la ligne 0, rien ne peut tomber du plafond...
    for (let l = (this.nbLignes - 1); l > 0; l--) {
      for (let c = 0; c < this.nbColonnes; c++) {
        let cookie = this.getCookieDepuisLC(l, c);
        let cookieDuDessus = this.getCookieDepuisLC(l - 1, c);

        if (cookie.type == null && cookieDuDessus.type != null) {
          //console.log("Candidat à la chute");
          // on swap le cookie null, avec son voisin du dessus
          Cookie.swapCookies(cookie, cookieDuDessus);
          cookieDuDessus.htmlImage.classList.add("cookies-cache");
          cookie.htmlImage.classList.remove("cookies-cache");
        }
        else if (cookie.type == null && l < 1) {// son voisin du dessus est nul et on est au max à ligne 3
          let cookiePlusHaut = this.getCookieDepuisLC(l - 2, c);
          let lignePlusHaute = l - 2;

          while (cookiePlusHaut.type == null && l > 0) { // tant qu'on a pas trouvé un autre candidat
            lignePlusHaute--;
            cookiePlusHaut = this.getCookieDepuisLC(lignePlusHaute, c);
          }

        }
      }
    }

  }

}
