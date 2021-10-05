import {gql} from "apollo-server";

export default gql`
	type Mutation {
		editCoffeeShop(
			id : Int!
			name : String
			caption : String
			latitude : String
			longitude : String
			file : Upload
		) : MutationResponse!
	}
`