const { db } = require('../util/admin')
const { validateNewRideData } = require('../util/validator')

// Provides all the rides for the user
exports.getAllRides = (request, response) => {
    db.collection('rides')
        .where('user', '==', request.user.handle)
        .limit(20)
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let rides = [];
            data.forEach(doc => {
                rides.push({
                    rideId: doc.id,
                    source: doc.data().source,
                    dest: doc.data().dest,
                    user: doc.data().userid,
                    createdAt: doc.data().createdAt,
                    scheduledDate: doc.data().scheduledDate,
                    scheduledTime: doc.data().scheduledTime,
                });
            });
            return response.json(rides);

        })
        .catch(err => {
            response.status(500).json({ err: 'Something went wrong' })
            console.log(err)
        })
}


// Creates new ride with the user and ride details
exports.postRide = (request, response) => {
    let newRide = {
        user: request.user.handle,
        source: request.body.source,
        dest: request.body.dest,
        scheduledDate: request.body.scheduledDate,
        scheduledTime: request.body.scheduledTime,
        createdAt: request.body.createdAt,
    }

    const { valid, errors } = validateNewRideData(newRide);
    if (!valid) return response.status(400).json({ errors })

    db.collection('rides')
        .add(newRide)
        .then(data => {
            return response.json({ msg: `Ride ${data.id} created successfully` })
        })
        .catch(err => {
            console.log(err)
            return response.status(500).json({ err: 'Something went wrong' })

        })
}