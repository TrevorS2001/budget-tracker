let db;
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
        uploadTransaction();
    }
};

function saveRecord(record) {
    const  tranObjectStore = transaction.objectStore('new_transaction');
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    tranObjectStore.add(record);
}

function uploadTransaction() {
    const tranObjectStore = transaction.objectStore('new_transaction');
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const getAll = tranObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    const tranObjectStore = transaction.objectStore('new_transaction');
                    const transaction = db.transaction(['new_transaction'], 'readwrite');

                    tranObjectStore.clear();
                    alert('Transactions submitted!');


                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
}

window.addEventListener('online', uploadTransaction);