import {gql} from "apollo-server";

export default gql`
	type Query {
		searchCoffeeShops(keyword : String!) : [CoffeeShop]
	}
`