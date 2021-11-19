const bcrypt = require('bcryptjs');
const Event = require('../../models/Event');
const User = require('../../models/User');


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
    }
}