const bcrypt = require('bcryptjs');
const Event = require('../../models/Event');
const User = require('../../models/User');
const Booking = require('../../models/Booking');


// ARGS: Array[EventIds,..] => EVENTS Matching eventIDS
const events = async (eventIds)=>{

    try{
        const events = await Event.find({_id : { $in : eventIds}});
        return events.map( event => {
            return {
                ...event._doc,
                _id :event.id,
                date : new Date(event._doc.date).toISOString(),
                creator : user.bind(this,event._doc.creator),
            };
        })
    }catch(e){
        throw e;
    }
}

// ARGS: eventId(ObjectID) => event
const singleEvent = async (eventId)=>{
    try{
        const event = await Event.findById(eventId);
        if(!event){
            throw new Error("No Such Event Found!");
        }
        return {
            ...event._doc,
            _id :event.id,
            date : new Date(event._doc.date).toISOString(),
            creator : user.bind(this,event._doc.creator),
        }

    }catch(e){
        throw e;
    }
} 

const user = async (userId)=>{

    try{
        const user = await User.findById(userId);
        return {...user._doc,
                _id : user.id,
                createdEvents : events.bind(this,user._doc.createdEvents),
            };
    }catch(e){
        throw e;
    }
}

module.exports = {

    //GET ALL Events
    events : async ()=>{
        try{
            const events = await Event.find();
            return events.map(event => {
                return {...event._doc,
                        _id:event.id,
                        date : new Date(event._doc.date).toISOString(),
                        creator : user.bind(this,event._doc.creator)  
                    };
            });
        }catch(e){
            throw e;
        }
    },

    // GET ALL Bookings
    bookings : async()=>{
        try{
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._docs,
                    _id : booking.id,
                    user : user.bind(this,booking._doc.user),
                    event : singleEvent.bind(this,booking._doc.event),
                    createdAt : new Date(booking._doc.createdAt).toISOString(),
                    updatedAt : new Date(booking._doc.updatedAt).toISOString()
                }
            })
        }catch(e){

        }
    },

    // CREATE Events
    createEvent : async (args)=>{
        const {title, description, price, date} = args.eventInput;

        const event  = new Event({
            title, 
            description,
            price,
            date : new Date(date).toISOString(),
            creator : "6195eb214fb5486ca0ce2fa2"
        })
        try{

            const savedEvent = await event.save();

            const creator = await User.findById(savedEvent.creator);

            if(!creator){
                throw new Error("No user found!");
            }

            creator.createdEvents.push(savedEvent._doc._id);

            await creator.save();

            return {
                ...savedEvent._doc,
                _id:savedEvent.id,
                date : new Date(event._doc.date).toISOString(),
                creator : user.bind(this,savedEvent._doc.creator)
            };

        }catch(e){
            throw e;
        }
    },
    //CREATE A User 
    createUser : async (args)=>{
        
        try{

            const {userInput} = args;

            let user = await User.findOne({email : userInput.email});
            if(user){
                throw new Error('User Already Exists!');
            }

            const hashedPassword = await bcrypt.hash(userInput.password,12);
            
            user = new User({
                email : userInput.email,
                password : hashedPassword,
            })

            user = await user.save();

            return {...user._doc,
                    _id : user._doc._id.toString(),
                    password : null,
                }


        }catch(e){
            throw e;
        }
    },

    // Make a booking
    createBooking : async(args)=>{
        try{
            const {eventId} = args;

            const fetchedEvent = await Event.findById(eventId);

            if(!fetchedEvent){
                throw new Error("No Such Event Found!");
            }

            let booking = new Booking({
                event : eventId,
                user : "6195eb214fb5486ca0ce2fa2",
            })

            booking = await booking.save();

            return {
                ...booking._docs,
                _id : booking.id,
                event : singleEvent.bind(this,booking._doc.event),
                user : user.bind(this,booking._doc.user),
                createdAt : new Date(booking._doc.createdAt).toISOString(),
                updatedAt : new Date(booking._doc.updatedAt).toISOString(),
            }

        }catch(e){
            console.log(e);
            throw e;
        }
        
    },

    // CANCEL a Booking
    cancelBooking : async(args)=>{

        try{

            const {bookingId} = args;

            const fetchedBooking = await Booking.findById(bookingId).populate("event");
            if(!fetchedBooking){
                throw new Error("No Such Booking Found!");
            }
            console.log(fetchedBooking.event);
            const bookedEvent = fetchedBooking.event;
            await fetchedBooking.remove();

            return {
                ...bookedEvent,
                _id : bookedEvent._id.toString(),
                date : new Date(bookedEvent.date).toISOString(),
                title : bookedEvent.title,
                description : bookedEvent.description,
                creator : user.bind(this,bookedEvent.creator),
            };


        }catch(e){
            console.log(e);
            throw e;
        }

    }
}