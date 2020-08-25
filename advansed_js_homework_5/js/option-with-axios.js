class SwapiFilms {
    constructor() {
        this.container = document.getElementById('container');
        this.preloader = document.getElementById('preloader');
    }

    reg(link) {
        const authOptions = {
            method: "GET",
            url: link
        };

        return axios(authOptions)
            .then((response) => response.data)
            .catch((error) => console.log(error));
    };

    showFilms() {
        // show loader
        this.preloader.classList.remove('close');

        this.reg('https://swapi.co/api/films/')
            .then((data) => {
                // hide loader
                this.preloader.classList.add('close');

                const resultRequest = data.results;

                this.container.innerHTML = resultRequest.map(item => {
                    return `<div class="card" data-id="${item.episode_id}">
                                <p><strong>Title</strong>: ${item.title}</p>
                                <p><strong>Episode</strong>: ${item.episode_id}</p>
                                <p><strong>BackStory</strong>: ${item.opening_crawl}</p>
                                <div id="fountainG" class="close" data-load="${item.episode_id}">
                                    <div id="fountainG_1" class="fountainG"></div>
                                    <div id="fountainG_2" class="fountainG"></div>
                                    <div id="fountainG_3" class="fountainG"></div>
                                    <div id="fountainG_4" class="fountainG"></div>
                                    <div id="fountainG_5" class="fountainG"></div>
                                    <div id="fountainG_6" class="fountainG"></div>
                                    <div id="fountainG_7" class="fountainG"></div>
                                    <div id="fountainG_8" class="fountainG"></div>
                                </div>
                            </div>`;
                }).join('');
                return data.results;
            })
            .then((data) => this.chowCharacterList(data))
            .catch((error) => {
                //hide loader
                this.preloader.classList.add('close');

                console.log('Show Films error', error);
            });
    }

    chowCharacterList(data) {
        data.forEach((item) => {
            // show loader
            document.querySelector(`[data-load="${item.episode_id}"]`).classList.remove('close');

            const blockFilm = document.querySelector(`[data-id="${item.episode_id}"]`);
            const actors = item.characters.map((link) => this.reg(link));

            Promise.all(actors)
                .then(data => {
                    const userList = data.map(user => user.name).join(', ');

                    const p = document.createElement('p');
                    p.innerHTML = `<strong>Персонажи: </strong>${userList}`;

                    blockFilm.appendChild(p);
                    //hide loader
                    document.querySelector(`[data-load="${item.episode_id}"]`).classList.add('close');
                })
                .catch((error) => {
                    //hide loader
                    document.querySelector(`[data-load="${item.episode_id}"]`).classList.add('close');

                    console.log('Show Actors error', error);
                });
        });
    }
}

const swapiFilmsInstance = new SwapiFilms();

swapiFilmsInstance.showFilms();
