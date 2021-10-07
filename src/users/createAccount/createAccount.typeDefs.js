import {gql} from "apollo-server";

export default gql`
	type Mutation{
		createAccount(
			username : String!
			email : String!
			name : String!
			location : String!
			password : String!
		) : MutationResponse!  
	}
	
	type Query{
		dummy : String
	}
`;