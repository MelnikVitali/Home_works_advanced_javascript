/*- Создать поле 10*10 с помощью элемента ```<table>```.
- Суть игры: любая неподсвеченная ячейка в таблице на короткое время окрашивается в синий цвет. Пользователь должен в течение отведенного времени успеть кликнуть на закрашенную ячейку. Если пользователь успел это сделать, она окрашивается в зеленый цвет, пользователь получает 1 очко. Если не успел - она окрашивается в красный цвет, компьютер получает 1 очко.
- Игра длится до тех пор, пока половина ячеек на поле не будут окрашены в зеленый или красный цвет. Как только это случится, тот игрок (человек или компьютер), чьих ячеек на поле больше, побеждает.
- Игра должна иметь три уровня сложности, выбираемых перед стартом игры:
    - Легкий - новая ячейка подсвечивается каждые 1.5 секунды;
- Средний - новая ячейка подсвечивается раз в секунду;
- Тяжелый - новая ячейка подсвечивается каждые полсекунды.
- По окончании игры вывести на экран сообщение о том, кто победил.
- После окончания игры должна быть возможность изменить уровень сложности и начать новую игру.
- Обязательно использовать функционал ООП при написании приложения.
- При желании, вместо окрашивания ячеек цветом, можно вставлять туда картинки.*/

class GameWhackAMole {
    constructor() {
        this.table = document.querySelector('.table');
        this.cells = document.querySelectorAll(".cell");
        this.computerCounter = document.querySelector(".computer-count");
        this.playerCounter = document.querySelector(".player-count");
        this.winner = document.querySelector(".winner");
        this.easyLevel = document.getElementById("btn-easy");
        this.mediumLevel = document.getElementById("btn-medium");
        this.hardLevel = document.getElementById("btn-hard");
        this.newGame = document.getElementById("btn-new");

        this.score = 0;
        this.computerScore = 0;
        this.playerScore = 0;
        this.lastCell = null;
        this.endOfGame = this.cells.length / 5;
        this.speedGame = 0;
        this.timerId = null;

        this.table.addEventListener("click", (event) => this.catchPlayerScore(event));

        this.easyLevel.addEventListener("click", () => this.changeGameLevel(1500));

        this.mediumLevel.addEventListener("click", () => this.changeGameLevel(1000));

        this.hardLevel.addEventListener("click", () => this.changeGameLevel(500));

        this.newGame.addEventListener("click", () => this.startGame());
    }

    startGame() {
        if(this.timerId){
            clearTimeout(this.timerId);
        }

        this.playerScore = 0;
        this.computerScore = 0;
        this.winner.textContent = '';
        this.computerCounter.textContent = '0';
        this.playerCounter.textContent = '0';
        this.score = 0;
        this.timerId = null;

        this.removeCellsColor();
        this.activateLevelOfGame();

        this.table.removeEventListener("click", (event) => this.catchPlayerScore(event));

        this.easyLevel.removeEventListener("click", () => this.changeGameLevel(1500));

        this.mediumLevel.removeEventListener("click", () => this.changeGameLevel(1000));

        this.hardLevel.removeEventListener("click", () => this.changeGameLevel(500));
    }

    changeGameLevel(speed){
        this.disconnectLevelOfGame();

        this.speedGame = speed;

        this.paintCells();
    }

    getRandomCell() {
        const index = Math.floor(Math.random() * this.cells.length);

        const currentCell = this.cells[index];

        if (currentCell === this.lastCell
            || currentCell.classList.contains('cell-green')
            || currentCell.classList.contains("cell-red")
        ) {
            return this.getRandomCell();
        }

        this.lastCell = currentCell;

        return currentCell;
    }

    paintCells() {
        this.winner.textContent = '';

        const cell = this.getRandomCell();

        cell.classList.add("cell-blue");

        this.timerId = setTimeout(() => {
            cell.classList.remove('cell-blue');
            cell.classList.add('cell-red');
            this.score++;

            if (cell.classList.contains("cell-red")) {
                this.computerScore++;
            }

            if (cell.classList.contains("cell-green")) {

                this.computerScore--;
            }

            this.computerCounter.textContent = this.computerScore;

            if (this.score < this.endOfGame) {
                return this.paintCells();
            }

            return (this.score === this.endOfGame && this.computerScore > this.playerScore)
                ? this.winner.textContent = "Winner is Computer"
                : this.winner.textContent = "Winner is Player";

        }, this.speedGame);
    }

    catchPlayerScore(event) {
        if (!event.isTrusted && !event.target.classList.contains('cell-red')) return;

        if (event.target.classList.contains('cell-blue')) {
            event.target.classList.remove('cell-blue');
            event.target.classList.add('cell-green');

            this.playerScore++;
        }

        this.playerCounter.textContent = this.playerScore;
    }

    disconnectLevelOfGame() {
        this.easyLevel.disabled = true;
        this.mediumLevel.disabled = true;
        this.hardLevel.disabled = true;
    }

    activateLevelOfGame() {
        this.easyLevel.disabled = false;
        this.mediumLevel.disabled = false;
        this.hardLevel.disabled = false;
    }

    removeCellsColor() {
        this.cells.forEach(element => {
            element.classList.remove("cell-blue");
            element.classList.remove("cell-red");
            element.classList.remove("cell-green");
        });
    }
}

new GameWhackAMole();

