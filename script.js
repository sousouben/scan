document.addEventListener("DOMContentLoaded", function () {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#scanner-container"),
      },
      decoder: { readers: ["ean_reader"] },
    },
    function (err) {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
    }
  );

  Quagga.onDetected(function (result) {
    let code = result.codeResult.code;
    document.getElementById("result").innerText = "Code détecté : " + code;
    fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 1) {
          let ingredients =
            data.product.ingredients_text || "Ingrédients non disponibles";
          if (/sucre|sugar/i.test(ingredients)) {
            alert("Attention : Ce produit contient du sucre !");
          } else {
            alert("Pas de sucre détecté dans les ingrédients.");
          }
        } else {
          alert("Produit non trouvé.");
        }
      })
      .catch((error) => console.error("Erreur API :", error));
  });
});
