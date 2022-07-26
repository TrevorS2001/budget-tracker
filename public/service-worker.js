const VERSION = 'version_01';
const APP = 'BudgetTracker-';
const CACHE = APP + VERSION;

const FILE_CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js',
    './manifest.json',
    './js/idb.js',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
];

self.addEventListener('activate',function(e){
    e.waitUntil(
        caches.keys().then(function (keyList){
            let cacheList=keyList.filter(function (key){
                return key.indexOf(APP);
            });
        cacheList.push(CACHE);
        return Promise.all(keyList.map(function (key, i){
                if (cacheList.indexOf(key)===-1){
                    return caches.delete(keyList[i]);
             }
            }));
        })
    )
});
self.addEventListener('install',function(e){
    e.waitUntil(
        caches.open(CACHE).then(function(cache){
        return cache.addAll(FILE_CACHE)
        })
)
});

self.addEventListener('fetch',function(e){
    e.respondWith(
        caches.match(e.request).then(function (request){
            if (request){
                return request
            } else{ 
            return fetch(e.request)
        }
     })
    )
});

self.addEventListener('activate',function(e){
    e.waitUntil(
        caches.keys().then(function(keyList){
            let cacheKeeplist=keyList.filter(function (key){
                return key.indexOf(APP);
            });
            cacheKeeplist.push(CACHE);
            return Promise.all(keyList.map(function (key, i){
                if (cacheKeeplist.indexOf(key) === -1){
                return caches.delete(keyList[i]);
                }
        }));
        })
)
});
