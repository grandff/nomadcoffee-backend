import client from "../../client";

export default {
	Query : {
		seeCoffeeShops : async(_, {offset, userId}) => client.coffeeShop.findMany({
			take : 30,
			skip : offset,
			orderBy : {
				createdAt : "desc"
			},
			/* 이게 맞나.. */
			include : {
				photos : true,
				categories : true,
				user : true
			}
		})
	}
}