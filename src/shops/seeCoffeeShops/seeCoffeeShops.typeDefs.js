import {gql} from "apollo-server";

export default gql`
	type Query {
		seeCoffeeShops(offset : Int!, userId : Int) : [CoffeeShop]
	}
`