import service from "./service";

export default {
    getOnlineInfo(fkey) {
        return service.get("/member/" + fkey, {
            fkey: fkey,
        });
    },
    getSegment() {
        return service.get('/event/run/segment');
    },
    getSched() {
        return service.get('/event/run');
    },
    register(registrant, uuid, walkin) {
        return service.post('/event/run/register', {
            registrant: registrant,
            uuid: uuid,
            walkin: walkin,
        });
    },
    hasRegistered(uuid) {
        return service.get('/event/run/registered', {
            uuid: uuid,
        });
    },
    sendEmail(email) {
        return service.post('/event/run/email', {
            email: email
        });
    },
    
}