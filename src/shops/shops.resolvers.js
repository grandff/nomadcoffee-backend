import client from "../client";

export default {	
	Category : {
		// 해당 카테고리에 해당되는 전체 커피숍 갯수
		totalShops : ({id}) => client.coffeeShop.count({
			where : {
				categories: {
					some : {
						id
					}
				}
			}
		})
	}
}