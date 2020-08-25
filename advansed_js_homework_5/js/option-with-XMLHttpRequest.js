/*
Отправить AJAX запрос по адресу https://swapi.co/api/films/ и получить список всех фильмов серии Звездные войны

    Для каждого фильма получить с сервера список персонажей, которые были показаны в данном фильме. Список персонажей
можно получить из свойства characters.
    Как только с сервера будет получена информация о фильмах, сразу же вывести список всех фильмов на экран. Необходимо
указать номер эпизода, название фильма, а также короткое содержание (поля episode_id, title и opening_crawl).
    Как только с сервера будет получена информация о персонажах какого-либо фильма, вывести эту информацию на экран под
названием фильма.
    Необходимо написать два варианта реализации в разных .js файлах. Один - с помощью XMLHttpRequest, другой с помощью
fetch или axios.
    Чтобы все AJAX запросы получения персонажей выполнялись параллельно, в реализации fetch/axios список персонажей из
каждого фильма необходимо получать с помощью функции Promise.all().
    Написать третий вариант реализации используя jQuery, с помощью $.get() или $.ajax().
Пока загружаются персонажи фильма, прокручивать под именем фильма анимацию загрузки. Анимацию можно использовать
любую. Желательно найти вариант на чистом CSS без использования JavaScript.
*/

class SwapiFilms {
    constructor() {
        this.container = document.getElementById('container');
        this.preloader = document.getElementById('preloader');
    }

    reg(link) {
        const request = new XMLHttpRequest();

        request.open('GET', link);
        request.responseType = 'json';
        request.send();

        return request;
    };

    showFilms() {
        // show loader
        this.preloader.classList.remove('close');

        const requestFilms = this.reg('https://swapi.co/api/films/');

        requestFilms.onload = () => {
            if (requestFilms.status !== 200) {
                //hide loader
                this.preloader.classList.add('close');

                console.log(`Error ${requestFilms.status}: ${requestFilms.statusText}`)
            } else {
                const container = document.getElementById('container'),
                    resultRequest = requestFilms.response.results;

                resultRequest.forEach(item => {
                    const divCards = document.createElement('div');
                    divCards.classList.add('card');
                    divCards.dataset.id = `${item.episode_id}`;
                    divCards.innerHTML = `<p><strong>Title</strong>: ${item.title}</p>
                                      <p><strong>Episode</strong>: ${item.episode_id}</p>
                                       <p><strong>BackStory</strong>: ${item.opening_crawl}</p>`;

                    container.append(divCards);

                    //hide loader
                    this.preloader.classList.add('close');
                });

                this.chowCharacterList(resultRequest);
            }
        };

        requestFilms.onerror = () => {
            //hide loader
            this.preloader.classList.add('close');

            console.log('Show Films error: "Connection error"');
        };
    }

    chowCharacterList(data) {
        data.forEach((item) => {
            const blockFilm = document.querySelector(`[data-id="${item.episode_id}"]`);

            const characters = item.characters;

            let strPerson = '';

            const divActors = document.createElement('div');

            divActors.classList.add('actors-list');

            characters.forEach(link => {
                const requestCharacters = this.reg(link);

                requestCharacters.onload = () => {
                    if (requestCharacters.status !== 200) {
                        console.log(`${requestCharacters.status}, ${requestCharacters.statusText}`);
                    } else {
                        strPerson += ` ${requestCharacters.response.name},`;
                    }

                    divActors.innerHTML = `<strong>Actors</strong>: ${strPerson.slice(0, -1)}`;

                    blockFilm.appendChild(divActors);
                };
                requestCharacters.onerror = () => {
                    console.log('Show Actors error: "Connection error"');
                };
            });

        });
    }
}

const swapiFilmsInstance = new SwapiFilms();

swapiFilmsInstance.showFilms();

