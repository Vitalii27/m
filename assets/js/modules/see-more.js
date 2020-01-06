export function seeMore() {
    let listNews = document.querySelector('.news');
    let pressReleasesNews = document.querySelector('.press-releases');

    let listRequest = (section) => {
        let list = section.querySelector('.news-list');
        let btn = section.querySelector('.see-more a');

        if (!btn) return

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            let wrapper = document.createElement('div');
            let href = btn.href;
            let xhr = new XMLHttpRequest();
            xhr.open('GET', href, false);
            xhr.send();
            if (xhr.status !== 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                wrapper.innerHTML = xhr.response;
                let [childList, childLink] = wrapper.children;

                let itemList = [...childList.querySelectorAll('li')];
                if (typeof childLink !== 'undefined') {
                    btn.href = childLink.querySelector('a').getAttribute('href');
                } else {
                    btn.style.display = 'none'
                }

                list.append(...itemList);
            }
        });
    };
    if (listNews) {
        listRequest(listNews);
    }
    if (pressReleasesNews) {
        listRequest(pressReleasesNews);
    }
}