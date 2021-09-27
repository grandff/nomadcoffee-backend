import {gql} from "apollo-server";

export default gql`
	type Sample{
		id : Int!
		title : String!
		year : Int!
		genre : String
		createdAt : String!
		updatedAt : String!
	}

    type Query{
        samples : [Sample]
        sample(id : Int!) : Sample
    }

    type Mutation {
        createSample(title : String!, year : Int!, genre : String) : Sample
        deleteSample(id : Int!) : Sample
        updateSample(id : Int!, year : Int!) : Sample
    }
`;