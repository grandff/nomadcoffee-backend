import {gql} from "apollo-server";

export default gql`
	type Query {
		seeUser(username : String!, page : Int!) : SeeUserResult!
	}
	
	type SeeUserResult {
		ok : Boolean!
		error : String
		followers : [User]
		followersPages : Int
		following : [User]
		followingPages : Int
	}
`