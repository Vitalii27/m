export function showRating() {
  $(".rating").each(function () {
    let $this = $(this);
    let currentRate = Number($this.data("rating"));
    let int = Math.floor(currentRate);
    if (currentRate) {
      let starsHolder = $this.find(".star-holder");
      $(starsHolder).each(function (index, el) {
        let element = $(el).find(".progress-bar");
        if (index < int) {
          element.css("width", "100%");
        }
        if (index === int) {
          element.css("width", `${rest(currentRate, int)}%`)
        }
      })
    }
  });

  function rest(num, int) {
    if (num >= 1) {
      return Number((num % int).toFixed(1)) * 100
    }
    return num * 100
  }
}