import {gql} from "apollo-server";

export default gql`
	type CoffeeShop{
		id : Int!
		user : User
		userId : Int!
		name : String!
		caption : String
		latitude : String
		longitude : String
		photos : [CoffeeShopPhoto]
		categories : [Category]		
		createdAt: String!
		updatedAt : String!		
	}
	
	type Category{
		id : Int!
		category : String!
		slug : String
		shops : [CoffeeShop]
		totalShops : Int!
		createdAt : String!
		updatedAt : String!
	}
	
	type CoffeeShopPhoto{
		id : Int!
		url : String!
		shop : CoffeeShop
		shopId : Int!
		createdAt : String!
		updatedAt : String!
	}
`