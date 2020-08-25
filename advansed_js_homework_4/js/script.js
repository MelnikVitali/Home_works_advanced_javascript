/*- Создать класс, который позволит имитировать поведение колонки на сервисе [Trello](https://trello.com/).
- Класс должен выводить на экран колонку фиксированной ширины.
- Колонка должна показывать содержимое в виде карточек.
- При первом рендере колонка будет пустая.
- В самом низу колонки должна быть кнопка "Добавить карточку". После нажатия на данную кнопку в нижней части колонки перед кнопкой должна появиться новая пустая карточка, в которую можно добавить какой-нибудь текст.
- Существующие карточки можно перетягивать вверх и вниз, меняя их порядок в колонке.
- В верхней части колонки должна быть кнопка для сортировки карточек в колонке по алфавиту. После сортировки карточки можно свободно перетягивать и менять местами.
- Для реализации перетягивания карточек использовать функционал HTML5 Drag&Drop.
- Пример финального результата: [Пример](./trello_example.png)
- В приложении должна быть возможность создать любое количество колонок.*/

class TaskBoard {
    constructor() {
        this.addNewColumn = document.getElementById('add-new-column');

        this.addNewColumn.addEventListener('click', () => {
            this.buildNewColumn();
        });

        this.idCounter = 1;

        this.buildNewColumn();
    }

    buildNewColumn() {
        const newColumn = document.createElement('div');
        newColumn.classList.add('task-column');
        newColumn.dataset.id = `column-${this.idCounter}`;

        this.addDropListener(newColumn);

        this.addNewColumn.before(newColumn);

        this.idCounter++;

        const taskColumnBlockTitle = document.createElement('div');
        taskColumnBlockTitle.classList.add('task-column__block-title');

        newColumn.append(taskColumnBlockTitle);

        const taskColumnTitle = document.createElement('input');
        taskColumnTitle.classList.add('task-column__title');
        taskColumnTitle.type = 'text';
        taskColumnTitle.value = 'Список дел';

        taskColumnBlockTitle.append(taskColumnTitle);

        const sortBtn = document.createElement('input');
        sortBtn.type = 'button';
        sortBtn.value = 'Сортировать';
        sortBtn.classList.add('task-column__sort-btn');

        taskColumnBlockTitle.append(sortBtn);

        sortBtn.addEventListener('click', (event) => this.sortCards(event));

        const closeBtn = document.createElement('button');
        closeBtn.className = "close-btn close-col";
        closeBtn.title = "Удалить колонку";

        taskColumnBlockTitle.append(closeBtn);

        closeBtn.addEventListener('click', () => {
            this.removeDropListener(newColumn);

            newColumn.remove();
        });

        const taskList = document.createElement('ul');
        taskList.classList.add('task-column__list');

        newColumn.append(taskList);

        const addNewTaskBtn = document.createElement('input');
        addNewTaskBtn.type = "button";
        addNewTaskBtn.value = "+ Добавить еще одну карточку";
        addNewTaskBtn.classList.add("task-column__add-btn");

        newColumn.append(addNewTaskBtn);

        addNewTaskBtn.addEventListener('click', (event) => {
            if (event.target.parentElement.querySelector('.task-card__message')) {
                return false;
            }

            this.generateCard(newColumn.dataset.id);
        });
    }

    generateCard(newColumnId, cardText = '') {
        const newTask = document.createElement('li');
        newTask.classList.add('task-card');
        newTask.dataset.id = `task-${this.idCounter}`;
        newTask.draggable = true;

        this.idCounter++;

        this.addDragListener(newTask);

        const taskList = document.querySelector(`[data-id="${newColumnId}"] .task-column__list`);

        taskList.append(newTask);

        const taskInput = document.createElement('textarea');
        taskInput.classList.add('task-card__message');
        taskInput.autofocus = true;
        taskInput.placeholder = 'Ввести заголовок для этой карточки';
        taskInput.innerText = cardText;
        taskInput.style.wordWrap = 'break-word ';

        newTask.append(taskInput);

        const addCardBtn = document.createElement('button');
        addCardBtn.classList.add('task-card__add-btn');
        addCardBtn.innerText = "Сохранить";

        addCardBtn.addEventListener('click', () => {
            if (taskInput.value === '') {
                return;
            }

            taskInput.style.display = 'block';

            newTask.textContent = taskInput.value;

            newTask.append(closeBtn);
        });

        newTask.append(addCardBtn);

        const closeBtn = document.createElement('button');
        closeBtn.className = "close-btn";
        closeBtn.title = "Удалить карточку";

        closeBtn.addEventListener('click', () => {
            this.removeDragListener(newTask);

            newTask.remove();
        });

        newTask.append(closeBtn);
    }

    sortCards(event) {
        const currentColumn = event.target.parentElement.parentElement;

        const unsortedCards = currentColumn.querySelectorAll('.task-card');

        if (unsortedCards.length === 0) {
            return false;
        }

        const listCards = unsortedCards[0].parentElement;


        const sortedCards = Array
            .from(unsortedCards)
            .sort(
                (a, b) => a.innerText.toLowerCase() > b.innerText.toLowerCase() ? 1 : -1
            )
            .map((elem) => {
                const newTask = document.createElement('li');
                newTask.classList.add('task-card');
                newTask.dataset.id = `${elem.dataset.id}`;
                newTask.draggable = true;
                newTask.textContent = `${elem.textContent}`;

                const closeBtn = document.createElement('button');
                closeBtn.className = "close-btn";
                closeBtn.title = "Удалить карточку";

                closeBtn.addEventListener('click', () => {
                    this.removeDragListener(newTask);

                    newTask.remove();
                });

                newTask.append(closeBtn);

                this.addDragListener(newTask);

                this.removeDragListener(elem);

                elem.remove();

                return newTask;
            });

        const taskList = document.createElement('ul');
        taskList.classList.add('task-column__list');

        taskList.append(...sortedCards);

        const blockTitle = currentColumn.querySelector('.task-column__block-title');
        blockTitle.after(taskList);

        this.addDropListener(taskList);

        listCards.remove();
    }

    addDragListener(newTask) {
        newTask.addEventListener('dragstart', this.handleDragStart.bind(this));
        newTask.addEventListener('dragenter', this.handleDragEnter.bind(this));
        newTask.addEventListener('dragover', this.handleDragOver.bind(this));
        newTask.addEventListener('dragleave', this.handleDragLeave.bind(this));
        newTask.addEventListener('dragend', this.handleDragEnd.bind(this));
    }

    removeDragListener(newTask) {
        newTask.removeEventListener('dragstart', this.handleDragStart.bind(this));
        newTask.removeEventListener('dragenter', this.handleDragEnter.bind(this));
        newTask.removeEventListener('dragover', this.handleDragOver.bind(this));
        newTask.removeEventListener('dragleave', this.handleDragLeave.bind(this));
        newTask.removeEventListener('dragend', this.handleDragEnd.bind(this));
    }

    addDropListener(taskList) {
        taskList.addEventListener('drop', (event) => this.handleDrop(event));
        taskList.addEventListener("dragover", (event) => this.handleAllowDrop(event));

    }

    removeDropListener(taskList) {
        taskList.removeEventListener('drop', (event) => this.handleDrop(event));
        taskList.removeEventListener("dragover", (event) => this.handleAllowDrop.bind(event));
    }

    handleDrop(event) {
        event.preventDefault();

        const data = event.dataTransfer.getData("text");

        const card = document.querySelector(`[data-id='${data}']`);

        switch (event.target.className) {
            case 'task-card over':
                event.target.after(card);
                break;
            case 'task-column__list':
                event.target.append(card);
                break;
            case 'task-column__add-btn':
                event.target.previousElementSibling.append(card);
                break;
            case 'task-column__sort-btn':
                event.target.parentElement.nextElementSibling.prepend(card);
                break;
            case 'task-column__title':
                event.target.parentElement.nextElementSibling.prepend(card);
                break;
            case 'task-column':
                event.target.lastElementChild.previousElementSibling.append(card);
                break;
            default:
                return;
        }
    }

    handleAllowDrop(event) {
        event.preventDefault();
    }

    handleDragStart(event) {
        event.dataTransfer.setData("text", event.target.dataset.id);

        event.target.style.opacity = '0.4';
    }

    handleDragOver(event) {
        if (event.preventDefault) {
            event.preventDefault();
        }

        event.dataTransfer.dropEffect = 'move';

        return false;
    }

    handleDragEnter(event) {
        event.target.classList.add('over');
    }

    handleDragLeave(event) {
        event.target.classList.remove('over');
    }

    handleDragEnd() {
        const cardLust = document.querySelectorAll('.task-card');

        [].forEach.call(cardLust, (col) => {
            col.classList.remove('over');

            col.style.opacity = '1';
        });
    }
}

new TaskBoard();
