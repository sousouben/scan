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
        let infoContainer = document.getElementById("info-container");
        infoContainer.innerHTML = ""; // Réinitialiser le contenu

        if (data.status === 1) {
          let ingredients =
            data.product.ingredients_text || "Ingrédients non disponibles";
          let glutenWarning = /gluten|blé|seigle|orge|avoine|triticale/i.test(
            ingredients
          )
            ? "<p style='color:red; font-weight:bold;'>Attention : Ce produit contient du gluten !</p>"
            : "<p style='color:green; font-weight:bold;'>Pas de gluten détecté dans les ingrédients.</p>";

          infoContainer.innerHTML = `
            ${glutenWarning}
            <p><strong>Ingrédients :</strong> ${ingredients}</p>
          `;
        } else {
          infoContainer.innerHTML =
            "<p style='color:orange; font-weight:bold;'>Produit non trouvé.</p>";
        }
      })
      .catch((error) => console.error("Erreur API :", error));
  });
});
