const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/Event');

const app = express();

app.use(bodyParser.json());

const events = [];

app.use('/graphql',
    graphqlHTTP({
        schema: buildSchema(`

            type Event{
                _id : ID!
                title : String!
                description: String!
                price: Float!
                date: String!
            }

            input EventInput{
                title : String!
                description : String!
                price: Float!
                date: String!
            }

            type rootQuery{
                events:[Event!]!
            }

            type rootMutation{
                createEvent(eventInput:EventInput):Event
            }
            schema{
                query : rootQuery
                mutation : rootMutation
            }
        `),
        rootValue : {
            events : async ()=>{
                try{
                    const events = await Event.find();
                    return events.map(event => {
                        return {...event._doc,_id:event.id};
                    });
                }catch(e){
                    throw e;
                }
            },
            createEvent : async (args)=>{
                const {title, description, price, date} = args.eventInput;
        
                const event  = new Event({
                    title, 
                    description,
                    price,
                    date : new Date().toISOString()
                })
                try{
                    const savedEvent = await event.save();
                    return {...savedEvent._doc,_id:savedEvent._doc._id.toString()};

                }catch(e){
                    throw e;
                }
            }
        },
        graphiql : true
    })
);


mongoose.connect(
    `mongodb+srv://${
    process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
    }@cluster0.944gs.mongodb.net/${
    process.env.MONGO_DB
    }?retryWrites=true&w=majority`
    ).then(()=>{
        app.listen(3000,()=>{
            console.log('app running');
        });
    }).catch((e)=>{
        console.log(e);
    })


