class Cookie {
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];
  
  type;
  ligne;
  colonne;
  htmlImage;
  // booléan pour savoir si il est déjà selectionné
  selection = false;

  // pour savoir si notre cookie est à supprimer
  marked = false;

  constructor(type, ligne, colonne) {
    // A FAIRE
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;
    this.htmlImage = new Image(80,80); // createElement('img')
    // Pour donner la taille, aussi possible this.htmlImage.width = 80
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
    // Les images peuvent avoir des lignes et des colones !
    this.htmlImage.dataset.ligne = this.ligne;
    this.htmlImage.dataset.colonne = this.colonne;
  }
  
  setSelection(bool) {
    //console.log('selection set : ', bool);
    this.selection = bool;
  }

  estSelectionne(){
    //console.log('selection = ', this.selection);
    return this.selection;
  }

  selectionnee() {
    //console.log('est selectionné');
    // on change l'image et la classe CSS
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
    // On change la class (CSS) de ce cookie
    this.htmlImage.classList.add("cookies-selected");
    // On change l'état de la case
    this.setSelection(true);
  }

  deselectionnee() {
    //console.log('est déselectionné');
    if(this.type !== null){
    // on change l'image
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
    // On change la class (CSS) de ce cookie
    this.htmlImage.classList.remove("cookies-selected");
    // On change l'état de la case
    this.setSelection(false);
    }
  }

  static swapCookies(c1, c2) {
    //console.log("SWAP C1 C2");
    // On échange leurs images et types
    let swapType = c1.type;
    let swapSrc = c1.htmlImage.src;
    let swapMarked = c1.marked;

    c1.type = c2.type;
    c1.htmlImage.src = c2.htmlImage.src;
    c1.marked = c2.marked;

    c2.type = swapType;
    c2.htmlImage.src = swapSrc;
    c2.marked = swapMarked;

    // et on remet les désélectionne
    c1.deselectionnee();
    c2.deselectionnee();
  }

  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    //console.log("Distance = " + distance);
    return distance;
  }
  
}