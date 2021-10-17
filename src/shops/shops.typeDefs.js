import {gql} from "apollo-server";

export default gql`
	scalar Date

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
		createdAt: Date!
		updatedAt : Date!		
	}
	
	type Category{
		id : Int!
		category : String!
		slug : String
		shops : [CoffeeShop]
		totalShops : Int!
		createdAt : Date!
		updatedAt : Date!
	}
	
	type CoffeeShopPhoto{
		id : Int!
		url : String!
		shop : CoffeeShop
		shopId : Int!
		createdAt : Date!
		updatedAt : Date!
	}
`