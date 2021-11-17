const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');

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
            events : ()=>{
                return events;
            },
            createEvent : (args)=>{
                const {title, description, price, date} = args.eventInput;
                const event = {
                    _id : Math.random.toString(),
                    title, 
                    description,
                    price,
                    date : new Date().toISOString()
                }
                events.push(event);
                return event;
            }
        },
        graphiql : true
    })
);



app.listen(3000);