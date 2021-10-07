import client from "../../client";
import {categoryCheck} from "../../constants";

export default {
	Query : {
		seeCategory : (_, {category, offset}) => client.coffeeShop.findMany({
			take : 30,
			skip : offset,
			where : {				
				categories : {
					some : {
						category	
					}					
				}
			},
			include : {
				photos : true,
				categories : true,
				user : true
			}
		})
	}
}