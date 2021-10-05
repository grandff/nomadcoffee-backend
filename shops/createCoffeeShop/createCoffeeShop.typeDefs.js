import {gql} from "apollo-server";

export default gql`
	type Mutation {
		createCoffeeShop(
			name : String!
			caption : String
			latitude : String
			longitude : String
			file : Upload!
		) : CoffeeShop
	}
`;