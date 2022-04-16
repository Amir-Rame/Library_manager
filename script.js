// storage and restoration

let library = [];
let searchState=0;

if(localStorage.getItem("library-storage") !== null){
    library = JSON.parse(localStorage.getItem("library-storage"));
}

// show add form

let addButton = document.getElementById('add-btn');
let cancelButton = document.getElementById('cancel');
let overlay = document.getElementsByClassName('overlay');
let modal = document.getElementsByClassName('modal');
let form = document.getElementById('add-book');

let bookSubmit = document.getElementById('book-submit');
let bookEdit = document.getElementById('book-edit');

addButton.addEventListener('click',()=>{
    showModal('add');
    form.children[0].focus();
})

overlay[0].addEventListener('click',()=>{
    hideModal();
})
cancelButton.addEventListener('click',()=>{
    hideModal();
})

function hideModal(){
    overlay[0].classList.remove('overlay-active');
    modal[0].classList.remove('modal-active');
}

function showModal(status){
    overlay[0].classList.add('overlay-active');
    modal[0].classList.add('modal-active');
    form.reset();
    if(status=='add'){
        bookSubmit.style.display='block';
        bookEdit.style.display='none';
    }else if(status=='edit'){
        bookSubmit.style.display='none';
        bookEdit.style.display='block';
    }
}

//add book

bookSubmit.addEventListener('click',()=>{
    if(form.children[0].value=='' ||
        form.children[1].value==''||
        form.children[2].value==''){
        alert('please fill all the inputs.');
    }else{
        library.push(new book(form.children[0].value,
        form.children[1].value,
        form.children[2].value,
        form.children[4].checked,
        library.length));
        hideModal();
        search();
        store();
    }
})

//edit book

bookEdit.addEventListener('click',()=>{
    if(form.children[0].value=='' ||
        form.children[1].value==''||
        form.children[2].value==''){
        alert('please fill all the inputs.');
    }else{
        let currentBook = bookEdit.getAttribute('data-index');
        library[currentBook].title=form.children[0].value;
        library[currentBook].author=form.children[1].value;
        library[currentBook].pages=form.children[2].value;
        library[currentBook].status=form.children[4].checked;
        hideModal();
        search();
        store();
    }
})

//constructor


function book(title,author,pages,status,index){
    this.title=title;
    this.author=author;
    this.pages=pages;
    this.status=status;
    this.index=index;
}

book.edit = function(){
    showModal('edit');
    form.children[0].value=library[this.getAttribute('data-index')].title;
    form.children[1].value=library[this.getAttribute('data-index')].author;
    form.children[2].value=library[this.getAttribute('data-index')].pages;
    form.children[4].checked=library[this.getAttribute('data-index')].status;
    bookEdit.setAttribute('data-index',this.getAttribute('data-index'));
}
book.remove = function(){
    if(confirm('Are You sure about deleting this book from Library?')){
        library.splice(this.getAttribute('data-index'),1);
        for(let i=0;i<library.length;i++){
            library[i].index=i;
        }
        search();
        store();
    }

}

//display
const bookHolder = document.getElementById('book-holder');

function display(array=library){
    bookHolder.innerHTML='';
    //order & sorting functions:
    let newArray =[];
    newArray=[...array];
    if(orderInput.value=='t1'){
        newArray.sort((a,b)=>{
            if ( a.title.toLowerCase() < b.title.toLowerCase()){
                return -1;
            }
            if ( a.title.toLowerCase() > b.title.toLowerCase()){
                return 1;
            }
            return 0;
        })
    }else if(orderInput.value=='t2'){
        newArray.sort((a,b)=>{
            if ( a.title.toLowerCase() < b.title.toLowerCase()){
                return 1;
            }
            if ( a.title.toLowerCase() > b.title.toLowerCase()){
                return -1;
            }
            return 0;
        })
    }else if(orderInput.value=='a1'){
        newArray.sort((a,b)=>{
            if ( a.author.toLowerCase() < b.author.toLowerCase()){
                return -1;
            }
            if ( a.author.toLowerCase() > b.author.toLowerCase()){
                return 1;
            }
            return 0;
        })
    }else if(orderInput.value=='a2'){
        newArray.sort((a,b)=>{
            if ( a.author.toLowerCase() < b.author.toLowerCase()){
                return 1;
            }
            if ( a.author.toLowerCase() > b.author.toLowerCase()){
                return -1;
            }
            return 0;
        })
    }else if(orderInput.value=='p1'){
        newArray.sort((a,b)=>{
            return parseInt(a.pages) -parseInt(b.pages);
        })
    }else if(orderInput.value=='p2'){
        newArray.sort((a,b)=>{
            return parseInt(a.pages) -parseInt(b.pages);
        }).reverse();
    }
    //Element creation :
    newArray.forEach(e=>{
    const bookItem = document.createElement('div');
    const bookTitle = document.createElement('h2');
    const bookAuthor = document.createElement('h3');
    const bookPages = document.createElement('span');
    const bookStatus  = document.createElement('span');
    const bookEdit = document.createElement('button');
    const bookRemove = document.createElement('button');
    const bookIndex = document.createElement('span');

    bookTitle.innerText=e.title;
    bookAuthor.innerText=e.author;
    bookPages.innerText=`${e.pages} pg`;
    if(e.status==true){
         bookStatus.innerText='Status: Read';
         bookStatus.style.backgroundColor='var(--btn-status-1)'
    }else{
        bookStatus.innerText='Status: Not read';
         bookStatus.style.backgroundColor='var(--btn-status-2)'
    }
    bookEdit.innerText='Edit';
    bookRemove.innerText='Remove';
    bookIndex.innerText=e.index;

    bookItem.classList.add('book-item');

    bookHolder.append(bookItem);
    bookItem.append(bookTitle);
    bookItem.append(bookAuthor);
    bookItem.append(bookPages);
    bookItem.append(bookStatus);
    bookItem.append(bookEdit);
    bookItem.append(bookRemove);
    bookItem.append(bookIndex);

    bookEdit.setAttribute('data-index',e.index);
    bookRemove.setAttribute('data-index',e.index);
    
    bookEdit.addEventListener('click',book.edit);
    bookRemove.addEventListener('click',book.remove);
    })
    const log = document.getElementsByClassName('library-log');
    log[0].children[0].innerText=`Total Books: ${library.length}`
    log[0].children[1].innerText=`Total Pages: ${pageCount()}`
    log[0].children[2].innerText=`Completed Books: ${Completed()}`
}

//log
function pageCount(){
    let total=0;
    for(let i=0;i<library.length;i++){
        total +=parseInt(library[i].pages);
    }
    return total;
}

function Completed(){
    let completedBooks = library.filter(e => e.status==true);
    return completedBooks.length;
}

//search and display management
let searchInput = document.getElementById('search-input');
let searchInfo = document.getElementById('search-info');

searchInput.addEventListener('input',()=>{
    search();
})

function search(){
    let titleResult= library.filter(e=>e.title.includes(searchInput.value));
    let authorResult= library.filter(e=>e.author.includes(searchInput.value));
    let searchResult = titleResult.concat(authorResult);
    searchResult = searchResult.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.title === value.title && t.author === value.author
        ))
    )//filter simular results
    searchResult.sort((a,b)=>{
        return parseInt(a.index) -parseInt(b.index);
    })//sort it
    if(searchInput.value==''){
        searchInfo.style.display='none';
        display();
    }else{
        display(searchResult);
        searchInfo.style.display='block';
        searchInfo.innerText=`You Searched For: ${searchInput.value}`
    }
}

//order
const orderInput = document.getElementById('order-input');
orderInput.addEventListener('change',()=>{
    search();
});

//store
function store(){
    localStorage.setItem("library-storage", JSON.stringify(library));
}
//on load
display();
// ;3
