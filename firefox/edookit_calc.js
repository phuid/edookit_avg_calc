document.querySelectorAll(".evaluationsRow").forEach((row) => {
  var amount = 0;
  var total = 0;
  var pointtotal = 0; //separated in case of mixing, convertedeval is also counted
  var pointmax = 0;
  var ignored = 0;
  row.querySelectorAll(".summary-list > *").forEach((markSpan) => {
    // console.log(markSpan.title);
    var index = -1;
    ["Váha:", "Weight:"].forEach((base) => {
      var currentIndex = markSpan.title.indexOf(base);
      if (currentIndex != -1) {
        index = currentIndex + base.length;
      }
      if (markSpan.innerHTML.indexOf("not-included-in-overall-eval") != -1)
        index = -1;
    });
    if (index != -1) {
      var weight = Number(markSpan.title.substring(index));
      // console.log("weigth:" + weight);
      amount += weight;

      if (markSpan.innerHTML.indexOf("convertedEvaluation") === -1) {
        //normal mark 1-5
        var mark = markSpan.innerText.replace(",", "");
        if (mark.indexOf("/") != -1) {
          var first = Number(mark.substring(0, mark.indexOf("/")));
          var second = Number(mark.substring(mark.indexOf("/") + 1));
          mark = first + Math.abs(second - first) / 2;
        } else if (mark.indexOf("+") != -1) {
          var first = Number(mark.substring(0, mark.indexOf("+")));
          mark = first - 0.25;
        } else if (mark.indexOf("-") != -1) {
          var first = Number(mark.substring(0, mark.indexOf("-")));
          mark = first + 0.25;
        }
        // else {
        //   mark = Number(mark);
        // }
        // console.log("mark:" + mark + ", total added: " + mark * weight);
        total += mark * weight;
        markSpan.style.borderBottom = `thick solid rgb(${255*mark/5}, ${255-(255*mark/5)}, 0)`;
      } else {
        //point system
        var mark = markSpan.innerText.replace(",", "");
        if (mark.indexOf("/") != -1) {
          var slashIndex = mark.indexOf("/");
          var convertedIndex = mark.indexOf("(");
          var first = Number(mark.substring(0, slashIndex));
          var second = Number(
            mark.substring(slashIndex + 1, convertedIndex - 1)
          );

          var convertedString = markSpan.querySelector(".convertedEvaluation").innerText;
          var converted = convertedString.substring(convertedString.indexOf('(') + 1, convertedString.indexOf(')'));
          
          pointtotal += first * weight;
          pointmax += second * weight;
          total += converted * weight;

          // row.innerHTML += first + " " + second + " " + converted + "<br>";

          markSpan.style.borderBottom = `thick solid rgb(${255-(255*first/second)}, ${255*first/second}, 0)`;
        } else {
          console.error(
            "found converted eval, but not divider slash" +
              markSpan.DOCUMENT_POSITION_CONTAINED_BY +
              ": " +
              markSpan.title +
              "||" +
              mark
          );
        }
      }
    } else {
      console.warn(
        "mark not included" + markSpan.DOCUMENT_POSITION_CONTAINED_BY + ": " + markSpan.title
      );
      ignored++;
    }
  });
  // console.log(
  //   "total:" + total + ", amount:" + amount + ", final: " + total / amount
  // );
  row.innerHTML +=
    `<div style="float: right; position: absolute; right: 2rem; margin-top: -2.5rem;"> <span style="transform: translate(-5rem, 0);" title="total (součet známek)">${total}</span> / <span title="amount (počet známek)">${amount}</span> = <span title="average (aritmerický průměr)" style="font-size: 1.3rem;">${(
      total / amount
    ).toFixed(2)}</span> <span style="font-size: 0.8rem; color: grey;" title="ignored">(${ignored})</span>` +
    (pointmax > 0
      ? `<br><span title="point total (achieved points)">${pointtotal}</span>/<span title="point max (max possible points)">${pointmax}</span> = <span title="percentage" style="font-size: 1.3rem">${((pointtotal * 100) / pointmax).toFixed(2)}</span>`
      : "") +
    `</div>`;
});

/*
TODO:
  * váhy
  * bodové hodnocení
  * mnepočítat finalní a nehodnoceno
*/
