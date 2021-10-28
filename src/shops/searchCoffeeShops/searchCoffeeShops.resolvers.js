import client from "../../client";

export default {
	Query : {
		searchCoffeeShops : (_, {keyword}) =>
		client.coffeeShop.findMany({
			where : {
				OR : [
					{
						name : {
							contains : keyword
						}
					},
					{
						caption : {
							contains : keyword
						}
					},
					{
						categories : {
							some : {
								category : {
									contains : keyword
								}
							}
						}
					}
				]
			},
			select : {
				name : true,
				caption : true,
				photos : true,
				user : true,
				categories : true
			}
		})
	}
}