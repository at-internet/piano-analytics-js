describe('useSendBeacon configuration :', function () {
    let globalPA;
    beforeEach(function () {
        Utility.clearStorage(pa);
        (typeof window !== 'undefined') && (window.pdl = undefined);
    });
    afterEach(function () {
        globalPA = undefined;
        Utility.clearStorage(pa);
    });
    it('Should default useSendBeacon to false in exported configuration', function () {
        expect(pa.cfg.cloneData().useSendBeacon).to.equal(false);
    });
    it('Should expose useSendBeacon as false on a new instance when not overridden', function () {
        globalPA = new pa.PA(pa.cfg.cloneData());
        expect(globalPA.getConfiguration('useSendBeacon')).to.equal(false);
    });
    it('Should allow useSendBeacon to be set to true explicitly', function () {
        const custom = pa.cfg.cloneData();
        custom.useSendBeacon = true;
        globalPA = new pa.PA(custom);
        expect(globalPA.getConfiguration('useSendBeacon')).to.equal(true);
    });
    it('Should allow useSendBeacon to be set to false explicitly', function () {
        const custom = pa.cfg.cloneData();
        custom.useSendBeacon = false;
        globalPA = new pa.PA(custom);
        expect(globalPA.getConfiguration('useSendBeacon')).to.equal(false);
    });
});
