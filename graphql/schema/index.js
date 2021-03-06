const {buildSchema} = require('graphql');

module.exports = buildSchema(`

                    type Booking{
                        _id : ID!
                        event : Event!
                        user : User!
                        createdAt : String!
                        updatedAt : String!
                    }

                    type Event{
                        _id : ID!
                        title : String!
                        description: String!
                        price: Float!
                        date: String!
                        creator: User!
                    }

                    type User{
                        _id : ID!
                        email : String!
                        password : String
                        createdEvents : [Event!]
                    }

                    input EventInput{
                        title : String!
                        description : String!
                        price: Float!
                        date: String!
                    }

                    input UserInput{
                        email : String!
                        password : String!
                    }

                    type rootQuery{
                        events:[Event!]!
                        bookings:[Booking!]!
                    }

                    type rootMutation{
                        createEvent(eventInput:EventInput):Event
                        createUser(userInput:UserInput):User
                        createBooking(eventId:ID!):Booking!
                        cancelBooking(bookingId:ID!):Event!
                    }
                    schema{
                        query : rootQuery
                        mutation : rootMutation
                    }
                `)