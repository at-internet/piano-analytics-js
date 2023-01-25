describe('User tag :', function () {
    let config = pa.cfg.cloneData();
    let globalPA;
    beforeEach(function () {
        Utility.clearStorage(pa);
        (typeof window !== 'undefined') && (window.pdl = undefined);
        globalPA = new pa.PA(config);
    });
    afterEach(function () {
        globalPA = undefined;
        Utility.clearStorage(pa);
    });
    it('Should add a user using setUser', function (done) {
        globalPA.setUser('123', '456789');
        expect(globalPA._properties['user_id']).to.deep.equal({
            value: '123',
            options: {
                persistent: true
            }
        });
        expect(globalPA._properties['user_category']).to.deep.equal({
            value: '456789',
            options: {
                persistent: true
            }
        });
        expect(globalPA._properties['user_recognition']).to.deep.equal({
            value: false,
            options: {
                persistent: true
            }
        });
        globalPA.getUser(function (userData) {
            expect(userData).to.deep.equal({
                id: '123',
                category: '456789'
            });
        });
        globalPA.sendEvent('toto', {}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['user_id']).to.equal('123');
                expect(model.build.data.events[0].data['user_category']).to.equal('456789');
                expect(model.build.data.events[0].data['user_recognition']).to.equal(false);
                globalPA._storage.getItem('pa_user', function(userdatastored){
                    expect(userdatastored).to.deep.equal({id: '123', category: '456789'});
                    done();
                });
            }
        });
    });
    it('Should add a user using setUser without storing it', function (done) {
        globalPA.setUser('123', '456789', false);
        expect(globalPA._properties['user_id']).to.deep.equal({
            value: '123',
            options: {
                persistent: true
            }
        });
        expect(globalPA._properties['user_category']).to.deep.equal({
            value: '456789',
            options: {
                persistent: true
            }
        });
        expect(globalPA._properties['user_recognition']).to.deep.equal({
            value: false,
            options: {
                persistent: true
            }
        });
        globalPA.getUser(function (userData) {
            expect(userData).to.deep.equal({
                id: '123',
                category: '456789'
            });
        });
        globalPA.sendEvent('toto', {}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['user_id']).to.equal('123');
                expect(model.build.data.events[0].data['user_category']).to.equal('456789');
                expect(model.build.data.events[0].data['user_recognition']).to.equal(false);
                globalPA._storage.getItem('pa_user', function(userdatastored){
                    expect(userdatastored).to.equal(null);
                    done();
                });
            }
        });
    });
    it('Should add a user from stored user data', function (done) {
        globalPA._storage.setItem('pa_user', {
            id : '321',
            category : '987654'
        }, null, function () {
            expect(globalPA._properties['user_id']).to.equal(undefined);
            expect(globalPA._properties['user_category']).to.equal(undefined);
            expect(globalPA._properties['user_recognition']).to.equal(undefined);
            globalPA.getUser(function (userData) {
                expect(userData).to.deep.equal({
                    id: '321',
                    category: '987654'
                });
            });
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model) {
                    expect(model.build.data.events[0].data['user_id']).to.equal('321');
                    expect(model.build.data.events[0].data['user_category']).to.equal('987654');
                    expect(model.build.data.events[0].data['user_recognition']).to.equal(true);
                    done();
                }
            });
        });
    });
    it('Should retrieve user properties set if no stored data using getUser', function () {
        globalPA._properties['user_id'] = {
            value: '123',
            options: {
                persistent: true
            }
        };
        globalPA._properties['user_category'] = {
            value: '456789',
            options: {
                persistent: true
            }
        };
        globalPA._properties['user_recognition'] = {
            value: false,
            options: {
                persistent: true
            }
        };
        globalPA.getUser(function (userData) {
            expect(userData).to.deep.equal({
                id: '123',
                category: '456789'
            });
        });
    });
    it('Should delete user data using deleteUser', function (done) {
        globalPA.setUser('123', '456789');
        expect(globalPA._properties['user_id']).to.deep.equal({
            value: '123',
            options: {
                persistent: true
            }
        });
        expect(globalPA._properties['user_category']).to.deep.equal({
            value: '456789',
            options: {
                persistent: true
            }
        });
        expect(globalPA._properties['user_recognition']).to.deep.equal({
            value: false,
            options: {
                persistent: true
            }
        });
        globalPA.getUser(function (userData) {
            expect(userData).to.deep.equal({
                id: '123',
                category: '456789'
            });
            globalPA.deleteUser();
            expect(globalPA._properties['user_id']).to.equal(undefined);
            expect(globalPA._properties['user_category']).to.equal(undefined);
            expect(globalPA._properties['user_recognition']).to.equal(undefined);
            globalPA.getUser(function (userData2) {
                expect(userData2).to.equal(null);
                done();
            })
        });
    });
});
