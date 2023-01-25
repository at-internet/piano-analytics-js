function User(pa) {
    const storageUser = pa.getConfiguration('storageUser');
    this.setUser = function (id, category, enableStorage) {
        const _user = {
            id: id,
            category: category
        };
        pa.setProperties({
            'user_id': id,
            'user_category': category,
            'user_recognition': false
        }, {
            persistent: true
        });
        if (enableStorage !== false) {
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (pa.getConfiguration('storageLifetimeUser') * 24 * 60 * 60 * 1000));
            pa._privacy.call('setItem', storageUser, _user, expirationDate);
        }
    };
    this.getUser = function (callback) {
        pa._storage.getItem(storageUser, function (data) {
            let userData = data;
            if (!data && pa._properties['user_id']) {
                userData = {
                    id: pa._properties['user_id'].value,
                    category: pa._properties['user_category'].value
                };
            }
            callback && callback(userData);
        });
    };
    this.deleteUser = function (callback) {
        pa.deleteProperty('user_id');
        pa.deleteProperty('user_category');
        pa.deleteProperty('user_recognition');
        pa._storage.deleteItem(storageUser, function () {
            callback && callback();
        });
    };
}

export {
    User
};
