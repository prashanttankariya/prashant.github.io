const cacheName = 'v2';


//call install event
self.addEventListener('install', e => {
    console.log('Service Worker: Installed');

    //cached and wait until this
    // e.waitUntil(
    //     caches
    //     .open(cacheName)
    //     .then(cache => {
    //             console.log('Service Worker: Caching files');
    //             cache.addAll(cacheAssets);
    //     })
    //     .then(() => self.skipWaiting())
    //     .catch(err => {
    //             console.log('Getting file Asset error.');
    //     })
    // );
});

//call activated event
self.addEventListener('activate',(e) => {
    console.log('Service Worker: Activated');

    //remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                        if (cache !== cacheName) {
                            console.log('Service Worker: Clearing Old Cache');
                            return caches.delete(cache);
                        }
                })
            )
        })
    );
    
});


//call fetch event
self.addEventListener('fetch',e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
        .then(res => {
            //make copy / clone of response
            const resClone = res.clone();
            //open cache
            caches
            .open(cacheName)
            .then(cache => {
                //add response to cache
                cache.put(e.response,resClone);
            });
            return res;
        })
        .catch(err => caches.match(e.request).then(res => res))
    );
});