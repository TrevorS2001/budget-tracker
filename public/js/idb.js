let db;
const request=indexedDB.open('budget_tracker', 1);

request.onupgradeneeded=function(event){
    const db=event.target.result;
    db.createObjectStore('transaction',{ autoIncrement: true });
};

request.onsuccess=function(event){
    db=event.target.result;
    if (navigator.onLine){
        upload();
    }
};

function saveRecord(record){
    const  tranObjectStore=transaction.objectStore('transaction');
    const transaction=db.transaction(['transaction'], 'readwrite');
    tranObjectStore.add(record);
}

function upload(){
    const tranObjectStore=transaction.objectStore('transaction');
    const transaction=db.transaction(['transaction'], 'readwrite');
    const getAll=tranObjectStore.getAll();
    getAll.onsuccess=function(){
        if (getAll.result.length > 0){
            fetch('/api/transaction',{
                method:'POST',
                body: JSON.stringify(getAll.result),
                headers:{
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
            }
         })
                .then(response => response.json())
                .then(serverResponse =>{
                    if (serverResponse.message){
                        throw new Error(serverResponse);
                    }
                    const tranObjectStore=transaction.objectStore('transaction');
                    const transaction=db.transaction(['transaction'], 'readwrite');
                    tranObjectStore.clear();

                    alert('Transactions submitted!');
                })
                .catch(error =>{
                    console.log(error);
                });
        }
    }
}
window.addEventListener('online', upload);