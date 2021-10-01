import {gql} from "apollo-server";

export default gql`
	type Mutation{
		editProfile(		
			name : String
			location : String
			password : String
			passwordCheck : String
			avatarUrl : String
		) : MutationResponse!
	}
		
`