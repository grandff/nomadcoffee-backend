import client from "../../client";

export default {
	Query : {
		seeCoffeeShop : async (_, {id}) => client.coffeeShop.findUnique({
			where : {
				id
			}, 
			include:{
				photos : true,
				categories : true,
				user : true
			}
		})
	}
}